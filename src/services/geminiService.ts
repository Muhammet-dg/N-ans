import { CardType, DailyCardPayload } from '../types';
import { FALLBACK_WORDS } from '../data/fallbackWords';
import { FALLBACK_DRAWINGS } from '../data/fallbackDrawings';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const SYSTEM_INSTRUCTION = `Sen entelektüel derinliği yüksek bir felsefe, edebiyat, bilişsel bilimler küratörü ve klasik güzel sanatlar / eskiz ustasısın.
Görevin kullanıcıya her gün YALNIZCA BİR odak kartı üretmektir.
Üreteceğin kart, istenen türe göre ("KELIME" veya "CIZIM") şu standartlarda olmalıdır:

1. Eğer tür "KELIME" ise:
   - Az bilinen, derinliği olan zarif bir Türkçe kelime (ör. İstidat, Müşahede, Fehim, Teenni, Basiret, İnsiyak) VEYA felsefe, strateji, psikoloji ve bilişsel modeller dünyasından ufuk açıcı küresel bir kavram (ör. Amor Fati, Antifragile, Epistemik Tevazu, Pareto Etkisi, Wu Wei) seç.
   - Yüzeysel kişisel gelişim klişelerinden uzak dur; akademik ve edebi ağırlığı olan kavramlar sun.
   - "gunluk_gorev" alanında kullanıcının bu kavramı gün içinde bir diyalogda, yazıda veya zihinsel gözlemde nasıl somut olarak kullanacağını belirt.

2. Eğer tür "CIZIM" ise:
   - Sadece kağıt ve kurşun kalemle 10-15 dakikada uygulanabilecek mikro bir çizim/eskiz tekniği (ör. Çapraz Tarama, Kontur Tarama, Negatif Alan, Kör Kontur, Tek Kaçışlı Perspektif, Chiaroscuro, Form Basitleştirme, Işık Kırılması) seç.
   - "gunluk_gorev" alanında kullanıcının hemen masasında veya çevresinde bulabileceği bir nesneyle 10-15 dakikada yapabileceği somut eskiz egzersizini tarif et.

Yanıtını KESİNLİKLE sadece aşağıdaki geçerli JSON formatında döndür, markdown kod bloğu veya açıklama ekleme:
{
  "tur": "KELIME" | "CIZIM",
  "baslik": "Kavram veya Teknik Adı",
  "alt_baslik": "Köken / Ekol veya Çizim Alanı",
  "ozet": "1-2 cümlelik vurucu tanım",
  "detay": "Konunun felsefesi veya tekniğin kritik püf noktası",
  "gunluk_gorev": "Kağıt-kalemle yapılacak çizim veya kelimeyi kullanma aksiyonu",
  "ipucu": "Pratik bir püf nokta"
}`;

export function getFallbackCard(
  targetType: CardType,
  excludeTitles: string[] = [],
  dateSeed?: string
): DailyCardPayload {
  const pool = targetType === 'KELIME' ? FALLBACK_WORDS : FALLBACK_DRAWINGS;
  const normalizedExcludes = new Set(excludeTitles.map((t) => t.toLowerCase().trim()));

  const available = pool.filter(
    (card) => !normalizedExcludes.has(card.baslik.toLowerCase().trim())
  );

  const candidates = available.length > 0 ? available : pool;

  if (dateSeed) {
    let hash = 0;
    for (let i = 0; i < dateSeed.length; i++) {
      hash = (hash << 5) - hash + dateSeed.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % candidates.length;
    return candidates[index];
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

function validateCardPayload(raw: unknown, fallbackType: CardType): DailyCardPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const tur: CardType =
    obj.tur === 'KELIME' || obj.tur === 'CIZIM' ? obj.tur : fallbackType;

  const baslik = typeof obj.baslik === 'string' ? obj.baslik.trim() : '';
  const alt_baslik = typeof obj.alt_baslik === 'string' ? obj.alt_baslik.trim() : '';
  const ozet = typeof obj.ozet === 'string' ? obj.ozet.trim() : '';
  const detay = typeof obj.detay === 'string' ? obj.detay.trim() : '';
  const gunluk_gorev = typeof obj.gunluk_gorev === 'string' ? obj.gunluk_gorev.trim() : '';
  const ipucu = typeof obj.ipucu === 'string' ? obj.ipucu.trim() : '';

  if (!baslik || !ozet || !detay || !gunluk_gorev) {
    return null;
  }

  return {
    tur,
    baslik,
    alt_baslik: alt_baslik || (tur === 'KELIME' ? 'Entelektüel Kavram' : 'Eskiz Tekniği'),
    ozet,
    detay,
    gunluk_gorev,
    ipucu: ipucu || 'Odaklanarak yapılan 10 dakikalık bilinçli pratik, saatler süren dağınık çabadan üstündür.'
  };
}

export async function generateDailyCard(options: {
  apiKey: string;
  targetType: CardType;
  excludeTitles?: string[];
  dateSeed?: string;
}): Promise<{ payload: DailyCardPayload; source: 'AI' | 'FALLBACK' }> {
  const { apiKey, targetType, excludeTitles = [], dateSeed } = options;
  const trimmedKey = apiKey.trim();

  if (!trimmedKey || !navigator.onLine) {
    return {
      payload: getFallbackCard(targetType, excludeTitles, dateSeed),
      source: 'FALLBACK'
    };
  }

  const avoidClause =
    excludeTitles.length > 0
      ? `\nDaha önce işlenen şu başlıkları KESİNLİKLE tekrar etme: ${excludeTitles.slice(0, 25).join(', ')}.`
      : '';

  const userPrompt = `Bugün için "${targetType}" türünde özgün, ilham verici ve entelektüel/sanatsal doyuruculuğu yüksek tek bir odak kartı üret.${avoidClause}`;

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(trimmedKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.85,
          topP: 0.92,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Hatası (${response.status})`);
    }

    const data = await response.json();
    const rawText: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini API boş yanıt döndürdü.');
    }

    const cleanedJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);
    const validated = validateCardPayload(parsed, targetType);

    if (!validated) {
      throw new Error('Geçersiz JSON şeması.');
    }

    return {
      payload: validated,
      source: 'AI'
    };
  } catch (error) {
    console.warn('Gemini API yerine küratörlü yerel koleksiyon kullanılıyor:', error);
    return {
      payload: getFallbackCard(targetType, excludeTitles, dateSeed),
      source: 'FALLBACK'
    };
  }
}

