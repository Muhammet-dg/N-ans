export type KartTuru = 'KELIME' | 'CIZIM';

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

export interface DailyStore {
  bugunkuKart: GunlukKart | null;
  gecmis: GunlukKart[];
  streak: number;
  yukleniyor: boolean;
  hata: string | null;
  gunuKontrolEtVeYukle: () => Promise<void>;
  kartiTamamla: () => void;
  kartZorlaYenile: () => Promise<void>;
}

// Geriye dönük uyumluluk tipleri
export type CardType = KartTuru;
export type DailyCardPayload = Omit<GunlukKart, 'id' | 'tarih' | 'tamamlandi'>;
export type DailyCard = GunlukKart;
