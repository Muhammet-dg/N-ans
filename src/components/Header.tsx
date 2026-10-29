import React, { useMemo } from 'react';
import { Flame, Archive, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { GunlukKart, KartTuru } from '../types';

interface HeaderProps {
  streak: number;
  gecmis: GunlukKart[];
  bugunTamamlandiMi: boolean;
  yukleniyor: boolean;
  aktifTur?: KartTuru;
  onYeniKartCek: () => void;
  onArsivAc: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  gecmis,
  bugunTamamlandiMi,
  yukleniyor,
  aktifTur = 'KELIME',
  onYeniKartCek,
  onArsivAc
}) => {
  const bugunFormatli = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  const kelimeMi = aktifTur === 'KELIME';

  // Son 7 günün ritüel izi
  const sonYediGun = useMemo(() => {
    const tamamlananTarihler = new Set(gecmis.map((k) => k.tarih));
    const gunler: { Etiket: string; tarih: string; dolu: boolean; bugunMu: boolean }[] = [];
    const gunIsimleri = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yil = d.getFullYear();
      const ay = String(d.getMonth() + 1).padStart(2, '0');
      const gun = String(d.getDate()).padStart(2, '0');
      const tarihStr = `${yil}-${ay}-${gun}`;
      const bugunMu = i === 0;

      gunler.push({
        Etiket: gunIsimleri[d.getDay()],
        tarih: tarihStr,
        dolu: tamamlananTarihler.has(tarihStr) || (bugunMu && bugunTamamlandiMi),
        bugunMu
      });
    }
    return gunler;
  }, [gecmis, bugunTamamlandiMi]);

  return (
    <header className="w-full max-w-2xl mx-auto pt-5 pb-2 px-4 sm:px-6 z-20 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Sol: Marka & Tarih */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className={`inline-block w-2 h-2 rounded-full transition-colors duration-500 ${
                kelimeMi
                  ? 'bg-amber-400 shadow-[0_0_12px_#F59E0B]'
                  : 'bg-emerald-400 shadow-[0_0_12px_#10B981]'
              }`}
            />
            <span className="font-display text-xs sm:text-sm tracking-[0.24em] uppercase text-slate-100 font-semibold">
              Nüans &amp; Atelier
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 tracking-wider uppercase mt-0.5 font-medium">
            {bugunFormatli}
          </p>
        </div>

        {/* Sağ: Seri (Streak), Arşiv ve Geliştirici Test Butonu */}
        <div className="flex items-center gap-2">
          {/* Seri (Streak) Göstergesi */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            title="Kesintisiz Günlük Odak Serisi"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors ${
              streak > 0
                ? 'bg-amber-500/12 border-amber-500/35 text-amber-200 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/60 border-white/[0.08] text-slate-400'
            }`}
          >
            <motion.div
              animate={streak > 0 ? { rotate: [-6, 6, -6], scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Flame
                className={`w-3.5 h-3.5 ${
                  streak > 0 ? 'text-amber-400 fill-amber-400/35' : 'text-slate-400'
                }`}
              />
            </motion.div>
            <span className="text-xs font-bold">{streak}</span>
            <span className="text-[11px] opacity-80">Seri</span>
          </motion.div>

          {/* Geçmiş Arşiv Butonu */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onArsivAc}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/[0.08] text-slate-200 text-xs font-medium backdrop-blur-md transition-colors"
          >
            <Archive className="w-3.5 h-3.5 text-slate-400" />
            <span>Geçmiş</span>
            {gecmis.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/[0.08] text-slate-100">
                {gecmis.length}
              </span>
            )}
          </motion.button>

          {/* Geliştirici Test Butonu: Yeni Kart Çek (Test) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            disabled={yukleniyor}
            onClick={onYeniKartCek}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/[0.1] text-slate-200 text-xs font-medium backdrop-blur-md transition-colors disabled:opacity-50"
            title="Geliştirici Testi: Kotadan bağımsız yeni kart üret"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                kelimeMi ? 'text-amber-400' : 'text-emerald-400'
              } ${yukleniyor ? 'animate-spin' : ''}`}
            />
            <span>Yeni Kart Çek (Test)</span>
          </motion.button>
        </div>
      </div>

      {/* PWA Haftalık Ritüel Zinciri (Son 7 Gün) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-900/45 border border-white/[0.06] backdrop-blur-md"
      >
        <span className="text-[11px] font-medium text-slate-400 tracking-wide">
          Haftalık Ritüel İzi
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          {sonYediGun.map((g) => (
            <div key={g.tarih} className="flex flex-col items-center gap-1">
              <span
                className={`text-[9px] uppercase tracking-wider ${
                  g.bugunMu ? 'text-slate-100 font-bold' : 'text-slate-500'
                }`}
              >
                {g.Etiket}
              </span>
              <motion.span
                initial={false}
                animate={{
                  scale: g.dolu ? [1, 1.25, 1] : 1
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  g.dolu
                    ? kelimeMi
                      ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
                      : 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                    : g.bugunMu
                    ? 'border border-slate-400 bg-slate-800'
                    : 'bg-white/[0.08]'
                }`}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </header>
  );
};
