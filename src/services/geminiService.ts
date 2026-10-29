import { GunlukKart, KartTuru } from '../types';
import { FALLBACK_WORDS } from '../data/fallbackWords';
import { FALLBACK_DRAWINGS } from '../data/fallbackDrawings';

const GEMINI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
] as const;

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const LOCAL_API_KEY_STORAGE = 'nuans-gemini-api-key';

export function getActiveApiKey(): string {
  try {
    const localKey = localStorage.getItem(LOCAL_API_KEY_STORAGE);
    if (localKey && localKey.trim()) {
      return localKey.trim().replace(/^['"]|['"]$/g, '');
    }
  } catch {
    // localStorage erişilemezse env anahtarına geç
  }

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  return envKey ? envKey.trim().replace(/^['"]|['"]$/g, '') : '';
}

export function saveCustomApiKey(key: string): void {
  try {
    const cleaned = key.trim().replace(/^['"]|['"]$/g, '');
    if (cleaned) {
      localStorage.setItem(LOCAL_API_KEY_STORAGE, cleaned);
    } else {
      localStorage.removeItem(LOCAL_API_KEY_STORAGE);
    }
  } catch {
    // ignore
  }
}

export function bugununTarihi(): string {
  const simdi = new Date();
  const yil = simdi.getFullYear();
  const ay = String(simdi.getMonth() + 1).padStart(2, '0');
  const gun = String(simdi.getDate()).padStart(2, '0');
  return `${yil}-${ay}-${gun}`;
}

interface GeminiKartYaniti {
  tur: KartTuru;
  baslik: string;
  alt_baslik: string;
  ozet: string;
  detay: string;
  gunluk_gorev: string;
  ipucu: string;
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    tur: {
      type: 'STRING',
      enum: ['KELIME', 'CIZIM'],
      description: 'Kartın kategorisi: KELIME veya CIZIM'
    },
    baslik: {
      type: 'STRING',
      description: 'Kavramın, kelimenin veya çizim tekniğinin adı'
    },
    alt_baslik: {
      type: 'STRING',
      description: 'Kavramın kökeni/felsefi ekolü veya çizim tekniğinin disiplini'
    },
    ozet: {
      type: 'STRING',
      description: '1-2 cümlelik vurucu ve özlü tanım'
    },
    detay: {
      type: 'STRING',
      description: 'Konunun felsefi derinliği veya tekniğin kritik püf noktası'
    },
    gunluk_gorev: {
      type: 'STRING',
      description: 'Gün içinde kelimeyi kullanma/araştırma aksiyonu veya 10-15 dakikalık kağıt-kalem çizim görevi'
    },
    ipucu: {
      type: 'STRING',
      description: 'Uygulamayı kolaylaştıracak pratik bir püf nokta'
    }
  },
  required: [
    'tur',
    'baslik',
    'alt_baslik',
    'ozet',
    'detay',
    'gunluk_gorev',
    'ipucu'
  ]
};

export function yerelYedekKartGetir(
  secilenTur: KartTuru,
  haricBasliklar: string[] = []
): GunlukKart {
  const havuz = secilenTur === 'KELIME' ? FALLBACK_WORDS : FALLBACK_DRAWINGS;
  const haricSet = new Set(haricBasliklar.map((b) => b.toLowerCase().trim()));
  const uygunlar = havuz.filter((k) => !haricSet.has(k.baslik.toLowerCase().trim()));
  const adaylar = uygunlar.length > 0 ? uygunlar : havuz;
  const secilen = adaylar[Math.floor(Math.random() * adaylar.length)];
  const tarih = bugununTarihi();

  return {
    ...secilen,
    id: `${tarih}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tarih,
    tamamlandi: false
  };
}

export async function fetchYeniGunlukKart(haricBasliklar: string[] = []): Promise<GunlukKart> {
  const apiKey = getActiveApiKey();

  // %50 ihtimalle KELIME ya da CIZIM seçimi
  const secilenTur: KartTuru = Math.random() < 0.5 ? 'KELIME' : 'CIZIM';

  // Mobil PWA'da veya sunucuda API anahtarı tanımlı değilse ya da çevrimdışıysa hata verme, doğrudan küratörlü yerel kart sun
  if (!apiKey || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return yerelYedekKartGetir(secilenTur, haricBasliklar);
  }

  const haricMetni =
    haricBasliklar.length > 0
      ? `\nDaha önce üretilen şu başlıkları KESİNLİKLE tekrar etme: ${haricBasliklar.slice(0, 30).join(', ')}.`
      : '';

  const prompt = `Sen kıdemli bir entelektüel küratör ve güzel sanatlar eğitmenisin.
Kullanıcı için bugün %50 olasılık kuralına göre belirlenen "${secilenTur}" türünde tek bir odak kartı üreteceksin.

- Eğer tür "KELIME" ise: Az bilinen, derinliği olan zarif bir Türkçe kelime (ör. İstidat, Müşahede, Fehim, Teenni, Basiret) VEYA felsefe, strateji ve bilişsel modeller dünyasından derin bir küresel kavram (ör. Amor Fati, Antifragile, Epistemik Tevazu, Wu Wei) seç. Gün içinde bu kavramı kullanma/araştırma görevi ver.
- Eğer tür "CIZIM" ise: Sadece kağıt ve kurşun kalemle 10-15 dakikada tamamlanabilecek mikro bir eskiz tekniği (ör. Çapraz Tarama, Kontur Tarama, Negatif Alan, Tek Kaçışlı Perspektif, Chiaroscuro, Form Basitleştirme) seç ve somut bir çizim görevi ver.

Lütfen tüm alanları Türkçe, akıcı, ilham verici ve "editorial-minimalist" bir üslupla doldur.${haricMetni}`;

  for (const modelAdi of GEMINI_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    try {
      const url = `${GEMINI_BASE_URL}/${modelAdi}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.85,
            topP: 0.92,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA
          }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const rawText: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        continue;
      }

      const cleanedJson = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();

      const parsed = JSON.parse(cleanedJson) as GeminiKartYaniti;

      if (!parsed.baslik || !parsed.ozet || !parsed.detay || !parsed.gunluk_gorev) {
        continue;
      }

      const tarih = bugununTarihi();

      return {
        id: `${tarih}-${Date.now()}`,
        tarih,
        tur: parsed.tur === 'KELIME' || parsed.tur === 'CIZIM' ? parsed.tur : secilenTur,
        baslik: parsed.baslik.trim(),
        alt_baslik: parsed.alt_baslik.trim(),
        ozet: parsed.ozet.trim(),
        detay: parsed.detay.trim(),
        gunluk_gorev: parsed.gunluk_gorev.trim(),
        ipucu: parsed.ipucu.trim(),
        tamamlandi: false
      };
    } catch {
      clearTimeout(timeoutId);
      // Mobil ağ kopması veya zaman aşımında sıradaki modeli veya yerel kartı dene
    }
  }

  // Tüm modeller başarısız olsa bile mobil deneyimi kesintiye uğratmadan küratörlü kart döndür
  return yerelYedekKartGetir(secilenTur, haricBasliklar);
}
