import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CardType, DailyCard, DailyStoreState, PreferredMode } from '../types';
import { generateDailyCard } from '../services/geminiService';

export function getLocalTodayString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalTodayString(d);
}

function chooseTargetType(
  preferredMode: PreferredMode,
  dateStr: string,
  lastCardType?: CardType
): CardType {
  if (preferredMode === 'KELIME') return 'KELIME';
  if (preferredMode === 'CIZIM') return 'CIZIM';

  if (lastCardType) {
    return lastCardType === 'KELIME' ? 'CIZIM' : 'KELIME';
  }

  // Tarih bazlı dengeli başlangıç
  const dayNumber = parseInt(dateStr.replace(/-/g, ''), 10);
  return dayNumber % 2 === 0 ? 'KELIME' : 'CIZIM';
}

export const useDailyStore = create<DailyStoreState>()(
  persist(
    (set, get) => ({
      apiKey: '',
      preferredMode: 'KARMA',
      todayCard: null,
      archive: [],
      streak: 0,
      lastCompletedDate: null,
      isLoading: false,
      error: null,

      setApiKey: (key: string) => {
        set({ apiKey: key.trim() });
      },

      setPreferredMode: (mode: PreferredMode) => {
        set({ preferredMode: mode });
      },

      clearError: () => set({ error: null }),

      initializeTodayCard: async () => {
        const state = get();
        const todayStr = getLocalTodayString();
        const yesterdayStr = getYesterdayString();

        // Streak doğrulaması: dün veya bugün tamamlanmadıysa seri sıfırlanır
        if (
          state.lastCompletedDate &&
          state.lastCompletedDate !== todayStr &&
          state.lastCompletedDate !== yesterdayStr &&
          state.streak > 0
        ) {
          set({ streak: 0 });
        }

        // Bugünün kartı zaten hafızadaysa tekrar çekme (Offline-first prensibi)
        if (state.todayCard && state.todayCard.tarih === todayStr) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const previousCard = state.todayCard;
          let updatedArchive = [...state.archive];

          // Önceki günün kartı varsa ve arşivde değilse arşive taşı
          if (previousCard && previousCard.tarih !== todayStr) {
            const existsInArchive = updatedArchive.some((c) => c.id === previousCard.id);
            if (!existsInArchive) {
              updatedArchive = [previousCard, ...updatedArchive].slice(0, 90);
            }
          }

          const targetType = chooseTargetType(
            state.preferredMode,
            todayStr,
            previousCard?.tur
          );

          const excludeTitles = updatedArchive.map((c) => c.baslik);
          if (previousCard) excludeTitles.push(previousCard.baslik);

          const { payload, source } = await generateDailyCard({
            apiKey: state.apiKey,
            targetType,
            excludeTitles,
            dateSeed: todayStr
          });

          const newCard: DailyCard = {
            ...payload,
            id: `${todayStr}-${Date.now()}`,
            tarih: todayStr,
            tamamlandi: false,
            kaynak: source
          };

          set({
            todayCard: newCard,
            archive: updatedArchive,
            isLoading: false
          });
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Günlük kart hazırlanırken bir hata oluştu.'
          });
        }
      },

      regenerateTodayCard: async (forceType?: CardType) => {
        const state = get();
        const todayStr = getLocalTodayString();

        set({ isLoading: true, error: null });

        try {
          const targetType: CardType =
            forceType ||
            (state.todayCard
              ? state.todayCard.tur === 'KELIME'
                ? 'CIZIM'
                : 'KELIME'
              : chooseTargetType(state.preferredMode, todayStr));

          const excludeTitles = [
            ...state.archive.map((c) => c.baslik),
            ...(state.todayCard ? [state.todayCard.baslik] : [])
          ];

          const { payload, source } = await generateDailyCard({
            apiKey: state.apiKey,
            targetType,
            excludeTitles
          });

          const existingCompleted =
            state.todayCard?.tarih === todayStr ? state.todayCard.tamamlandi : false;

          const newCard: DailyCard = {
            ...payload,
            id: `${todayStr}-${Date.now()}`,
            tarih: todayStr,
            tamamlandi: existingCompleted,
            tamamlanmaZamani: existingCompleted ? state.todayCard?.tamamlanmaZamani : undefined,
            kullaniciNotu: state.todayCard?.kullaniciNotu,
            kaynak: source
          };

          // Eğer bugün tamamlanmışsa arşivdeki kaydı da güncelle
          const updatedArchive = state.archive.map((item) =>
            item.tarih === todayStr ? newCard : item
          );

          set({
            todayCard: newCard,
            archive: updatedArchive,
            isLoading: false
          });
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Yeni odak kartı oluşturulamadı.'
          });
        }
      },

      markTodayCompleted: (note?: string) => {
        const state = get();
        if (!state.todayCard) return;

        const todayStr = getLocalTodayString();
        const yesterdayStr = getYesterdayString();

        const completedCard: DailyCard = {
          ...state.todayCard,
          tamamlandi: true,
          tamamlanmaZamani: new Date().toISOString(),
          kullaniciNotu: note !== undefined ? note.trim() : state.todayCard.kullaniciNotu
        };

        let newStreak = state.streak;
        if (state.lastCompletedDate !== todayStr) {
          if (state.lastCompletedDate === yesterdayStr) {
            newStreak = state.streak + 1;
          } else {
            newStreak = 1;
          }
        }

        const filteredArchive = state.archive.filter((c) => c.tarih !== todayStr);
        const updatedArchive = [completedCard, ...filteredArchive].slice(0, 90);

        set({
          todayCard: completedCard,
          archive: updatedArchive,
          streak: newStreak,
          lastCompletedDate: todayStr
        });
      },

      updateTodayNote: (note: string) => {
        const state = get();
        if (!state.todayCard) return;

        const updatedCard: DailyCard = {
          ...state.todayCard,
          kullaniciNotu: note
        };

        const updatedArchive = state.archive.map((c) =>
          c.id === updatedCard.id || c.tarih === updatedCard.tarih ? updatedCard : c
        );

        set({
          todayCard: updatedCard,
          archive: updatedArchive
        });
      }
    }),
    {
      name: 'atelier-nocturne-storage-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        apiKey: state.apiKey,
        preferredMode: state.preferredMode,
        todayCard: state.todayCard,
        archive: state.archive,
        streak: state.streak,
        lastCompletedDate: state.lastCompletedDate
      })
    }
  )
);

