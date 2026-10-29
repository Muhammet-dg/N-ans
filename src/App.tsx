import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDailyStore } from './store/useDailyStore';
import { Header } from './components/Header';
import { FocusCard } from './components/FocusCard';
import { ArchiveDrawer } from './components/ArchiveDrawer';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const {
    apiKey,
    preferredMode,
    todayCard,
    archive,
    streak,
    isLoading,
    setApiKey,
    setPreferredMode,
    initializeTodayCard,
    regenerateTodayCard,
    markTodayCompleted,
    updateTodayNote
  } = useDailyStore();

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    void initializeTodayCard();
  }, [initializeTodayCard]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isWord = todayCard?.tur !== 'CIZIM';

  return (
    <div className="relative min-h-dvh w-full bg-[#0A0D14] text-[#F8FAFC] flex flex-col justify-between overflow-hidden select-none sm:select-auto">
      {/* Atelier & Nocturne Atmosferik Mesh Gradient Katmanı */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D14] via-[#0F172A]/85 to-[#0A0D14]" />

        {/* Kartın türüne göre yumuşak nefes alan ambiyans küresi */}
        <motion.div
          animate={{
            background: isWord
              ? 'radial-gradient(circle, rgba(245,158,11,0.11) 0%, rgba(15,23,42,0) 70%)'
              : 'radial-gradient(circle, rgba(16,185,129,0.11) 0%, rgba(15,23,42,0) 70%)'
          }}
          transition={{ duration: 1.2 }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full blur-3xl"
        />

        <div
          className="absolute bottom-[-220px] right-[-120px] w-[520px] h-[520px] rounded-full blur-3xl opacity-40"
          style={{
            background: isWord
              ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Üst Bar */}
      <Header
        streak={streak}
        archiveCount={archive.length}
        hasApiKey={Boolean(apiKey.trim())}
        isOffline={isOffline}
        activeType={todayCard?.tur}
        onOpenArchive={() => setIsArchiveOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Ana Odak Alanı */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-2">
        {todayCard ? (
          <FocusCard
            card={todayCard}
            isLoading={isLoading}
            onComplete={markTodayCompleted}
            onUpdateNote={updateTodayNote}
            onSwitchOrRefresh={(forceType) => void regenerateTodayCard(forceType)}
          />
        ) : (
          <div className="w-full max-w-2xl mx-auto px-6 py-16 text-center space-y-4">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500/40 border-t-[#F59E0B] animate-spin mx-auto" />
            <p className="font-serif text-lg text-[#94A3B8]">
              Günün odak ritüeli hazırlanıyor...
            </p>
          </div>
        )}
      </main>

      {/* Alt Editorial İmza */}
      <footer className="relative z-10 w-full max-w-2xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] text-[#94A3B8]/70">
        <span>Her gün tek bir derin odak • Offline-first mimari</span>
        <button
          type="button"
          onClick={() => setIsArchiveOpen(true)}
          className="hover:text-[#F8FAFC] transition-colors underline underline-offset-4"
        >
          Geçmiş Koleksiyon ({archive.length})
        </button>
      </footer>

      {/* Geçmiş Arşiv Çekmecesi */}
      <ArchiveDrawer
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        archive={archive}
      />

      {/* Ayarlar & Gemini API Modalı */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        preferredMode={preferredMode}
        onSaveApiKey={setApiKey}
        onChangePreferredMode={setPreferredMode}
        onRegenerateNow={() => void regenerateTodayCard()}
      />
    </div>
  );
};

export default App;

