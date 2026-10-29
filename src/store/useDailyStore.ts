import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DailyStore, GunlukKart } from '../types';
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
    (k.tur === 'KELIME' || k.tur === 'CIZIM') &&
    typeof k.baslik === 'string' &&
    k.baslik.length > 0 &&
    typeof k.ozet === 'string' &&
    typeof k.detay === 'string' &&
    typeof k.gunluk_gorev === 'string'
  );
}

export const useDailyStore = create<DailyStore>()(
  persist(
    (set, get) => ({
      bugunkuKart: null,
      gecmis: [],
      streak: 0,
      yukleniyor: false,
      hata: null,

      gunuKontrolEtVeYukle: async () => {
        const state = get();
        if (state.yukleniyor) return;

        const bugun = bugununTarihi();
        const gecmisListesi = Array.isArray(state.gecmis) ? state.gecmis : [];

        // Günün tarihi ile bugunkuKart.tarih eşleşiyorsa ve kart geçerliyse tekrar API'ye gitme
        if (
          gecerliKartMi(state.bugunkuKart) &&
          state.bugunkuKart.tarih === bugun
        ) {
          return;
        }

        set({ yukleniyor: true, hata: null });

        try {
          const haricBasliklar = [
            ...gecmisListesi.map((k) => k.baslik),
            ...(gecerliKartMi(state.bugunkuKart) ? [state.bugunkuKart.baslik] : [])
          ];

          const yeniKart = await fetchYeniGunlukKart(haricBasliklar);

          set({
            bugunkuKart: yeniKart,
            gecmis: gecmisListesi,
            yukleniyor: false,
            hata: null
          });
        } catch {
          // Herhangi bir beklenmeyen durumda bile yedek kart yükle
          const yedek = yerelYedekKartGetir(Math.random() < 0.5 ? 'KELIME' : 'CIZIM');
          set({
            bugunkuKart: yedek,
            gecmis: gecmisListesi,
            yukleniyor: false,
            hata: null
          });
        }
      },

      kartiTamamla: () => {
        const state = get();
        const { bugunkuKart } = state;
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

        set({
          bugunkuKart: tamamlananKart,
          gecmis: guncelGecmis,
          streak: mevcutStreak + 1
        });
      },

      kartZorlaYenile: async () => {
        const state = get();
        if (state.yukleniyor) return;

        const gecmisListesi = Array.isArray(state.gecmis) ? state.gecmis : [];
        set({ yukleniyor: true, hata: null });

        try {
          const haricBasliklar = [
            ...gecmisListesi.map((k) => k.baslik),
            ...(gecerliKartMi(state.bugunkuKart) ? [state.bugunkuKart.baslik] : [])
          ];

          const yeniKart = await fetchYeniGunlukKart(haricBasliklar);

          set({
            bugunkuKart: yeniKart,
            gecmis: gecmisListesi,
            yukleniyor: false,
            hata: null
          });
        } catch {
          const yedek = yerelYedekKartGetir(
            state.bugunkuKart?.tur === 'KELIME' ? 'CIZIM' : 'KELIME'
          );
          set({
            bugunkuKart: yedek,
            gecmis: gecmisListesi,
            yukleniyor: false,
            hata: null
          });
        }
      }
    }),
    {
      name: 'nuans-storage',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bugunkuKart: state.bugunkuKart,
        gecmis: Array.isArray(state.gecmis) ? state.gecmis : [],
        streak: typeof state.streak === 'number' ? state.streak : 0
      }),
      merge: (persistedState, currentState) => {
        const p = (persistedState || {}) as Partial<DailyStore>;
        return {
          ...currentState,
          bugunkuKart: gecerliKartMi(p.bugunkuKart) ? p.bugunkuKart : null,
          gecmis: Array.isArray(p.gecmis) ? p.gecmis.filter(gecerliKartMi) : [],
          streak: typeof p.streak === 'number' && !Number.isNaN(p.streak) ? p.streak : 0
        };
      }
    }
  )
);
