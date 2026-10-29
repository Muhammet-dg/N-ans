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
    <header
      className="sticky top-0 z-40 w-full bg-[#0A0D14]/90 backdrop-blur-xl border-b border-white/[0.06] pointer-events-auto"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))'
      }}
    >
      <div className="w-full max-w-xl mx-auto px-3.5 sm:px-6 pb-2.5 space-y-2">
        {/* Üst Satır: Marka & Aksiyon Butonları */}
        <div className="flex items-center justify-between gap-2">
          {/* Sol: Marka & Tarih */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <motion.span
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className={`inline-block w-2 h-2 rounded-full shrink-0 transition-colors duration-500 ${
                  kelimeMi
                    ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
                    : 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                }`}
              />
              <span className="font-display text-[11px] sm:text-xs tracking-[0.18em] uppercase text-slate-100 font-semibold truncate">
                Nüans &amp; Atelier
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 tracking-wider uppercase mt-0.5 font-medium truncate">
              {bugunFormatli}
            </p>
          </div>

          {/* Sağ: Seri (Streak), Yeni Kart ve API Ayarı */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Seri (Streak) Göstergesi */}
            <div
              title="Kesintisiz Günlük Odak Serisi"
              className={`min-h-[36px] flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-colors ${
                streak > 0
                  ? 'bg-amber-500/15 border-amber-500/35 text-amber-200'
                  : 'bg-slate-900/80 border-white/[0.08] text-slate-300'
              }`}
            >
              <Flame
                className={`w-3.5 h-3.5 shrink-0 ${
                  streak > 0 ? 'text-amber-400 fill-amber-400/35' : 'text-slate-400'
                }`}
              />
              <span className="text-xs font-bold">{streak}</span>
            </div>

            {/* Yeni Kart Çek Butonu */}
            <button
              type="button"
              disabled={yukleniyor}
              onClick={onYeniKartCek}
              className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 active:scale-95 border border-white/[0.12] text-slate-100 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
              title="Yeni Kart Çek"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 shrink-0 ${
                  kelimeMi ? 'text-amber-400' : 'text-emerald-400'
                } ${yukleniyor ? 'animate-spin' : ''}`}
              />
              <span>Yeni Kart</span>
            </button>

            {/* Mobil API Anahtarı & Bağlantı Butonu */}
            <button
              type="button"
              onClick={onAyarlarAc}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-800 active:scale-95 border border-white/[0.1] text-slate-200 hover:text-white transition-all cursor-pointer"
              title="API Anahtarı ve Bağlantı Ayarları"
              aria-label="Ayarlar"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Alt Satır: Haftalık Ritüel Zinciri (Son 7 Gün) */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/70 border border-white/[0.06]">
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 tracking-wide">
            Haftalık Ritüel İzi
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            {sonYediGun.map((g) => (
              <div key={g.tarih} className="flex items-center gap-1">
                <span
                  className={`text-[9px] uppercase ${
                    g.bugunMu ? 'text-slate-100 font-bold' : 'text-slate-500'
                  }`}
                >
                  {g.Etiket}
                </span>
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    g.dolu
                      ? kelimeMi
                        ? 'bg-amber-400 shadow-[0_0_6px_#F59E0B]'
                        : 'bg-emerald-400 shadow-[0_0_6px_#10B981]'
                      : g.bugunMu
                      ? 'border border-slate-400 bg-slate-800'
                      : 'bg-white/[0.1]'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
