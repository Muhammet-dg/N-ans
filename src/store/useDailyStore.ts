import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DailyStore, GunlukKart } from '../types';
import { bugununTarihi, fetchYeniGunlukKart } from '../services/geminiService';

export const useDailyStore = create<DailyStore>()(
  persist(
    (set, get) => ({
      bugunkuKart: null,
      gecmis: [],
      streak: 0,
      yukleniyor: false,
      hata: null,

      gunuKontrolEtVeYukle: async () => {
        const { bugunkuKart, gecmis, yukleniyor } = get();
        if (yukleniyor) return;

        const bugun = bugununTarihi();

        // Günün tarihi ile bugunkuKart.tarih eşleşiyorsa kesinlikle tekrar API'ye gitme
        if (bugunkuKart && bugunkuKart.tarih === bugun) {
          return;
        }

        set({ yukleniyor: true, hata: null });

        try {
          const haricBasliklar = [
            ...gecmis.map((k) => k.baslik),
            ...(bugunkuKart ? [bugunkuKart.baslik] : [])
          ];

          const yeniKart = await fetchYeniGunlukKart(haricBasliklar);

          set({
            bugunkuKart: yeniKart,
            yukleniyor: false,
            hata: null
          });
        } catch (err) {
          set({
            yukleniyor: false,
            hata:
              err instanceof Error
                ? err.message
                : 'Günlük kart yüklenirken beklenmeyen bir hata oluştu.'
          });
        }
      },

      kartiTamamla: () => {
        const { bugunkuKart, gecmis, streak } = get();
        if (!bugunkuKart || bugunkuKart.tamamlandi) return;

        const tamamlananKart: GunlukKart = {
          ...bugunkuKart,
          tamamlandi: true
        };

        const guncelGecmis = [
          tamamlananKart,
          ...gecmis.filter((k) => k.id !== tamamlananKart.id)
        ];

        set({
          bugunkuKart: tamamlananKart,
          gecmis: guncelGecmis,
          streak: streak + 1
        });
      },

      kartZorlaYenile: async () => {
        const { bugunkuKart, gecmis, yukleniyor } = get();
        if (yukleniyor) return;

        set({ yukleniyor: true, hata: null });

        try {
          const haricBasliklar = [
            ...gecmis.map((k) => k.baslik),
            ...(bugunkuKart ? [bugunkuKart.baslik] : [])
          ];

          const yeniKart = await fetchYeniGunlukKart(haricBasliklar);

          set({
            bugunkuKart: yeniKart,
            yukleniyor: false,
            hata: null
          });
        } catch (err) {
          set({
            yukleniyor: false,
            hata:
              err instanceof Error
                ? err.message
                : 'Yeni test kartı çekilirken bir hata oluştu.'
          });
        }
      }
    }),
    {
      name: 'nuans-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bugunkuKart: state.bugunkuKart,
        gecmis: state.gecmis,
        streak: state.streak
      })
    }
  )
);
