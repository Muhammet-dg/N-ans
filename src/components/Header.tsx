import React, { useMemo } from 'react';
import { Flame, RefreshCw, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { GunlukKart, KartTuru } from '../types';

interface HeaderProps {
  streak: number;
  gecmis: GunlukKart[];
  bugunTamamlandiMi: boolean;
  yukleniyor: boolean;
  aktifTur?: KartTuru;
  onYeniKartCek: () => void;
  onAyarlarAc: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  gecmis,
  bugunTamamlandiMi,
  yukleniyor,
  aktifTur = 'KELIME',
  onYeniKartCek,
  onAyarlarAc
}) => {
  const bugunFormatli = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  const kelimeMi = aktifTur === 'KELIME';
  const guvenliGecmis = Array.isArray(gecmis) ? gecmis : [];

  // Son 7 günün ritüel izi
  const sonYediGun = useMemo(() => {
    const tamamlananTarihler = new Set(guvenliGecmis.map((k) => k.tarih));
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
  }, [guvenliGecmis, bugunTamamlandiMi]);

  return (
    <header className="w-full max-w-2xl mx-auto pt-safe pb-2 px-4 sm:px-6 z-20 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Sol: Marka & Tarih */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className={`inline-block w-2 h-2 rounded-full shrink-0 transition-colors duration-500 ${
                kelimeMi
                  ? 'bg-amber-400 shadow-[0_0_10px_#F59E0B]'
                  : 'bg-emerald-400 shadow-[0_0_10px_#10B981]'
              }`}
            />
            <span className="font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-slate-100 font-semibold truncate">
              Nüans &amp; Atelier
            </span>
          </div>
          <p className="text-[11px] text-slate-400 tracking-wider uppercase mt-0.5 font-medium truncate">
            {bugunFormatli}
          </p>
        </div>

        {/* Sağ: Seri (Streak), API Ayarı ve Yeni Kart Çek (Test) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Seri (Streak) Göstergesi */}
          <div
            title="Kesintisiz Günlük Odak Serisi"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border backdrop-blur-md transition-colors ${
              streak > 0
                ? 'bg-amber-500/12 border-amber-500/35 text-amber-200'
                : 'bg-slate-900/60 border-white/[0.08] text-slate-400'
            }`}
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                streak > 0 ? 'text-amber-400 fill-amber-400/35' : 'text-slate-400'
              }`}
            />
            <span className="text-xs font-bold">{streak}</span>
            <span className="hidden xs:inline text-[11px] opacity-80">Seri</span>
          </div>

          {/* Geliştirici / Hızlı Yenile Butonu */}
          <button
            type="button"
            disabled={yukleniyor}
            onClick={onYeniKartCek}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 active:scale-95 border border-white/[0.1] text-slate-200 text-xs font-medium backdrop-blur-md transition-all disabled:opacity-50"
            title="Yeni Kart Çek (Test)"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                kelimeMi ? 'text-amber-400' : 'text-emerald-400'
              } ${yukleniyor ? 'animate-spin' : ''}`}
            />
            <span className="text-[11px] sm:text-xs">Yeni Kart</span>
          </button>

          {/* Mobil API Anahtarı & Bağlantı Butonu */}
          <button
            type="button"
            onClick={onAyarlarAc}
            className="p-2 rounded-full bg-slate-900/70 hover:bg-slate-800 active:scale-95 border border-white/[0.08] text-slate-300 hover:text-white transition-all"
            title="API Anahtarı ve Bağlantı Ayarları"
            aria-label="Ayarlar"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400/90" />
          </button>
        </div>
      </div>

      {/* PWA Haftalık Ritüel Zinciri (Son 7 Gün) */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-900/50 border border-white/[0.06] backdrop-blur-md">
        <span className="text-[11px] font-medium text-slate-400 tracking-wide">
          Haftalık Ritüel İzi
        </span>
        <div className="flex items-center gap-2.5 sm:gap-3">
          {sonYediGun.map((g) => (
            <div key={g.tarih} className="flex flex-col items-center gap-1">
              <span
                className={`text-[9px] uppercase tracking-wider ${
                  g.bugunMu ? 'text-slate-100 font-bold' : 'text-slate-500'
                }`}
              >
                {g.Etiket}
              </span>
              <span
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
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
      </div>
    </header>
  );
};
