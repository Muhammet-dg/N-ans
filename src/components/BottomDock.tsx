import React from 'react';
import { motion } from 'framer-motion';
import { Timer, RefreshCw, Archive, Share2 } from 'lucide-react';
import { KartTuru } from '../types';

interface BottomDockProps {
  aktifTur?: KartTuru;
  yukleniyor: boolean;
  gecmisSayisi: number;
  timerAcik: boolean;
  onToggleTimer: () => void;
  onYeniKartCek: () => void;
  onArsivAc: () => void;
  onPaylas: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  aktifTur = 'KELIME',
  yukleniyor,
  gecmisSayisi,
  timerAcik,
  onToggleTimer,
  onYeniKartCek,
  onArsivAc,
  onPaylas
}) => {
  const vurguRenk =
    aktifTur === 'KELIME'
      ? 'text-amber-300'
      : aktifTur === 'CIZIM'
      ? 'text-emerald-300'
      : 'text-sky-300';

  const aktifBg =
    aktifTur === 'KELIME'
      ? 'bg-amber-500/15 border-amber-500/35 text-amber-200'
      : aktifTur === 'CIZIM'
      ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
      : 'bg-sky-500/15 border-sky-500/35 text-sky-200';

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 px-3 pt-2 pointer-events-none flex justify-center bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/85 to-transparent"
      style={{
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))'
      }}
    >
      <nav
        aria-label="Hızlı PWA Kontrolleri"
        className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-2.5 py-1.5 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_10px_35px_rgba(0,0,0,0.85)] w-full max-w-md"
      >
        {/* 1. Ritüel Zamanlayıcı */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleTimer}
          className={`min-h-[40px] flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-colors border cursor-pointer ${
            timerAcik
              ? aktifBg
              : 'border-transparent text-slate-300 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Timer className={`w-3.5 h-3.5 shrink-0 ${timerAcik ? vurguRenk : 'text-slate-400'}`} />
          <span className="whitespace-nowrap">Sayaç</span>
        </motion.button>

        <div className="h-4 w-[1px] bg-white/[0.08]" />

        {/* 2. Yeni Kart */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          disabled={yukleniyor}
          onClick={onYeniKartCek}
          className="min-h-[40px] flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 shrink-0 ${vurguRenk} ${yukleniyor ? 'animate-spin' : ''}`}
          />
          <span className="whitespace-nowrap">Yeni Kart</span>
        </motion.button>

        <div className="h-4 w-[1px] bg-white/[0.08]" />

        {/* 3. Arşiv */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={onArsivAc}
          className="min-h-[40px] flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          <Archive className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="whitespace-nowrap">Arşiv</span>
          {gecmisSayisi > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-white/[0.14] text-slate-100">
              {gecmisSayisi}
            </span>
          )}
        </motion.button>

        <div className="h-4 w-[1px] bg-white/[0.08]" />

        {/* 4. Paylaş */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={onPaylas}
          title="Günün kartını paylaş veya kopyala"
          className="min-h-[40px] flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="whitespace-nowrap">Paylaş</span>
        </motion.button>
      </nav>
    </div>
  );
};
