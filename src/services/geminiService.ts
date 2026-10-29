import { GunlukKart, KartTuru } from '../types';
import { FALLBACK_WORDS } from '../data/fallbackWords';
import { FALLBACK_DRAWINGS } from '../data/fallbackDrawings';

/**
 * Google Gemini API aktif model zinciri.
 * Eski gemini-1.5-flash ve gemini-2.0-flash modelleri v1beta'da 404 döndürdüğü için
 * en hızlı ve kararlı güncel Flash modelleri sırasıyla denenir.
 */
const GEMINI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
] as const;

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

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

function yerelYedekKartGetir(secilenTur: KartTuru, haricBasliklar: string[] = []): GunlukKart {
  const havuz = secilenTur === 'KELIME' ? FALLBACK_WORDS : FALLBACK_DRAWINGS;
  const haricSet = new Set(haricBasliklar.map((b) => b.toLowerCase().trim()));
  const uygunlar = havuz.filter((k) => !haricSet.has(k.baslik.toLowerCase().trim()));
  const adaylar = uygunlar.length > 0 ? uygunlar : havuz;
  const secilen = adaylar[Math.floor(Math.random() * adaylar.length)];
  const tarih = bugununTarihi();

  return {
    ...secilen,
    id: `${tarih}-${Date.now()}`,
    tarih,
    tamamlandi: false
  };
}

export async function fetchYeniGunlukKart(haricBasliklar: string[] = []): Promise<GunlukKart> {
  const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey = rawKey ? rawKey.trim().replace(/^['"]|['"]$/g, '') : '';

  // %50 ihtimalle KELIME ya da CIZIM seçimi
  const secilenTur: KartTuru = Math.random() < 0.5 ? 'KELIME' : 'CIZIM';

  if (!apiKey) {
    throw new Error(
      'Gemini API anahtarı bulunamadı! Lütfen .env dosyasına VITE_GEMINI_API_KEY değişkenini ekleyin ve geliştirme sunucusunu yeniden başlatın.'
    );
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

  let sonHataMesaji = '';

  for (const modelAdi of GEMINI_MODELS) {
    try {
      const url = `${GEMINI_BASE_URL}/${modelAdi}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

      if (!response.ok) {
        let detayMesaj = '';
        try {
          const errJson = await response.json();
          detayMesaj = errJson?.error?.message || '';
        } catch {
          // ignore
        }
        sonHataMesaji = `HTTP ${response.status} (${modelAdi})${detayMesaj ? `: ${detayMesaj}` : ''}`;
        // 400/401/403 (geçersiz API anahtarı vb.) dışındaki 404/429/503 hatalarında bir sonraki modeli dene
        if (response.status === 400 || response.status === 401 || response.status === 403) {
          throw new Error(`Gemini API Yetki/İstek Hatası: ${detayMesaj || response.statusText}`);
        }
        continue;
      }

      const data = await response.json();
      const rawText: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        sonHataMesaji = `${modelAdi} boş yanıt döndürdü.`;
        continue;
      }

      const cleanedJson = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();

      const parsed = JSON.parse(cleanedJson) as GeminiKartYaniti;

      if (!parsed.baslik || !parsed.ozet || !parsed.detay || !parsed.gunluk_gorev) {
        sonHataMesaji = `${modelAdi} eksik JSON alanları döndürdü.`;
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
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('Gemini API Yetki/İstek Hatası:')) {
        throw err;
      }
      sonHataMesaji = err instanceof Error ? err.message : 'Bilinmeyen hata';
    }
  }

  // Tüm modeller geçici olarak yoğun (503/429) veya çevrimdışı ise kullanıcıyı yarı yolda bırakmamak için yedek kart dön
  console.warn('Gemini modelleri yanıt vermedi, yerel yedek kart kullanılıyor:', sonHataMesaji);
  return yerelYedekKartGetir(secilenTur, haricBasliklar);
}
