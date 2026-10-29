export type CardType = 'KELIME' | 'CIZIM';

export interface DailyCardPayload {
  tur: CardType;
  baslik: string;
  alt_baslik: string;
  ozet: string;
  detay: string;
  gunluk_gorev: string;
  ipucu: string;
}

export interface DailyCard extends DailyCardPayload {
  id: string;
  tarih: string; // YYYY-MM-DD formatında gün anahtarı
  tamamlandi: boolean;
  tamamlanmaZamani?: string;
  kullaniciNotu?: string;
  kaynak: 'AI' | 'FALLBACK';
}

export type PreferredMode = 'KARMA' | 'KELIME' | 'CIZIM';

export interface DailyStoreState {
  apiKey: string;
  preferredMode: PreferredMode;
  todayCard: DailyCard | null;
  archive: DailyCard[];
  streak: number;
  lastCompletedDate: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setApiKey: (key: string) => void;
  setPreferredMode: (mode: PreferredMode) => void;
  initializeTodayCard: () => Promise<void>;
  regenerateTodayCard: (forceType?: CardType) => Promise<void>;
  markTodayCompleted: (note?: string) => void;
  updateTodayNote: (note: string) => void;
  clearError: () => void;
}

