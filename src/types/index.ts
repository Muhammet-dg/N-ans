export type KartTuru = 'KELIME' | 'CIZIM' | 'YAZILIM';

export interface GunlukKart {
  id: string;
  tarih: string; // YYYY-MM-DD
  tur: KartTuru;
  baslik: string;
  alt_baslik: string;
  ozet: string;
  detay: string;
  gunluk_gorev: string;
  ipucu: string;
  tamamlandi: boolean;
}

export type BugunkuKartlarMap = Record<KartTuru, GunlukKart | null>;

export interface DailyStore {
  aktifTur: KartTuru;
  bugunkuKart: GunlukKart | null;
  bugunkuKartlar: BugunkuKartlarMap;
  gecmis: GunlukKart[];
  streak: number;
  yukleniyor: boolean;
  hata: string | null;
  turSec: (tur: KartTuru) => Promise<void>;
  gunuKontrolEtVeYukle: (hedefTur?: KartTuru) => Promise<void>;
  kartiTamamla: () => void;
  kartZorlaYenile: () => Promise<void>;
}

// Geriye dönük uyumluluk tipleri
export type CardType = KartTuru;
export type DailyCardPayload = Omit<GunlukKart, 'id' | 'tarih' | 'tamamlandi'>;
export type DailyCard = GunlukKart;
