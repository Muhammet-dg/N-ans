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
  const kelimeMi = aktifTur === 'KELIME';
  const vurguRenk = kelimeMi ? 'text-amber-300' : 'text-emerald-300';
  const aktifBg = kelimeMi
    ? 'bg-amber-500/15 border-amber-500/30 text-amber-200'
    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200';

  return (
    <div className="sticky bottom-0 z-30 w-full px-3 pt-1 pb-safe-dock flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        aria-label="Hızlı PWA Kontrolleri"
        className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_15px_40px_rgba(0,0,0,0.85)] max-w-full"
      >
        {/* 1. Ritüel Zamanlayıcı (Odak Sayacı) */}
        <button
          type="button"
          onClick={onToggleTimer}
          className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all active:scale-95 border ${
            timerAcik
              ? aktifBg
              : 'border-transparent text-slate-300 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Timer className={`w-4 h-4 shrink-0 ${timerAcik ? vurguRenk : 'text-slate-400'}`} />
          <span className=" whitespace-nowrap">Sayaç</span>
        </button>

        <div className="h-4 w-[1px] bg-white/[0.08]" />

        {/* 2. Yeni Kart Keşfet (Test / Yenile) */}
        <button
          type="button"
          disabled={yukleniyor}
          onClick={onYeniKartCek}
          className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 shrink-0 ${vurguRenk} ${yukleniyor ? 'animate-spin' : ''}`}
          />
          <span className="whitespace-nowrap">Yeni Kart</span>
        </button>

        <div className="h-4 w-[1px] bg-white/[0.08]" />

        {/* 3. Arşiv Çekmecesi */}
        <button
          type="button"
          onClick={onArsivAc}
          className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] active:scale-95 transition-all"
        >
          <Archive className="w-4 h-4 shrink-0 text-slate-400" />
          <span className="whitespace-nowrap">Arşiv</span>
          {gecmisSayisi > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-white/[0.12] text-slate-100">
              {gecmisSayisi}
            </span>
          )}
        </button>

        <div className="h-4 w-[1px] bg-white/[0.08]" />

        {/* 4. Kartı Paylaş / Panoya Kopyala */}
        <button
          type="button"
          onClick={onPaylas}
          title="Günün kartını paylaş veya kopyala"
          className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] active:scale-95 transition-all"
        >
          <Share2 className="w-4 h-4 shrink-0 text-slate-400" />
          <span className="whitespace-nowrap">Paylaş</span>
        </button>
      </motion.nav>
    </div>
  );
};
