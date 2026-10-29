import { GunlukKart, KartTuru } from '../types';
import { FALLBACK_WORDS } from '../data/fallbackWords';
import { FALLBACK_DRAWINGS } from '../data/fallbackDrawings';
import { FALLBACK_SOFTWARE } from '../data/fallbackSoftware';

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
      enum: ['KELIME', 'CIZIM', 'YAZILIM'],
      description: 'Kartın kategorisi: KELIME, CIZIM veya YAZILIM'
    },
    baslik: {
      type: 'STRING',
      description: 'Kavramın, çizim tekniğinin veya yazılım/bilgisayar mühendisliği konusunun adı'
    },
    alt_baslik: {
      type: 'STRING',
      description: 'Kavramın kökeni, çizim disiplini veya bilgisayar mühendisliği alt alanı'
    },
    ozet: {
      type: 'STRING',
      description: '1-2 cümlelik vurucu ve özlü tanım'
    },
    detay: {
      type: 'STRING',
      description: 'Konunun felsefesi, tekniğin püf noktası veya mühendislik çalışma mantığı'
    },
    gunluk_gorev: {
      type: 'STRING',
      description: '10-15 dakikada uygulanabilecek somut kelime, çizim veya yazılım/mimari pratik görevi'
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
  const havuz =
    secilenTur === 'KELIME'
      ? FALLBACK_WORDS
      : secilenTur === 'CIZIM'
      ? FALLBACK_DRAWINGS
      : FALLBACK_SOFTWARE;

  const haricSet = new Set(haricBasliklar.map((b) => b.toLowerCase().trim()));
  const uygunlar = havuz.filter((k) => !haricSet.has(k.baslik.toLowerCase().trim()));
  const adaylar = uygunlar.length > 0 ? uygunlar : havuz;
  const secilen = adaylar[Math.floor(Math.random() * adaylar.length)];
  const tarih = bugununTarihi();

  return {
    ...secilen,
    tur: secilenTur,
    id: `${tarih}-${secilenTur}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tarih,
    tamamlandi: false
  };
}

export async function fetchYeniGunlukKart(
  hedefTur?: KartTuru,
  haricBasliklar: string[] = []
): Promise<GunlukKart> {
  const apiKey = getActiveApiKey();

  const turler: KartTuru[] = ['KELIME', 'CIZIM', 'YAZILIM'];
  const secilenTur: KartTuru =
    hedefTur || turler[Math.floor(Math.random() * turler.length)];

  if (!apiKey || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return yerelYedekKartGetir(secilenTur, haricBasliklar);
  }

  const haricMetni =
    haricBasliklar.length > 0
      ? `\nDaha önce üretilen şu başlıkları KESİNLİKLE tekrar etme: ${haricBasliklar.slice(0, 30).join(', ')}.`
      : '';

  const kategoriTalimati =
    secilenTur === 'KELIME'
      ? `Tür "KELIME": Az bilinen, derinliği olan zarif bir Türkçe kelime (ör. İstidat, Müşahede, Fehim, Teenni, Basiret) VEYA felsefe, strateji ve bilişsel modeller dünyasından derin bir küresel kavram (ör. Amor Fati, Antifragile, Epistemik Tevazu, Wu Wei) seç. Gün içinde bu kavramı kullanma/araştırma görevi ver.`
      : secilenTur === 'CIZIM'
      ? `Tür "CIZIM": Sadece kağıt ve kurşun kalemle 10-15 dakikada tamamlanabilecek mikro bir eskiz/çizim hobi tekniği (ör. Çapraz Tarama, Kontur Tarama, Negatif Alan, Tek Kaçışlı Perspektif, Chiaroscuro, Form Basitleştirme) seç ve somut bir çizim görevi ver.`
      : `Tür "YAZILIM": Yazılım mimarisi, veri yapıları, algoritmalar, dağıtık sistemler, işletim sistemleri, ağlar veya bilgisayar mühendisliği dünyasından 15 dakikada öğrenilip içselleştirilebilecek kritik bir mühendislik kavramı (ör. CAP Teoremi, Idempotency, Cache Locality, Bloom Filter, Event Loop, Consistent Hashing, Zero-Copy, SOLID, Deadlock) seç. "gunluk_gorev" alanında 15 dakikada kağıt üzerinde şema çizerek veya kısa bir sözde-kod (pseudocode) kurgulayarak yapılacak somut bir mühendislik egzersizi ver.`;

  const prompt = `Sen kıdemli bir entelektüel küratör, güzel sanatlar eğitmeni ve Principal Bilgisayar Mühendisisin.
Kullanıcı için bugün "${secilenTur}" kategorisinde tek bir odak kartı üreteceksin.

${kategoriTalimati}

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
        id: `${tarih}-${secilenTur}-${Date.now()}`,
        tarih,
        tur: secilenTur,
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
    }
  }

  return yerelYedekKartGetir(secilenTur, haricBasliklar);
}
