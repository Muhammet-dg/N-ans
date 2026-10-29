import React, { useMemo } from 'react';
import {
  Flame,
  RefreshCw,
  KeyRound,
  BookOpen,
  Palette,
  Terminal,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BugunkuKartlarMap, GunlukKart, KartTuru } from '../types';

interface HeaderProps {
  streak: number;
  gecmis: GunlukKart[];
  bugunkuKartlar: BugunkuKartlarMap;
  yukleniyor: boolean;
  aktifTur: KartTuru;
  onTurSec: (tur: KartTuru) => void;
  onYeniKartCek: () => void;
  onAyarlarAc: () => void;
}

const KATEGORILER: {
  id: KartTuru;
  etiket: string;
  kisaEtiket: string;
  Icon: React.FC<{ className?: string }>;
  aktifRenk: string;
  noktaRenk: string;
}[] = [
  {
    id: 'KELIME',
    etiket: 'Kelime & Kavram',
    kisaEtiket: 'Kelime',
    Icon: BookOpen,
    aktifRenk: 'text-amber-200 border-amber-500/40 bg-amber-500/18 shadow-[0_0_20px_-4px_rgba(245,158,11,0.35)]',
    noktaRenk: 'bg-amber-400'
  },
  {
    id: 'CIZIM',
    etiket: 'Çizim & Hobi',
    kisaEtiket: 'Çizim',
    Icon: Palette,
    aktifRenk: 'text-emerald-200 border-emerald-500/40 bg-emerald-500/18 shadow-[0_0_20px_-4px_rgba(16,185,129,0.35)]',
    noktaRenk: 'bg-emerald-400'
  },
  {
    id: 'YAZILIM',
    etiket: 'Yazılım & CS',
    kisaEtiket: 'Yazılım',
    Icon: Terminal,
    aktifRenk: 'text-sky-200 border-sky-500/40 bg-sky-500/18 shadow-[0_0_20px_-4px_rgba(56,189,248,0.35)]',
    noktaRenk: 'bg-sky-400'
  }
];

export const Header: React.FC<HeaderProps> = ({
  streak,
  gecmis,
  bugunkuKartlar,
  yukleniyor,
  aktifTur,
  onTurSec,
  onYeniKartCek,
  onAyarlarAc
}) => {
  const bugunFormatli = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  const guvenliGecmis = Array.isArray(gecmis) ? gecmis : [];
  const bugunHerhangiTamamlandi = Boolean(
    bugunkuKartlar?.KELIME?.tamamlandi ||
      bugunkuKartlar?.CIZIM?.tamamlandi ||
      bugunkuKartlar?.YAZILIM?.tamamlandi
  );

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
        dolu: tamamlananTarihler.has(tarihStr) || (bugunMu && bugunHerhangiTamamlandi),
        bugunMu
      });
    }
    return gunler;
  }, [guvenliGecmis, bugunHerhangiTamamlandi]);

  const vurguNoktaSınıfı =
    aktifTur === 'KELIME'
      ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
      : aktifTur === 'CIZIM'
      ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
      : 'bg-sky-400 shadow-[0_0_8px_#38BDF8]';

  const ikonRenkSınıfı =
    aktifTur === 'KELIME'
      ? 'text-amber-400'
      : aktifTur === 'CIZIM'
      ? 'text-emerald-400'
      : 'text-sky-400';

  return (
    <header
      className="sticky top-0 z-40 w-full bg-[#0A0D14]/90 backdrop-blur-xl border-b border-white/[0.06] pointer-events-auto"
      style={{
        paddingTop: 'max(0.65rem, env(safe-area-inset-top, 0.65rem))'
      }}
    >
      <div className="w-full max-w-xl mx-auto px-3.5 sm:px-6 pb-2.5 space-y-2.5">
        {/* 1. Üst Satır: Marka & Aksiyon Butonları */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <motion.span
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className={`inline-block w-2 h-2 rounded-full shrink-0 transition-colors duration-500 ${vurguNoktaSınıfı}`}
              />
              <span className="font-display text-[11px] sm:text-xs tracking-[0.18em] uppercase text-slate-100 font-semibold truncate">
                Nüans &amp; Atelier
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5 font-medium truncate">
              {bugunFormatli}
            </p>
          </div>

          {/* Sağ: Seri (Streak), Yeni Kart ve API Ayarı */}
          <div className="flex items-center gap-1.5 shrink-0">
            <motion.div
              whileTap={{ scale: 0.94 }}
              title="Kesintisiz Günlük Odak Serisi"
              className={`min-h-[34px] flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-colors ${
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
            </motion.div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.93 }}
              disabled={yukleniyor}
              onClick={onYeniKartCek}
              className="min-h-[34px] flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-white/[0.12] text-slate-100 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
              title="Bu kategoride yeni kart çek"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 shrink-0 ${ikonRenkSınıfı} ${
                  yukleniyor ? 'animate-spin' : ''
                }`}
              />
              <span>Yeni Kart</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={onAyarlarAc}
              className="min-h-[34px] min-w-[34px] flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/[0.1] text-slate-200 hover:text-white transition-all cursor-pointer"
              title="API Anahtarı ve Bağlantı Ayarları"
              aria-label="Ayarlar"
            >
              <KeyRound className={`w-3.5 h-3.5 ${ikonRenkSınıfı}`} />
            </motion.button>
          </div>
        </div>

        {/* 2. Animasyonlu 3'lü Mod Seçici (Kelime | Çizim & Hobi | Yazılım & CS) */}
        <div
          role="tablist"
          aria-label="Odak Kategorisi Seçimi"
          className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-white/[0.08] shadow-inner"
        >
          {KATEGORILER.map((kat) => {
            const seciliMi = aktifTur === kat.id;
            const tamamlandiMi = Boolean(bugunkuKartlar?.[kat.id]?.tamamlandi);
            const Icon = kat.Icon;

            return (
              <motion.button
                key={kat.id}
                role="tab"
                aria-selected={seciliMi}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => onTurSec(kat.id)}
                className={`relative min-h-[38px] flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer select-none ${
                  seciliMi ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Kayan Yay Fiziği Kapsülü (Framer Motion layoutId) */}
                {seciliMi && (
                  <motion.div
                    layoutId="aktif-kategori-kapsulu"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 28
                    }}
                    className={`absolute inset-0 rounded-xl border ${kat.aktifRenk}`}
                  />
                )}

                <motion.span
                  animate={
                    seciliMi
                      ? { scale: [1, 1.18, 1], rotate: [0, -6, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.35 }}
                  className="relative z-10 flex items-center"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                </motion.span>

                <span className="relative z-10 truncate sm:hidden">{kat.kisaEtiket}</span>
                <span className="relative z-10 truncate hidden sm:inline">{kat.etiket}</span>

                {/* O gün tamamlandıysa parlayan onay rozeti */}
                {tamamlandiMi && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`relative z-10 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-slate-950 font-bold ${kat.noktaRenk}`}
                    title="Bugün tamamlandı"
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 3. Haftalık Ritüel İzi (Son 7 Gün) */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/65 border border-white/[0.05]">
          <span className="text-[10px] font-medium text-slate-400 tracking-wide">
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
                      ? vurguNoktaSınıfı
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
