import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Timer, RefreshCw, Archive, Share2 } from 'lucide-react';
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
    <div className="sticky bottom-4 z-30 w-full px-4 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.15 }}
        aria-label="Hızlı PWA Kontrolleri"
        className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.75)]"
      >
        {/* 1. Ritüel Zamanlayıcı (Odak Sayacı) */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleTimer}
          className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
            timerAcik
              ? aktifBg
              : 'border-transparent text-slate-300 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Timer className={`w-4 h-4 ${timerAcik ? vurguRenk : 'text-slate-400'}`} />
          <span>Odak Sayacı</span>
        </motion.button>

        <div className="h-4 w-[1px] bg-white/[0.08]" />

        {/* 2. Yeni Kart Keşfet (Test / Yenile) */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          disabled={yukleniyor}
          onClick={onYeniKartCek}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${ vurguRenk } ${yukleniyor ? 'animate-spin' : ''}`}
          />
          <span>Yeni Kart</span>
        </motion.button>

        <div className="h-4 w-[1px] bg-white/[0.08]" />

        {/* 3. Arşiv Çekmecesi */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={onArsivAc}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <Archive className="w-4 h-4 text-slate-400" />
          <span>Arşiv</span>
          {gecmisSayisi > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-white/[0.1] text-slate-100">
              {gecmisSayisi}
            </span>
          )}
        </motion.button>

        <div className="h-4 w-[1px] bg-white/[0.08]" />

        {/* 4. Kartı Paylaş / Panoya Kopyala */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={onPaylas}
          title="Günün kartını paylaş veya kopyala"
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <Share2 className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Paylaş</span>
          <Sparkles className={`w-3 h-3 sm:hidden ${vurguRenk}`} />
        </motion.button>
      </motion.nav>
    </div>
  );
};
