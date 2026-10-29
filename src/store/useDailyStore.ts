import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BugunkuKartlarMap, DailyStore, GunlukKart, KartTuru } from '../types';
import {
  bugununTarihi,
  fetchYeniGunlukKart,
  yerelYedekKartGetir
} from '../services/geminiService';

function gecerliKartMi(kart: unknown): kart is GunlukKart {
  if (!kart || typeof kart !== 'object') return false;
  const k = kart as Record<string, unknown>;
  return (
    typeof k.id === 'string' &&
    typeof k.tarih === 'string' &&
    (k.tur === 'KELIME' || k.tur === 'CIZIM' || k.tur === 'YAZILIM') &&
    typeof k.baslik === 'string' &&
    k.baslik.length > 0 &&
    typeof k.ozet === 'string' &&
    typeof k.detay === 'string' &&
    typeof k.gunluk_gorev === 'string'
  );
}

const BOS_KARTLAR: BugunkuKartlarMap = {
  KELIME: null,
  CIZIM: null,
  YAZILIM: null
};

export const useDailyStore = create<DailyStore>()(
  persist(
    (set, get) => ({
      aktifTur: 'KELIME',
      bugunkuKart: null,
      bugunkuKartlar: { ...BOS_KARTLAR },
      gecmis: [],
      streak: 0,
      yukleniyor: false,
      hata: null,

      turSec: async (tur: KartTuru) => {
        const state = get();
        const bugun = bugununTarihi();
        const mevcutKart = state.bugunkuKartlar?.[tur];

        // Seçilen sekmenin bugünkü kartı zaten hazırsa anında göster
        if (gecerliKartMi(mevcutKart) && mevcutKart.tarih === bugun) {
          set({
            aktifTur: tur,
            bugunkuKart: mevcutKart,
            hata: null
          });
          return;
        }

        // Hazır değilse aktif türü değiştirip o kategori için kart yükle
        set({
          aktifTur: tur,
          bugunkuKart: null
        });
        await get().gunuKontrolEtVeYukle(tur);
      },

      gunuKontrolEtVeYukle: async (hedefTur?: KartTuru) => {
        const state = get();
        if (state.yukleniyor) return;

        const seciliTur: KartTuru = hedefTur || state.aktifTur || 'KELIME';
        const bugun = bugununTarihi();
        const gecmisListesi = Array.isArray(state.gecmis) ? state.gecmis : [];
        const kartlarMap: BugunkuKartlarMap = {
          ...BOS_KARTLAR,
          ...(state.bugunkuKartlar || {})
        };

        // Eğer eski sürümden kalan bugunkuKart varsa ve map içinde yoksa senkronize et
        if (
          gecerliKartMi(state.bugunkuKart) &&
          state.bugunkuKart.tarih === bugun &&
          !kartlarMap[state.bugunkuKart.tur]
        ) {
          kartlarMap[state.bugunkuKart.tur] = state.bugunkuKart;
        }

        const buTurunKarti = kartlarMap[seciliTur];
        if (gecerliKartMi(buTurunKarti) && buTurunKarti.tarih === bugun) {
          set({
            aktifTur: seciliTur,
            bugunkuKart: buTurunKarti,
            bugunkuKartlar: kartlarMap,
            yukleniyor: false,
            hata: null
          });
          return;
        }

        set({ aktifTur: seciliTur, yukleniyor: true, hata: null });

        try {
          const haricBasliklar = [
            ...gecmisListesi.map((k) => k.baslik),
            ...Object.values(kartlarMap)
              .filter(gecerliKartMi)
              .map((k) => k.baslik)
          ];

          const yeniKart = await fetchYeniGunlukKart(seciliTur, haricBasliklar);
          const guncelMap: BugunkuKartlarMap = {
            ...kartlarMap,
            [seciliTur]: yeniKart
          };

          set({
            aktifTur: seciliTur,
            bugunkuKart: yeniKart,
            bugunkuKartlar: guncelMap,
            gecmis: gecmisListesi,
            yukleniyor: false,
            hata: null
          });
        } catch {
          const yedek = yerelYedekKartGetir(seciliTur);
          const guncelMap: BugunkuKartlarMap = {
            ...kartlarMap,
            [seciliTur]: yedek
          };

          set({
            aktifTur: seciliTur,
            bugunkuKart: yedek,
            bugunkuKartlar: guncelMap,
            gecmis: gecmisListesi,
            yukleniyor: false,
            hata: null
          });
        }
      },

      kartiTamamla: () => {
        const state = get();
        const { bugunkuKart, aktifTur } = state;
        const gecmisListesi = Array.isArray(state.gecmis) ? state.gecmis : [];
        const mevcutStreak = typeof state.streak === 'number' ? state.streak : 0;

        if (!gecerliKartMi(bugunkuKart) || bugunkuKart.tamamlandi) return;

        const tamamlananKart: GunlukKart = {
          ...bugunkuKart,
          tamamlandi: true
        };

        const guncelGecmis = [
          tamamlananKart,
          ...gecmisListesi.filter((k) => k.id !== tamamlananKart.id)
        ];

        const guncelMap: BugunkuKartlarMap = {
          ...BOS_KARTLAR,
          ...(state.bugunkuKartlar || {}),
          [aktifTur]: tamamlananKart
        };

        set({
          bugunkuKart: tamamlananKart,
          bugunkuKartlar: guncelMap,
          gecmis: guncelGecmis,
          streak: mevcutStreak + 1
        });
      },

      kartZorlaYenile: async () => {
        const state = get();
        if (state.yukleniyor) return;

        const seciliTur: KartTuru = state.aktifTur || 'KELIME';
        const gecmisListesi = Array.isArray(state.gecmis) ? state.gecmis : [];
        const kartlarMap: BugunkuKartlarMap = {
          ...BOS_KARTLAR,
          ...(state.bugunkuKartlar || {})
        };

        set({ yukleniyor: true, hata: null });

        try {
          const haricBasliklar = [
            ...gecmisListesi.map((k) => k.baslik),
            ...Object.values(kartlarMap)
              .filter(gecerliKartMi)
              .map((k) => k.baslik)
          ];

          const yeniKart = await fetchYeniGunlukKart(seciliTur, haricBasliklar);
          const guncelMap: BugunkuKartlarMap = {
            ...kartlarMap,
            [seciliTur]: yeniKart
          };

          set({
            bugunkuKart: yeniKart,
            bugunkuKartlar: guncelMap,
            gecmis: gecmisListesi,
            yukleniyor: false,
            hata: null
          });
        } catch {
          const yedek = yerelYedekKartGetir(seciliTur);
          const guncelMap: BugunkuKartlarMap = {
            ...kartlarMap,
            [seciliTur]: yedek
          };

          set({
            bugunkuKart: yedek,
            bugunkuKartlar: guncelMap,
            gecmis: gecmisListesi,
            yukleniyor: false,
            hata: null
          });
        }
      }
    }),
    {
      name: 'nuans-storage',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        aktifTur: state.aktifTur,
        bugunkuKart: state.bugunkuKart,
        bugunkuKartlar: state.bugunkuKartlar,
        gecmis: Array.isArray(state.gecmis) ? state.gecmis : [],
        streak: typeof state.streak === 'number' ? state.streak : 0
      }),
      merge: (persistedState, currentState) => {
        const p = (persistedState || {}) as Partial<DailyStore>;
        const seciliTur: KartTuru =
          p.aktifTur === 'KELIME' || p.aktifTur === 'CIZIM' || p.aktifTur === 'YAZILIM'
            ? p.aktifTur
            : 'KELIME';

        const gelenMap = (p.bugunkuKartlar || {}) as Partial<BugunkuKartlarMap>;
        const temizMap: BugunkuKartlarMap = {
          KELIME: gecerliKartMi(gelenMap.KELIME) ? gelenMap.KELIME : null,
          CIZIM: gecerliKartMi(gelenMap.CIZIM) ? gelenMap.CIZIM : null,
          YAZILIM: gecerliKartMi(gelenMap.YAZILIM) ? gelenMap.YAZILIM : null
        };

        if (gecerliKartMi(p.bugunkuKart) && !temizMap[p.bugunkuKart.tur]) {
          temizMap[p.bugunkuKart.tur] = p.bugunkuKart;
        }

        return {
          ...currentState,
          aktifTur: seciliTur,
          bugunkuKart: temizMap[seciliTur] || (gecerliKartMi(p.bugunkuKart) ? p.bugunkuKart : null),
          bugunkuKartlar: temizMap,
          gecmis: Array.isArray(p.gecmis) ? p.gecmis.filter(gecerliKartMi) : [],
          streak: typeof p.streak === 'number' && !Number.isNaN(p.streak) ? p.streak : 0
        };
      }
    }
  )
);
