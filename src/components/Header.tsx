import React from 'react';
import { Flame, Archive, Settings, Sparkles, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardType } from '../types';

interface HeaderProps {
  streak: number;
  archiveCount: number;
  hasApiKey: boolean;
  isOffline: boolean;
  activeType?: CardType;
  onOpenArchive: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  archiveCount,
  hasApiKey,
  isOffline,
  activeType = 'KELIME',
  onOpenArchive,
  onOpenSettings
}) => {
  const formattedDate = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  const isWord = activeType === 'KELIME';

  return (
    <header className="w-full max-w-2xl mx-auto pt-6 pb-4 px-4 sm:px-6 flex items-center justify-between z-20">
      {/* Sol: Editorial Marka & Tarih */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full transition-colors duration-500 ${
              isWord
                ? 'bg-[#F59E0B] shadow-[0_0_10px_#F59E0B]'
                : 'bg-[#10B981] shadow-[0_0_10px_#10B981]'
            }`}
          />
          <span className="font-display text-xs sm:text-sm tracking-[0.24em] uppercase text-[#F8FAFC]/90 font-semibold">
            Atelier &amp; Nocturne
          </span>
          {isOffline && (
            <span
              title="Çevrimdışı Mod — Yerel hafıza aktif"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/80 text-[#94A3B8] border border-white/[0.06]"
            >
              <WifiOff className="w-2.5 h-2.5" />
              Offline
            </span>
          )}
        </div>
        <p className="text-xs text-[#94A3B8] tracking-wider uppercase mt-1 font-medium">
          {formattedDate}
        </p>
      </div>

      {/* Sağ: Streak, Arşiv ve Ayarlar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Streak Rozeti */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          title="Kesintisiz Günlük Odak Serisi"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors duration-300 ${
            streak > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-[#FDE68A]'
              : 'bg-slate-900/60 border-white/[0.08] text-[#94A3B8]'
          }`}
        >
          <Flame
            className={`w-3.5 h-3.5 ${
              streak > 0 ? 'text-[#F59E0B] fill-[#F59E0B]/30' : 'text-[#94A3B8]'
            }`}
          />
          <span className="text-xs font-semibold tracking-wide">{streak}</span>
          <span className="hidden sm:inline text-[11px] opacity-80">gün</span>
        </motion.div>

        {/* Arşiv Çekmecesi Butonu */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenArchive}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/[0.08] text-[#F8FAFC] text-xs font-medium backdrop-blur-md transition-colors"
          aria-label="Geçmiş Arşivi Aç"
        >
          <Archive className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="hidden sm:inline">Arşiv</span>
          {archiveCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-white/[0.08] text-[#F8FAFC]">
              {archiveCount}
            </span>
          )}
        </motion.button>

        {/* Ayarlar / API Anahtarı Butonu */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSettings}
          className="relative p-2 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/[0.08] text-[#F8FAFC] backdrop-blur-md transition-colors"
          aria-label="Ayarlar ve Gemini API"
          title={hasApiKey ? 'Gemini AI Aktif — Ayarlar' : 'Ayarlar & API Anahtarı'}
        >
          <Settings className="w-4 h-4 text-[#94A3B8]" />
          {hasApiKey && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
            </span>
          )}
          {!hasApiKey && (
            <Sparkles className="w-2.5 h-2.5 text-[#F59E0B] absolute -top-0.5 -right-0.5" />
          )}
        </motion.button>
      </div>
    </header>
  );
};

