import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Check } from 'lucide-react';
import { useDailyStore } from './store/useDailyStore';
import { Header } from './components/Header';
import { FocusCard } from './components/FocusCard';
import { ArchiveDrawer } from './components/ArchiveDrawer';
import { AmbientBackground } from './components/AmbientBackground';
import { BottomDock } from './components/BottomDock';

export const App: React.FC = () => {
  const {
    bugunkuKart,
    gecmis,
    streak,
    yukleniyor,
    hata,
    gunuKontrolEtVeYukle,
    kartiTamamla,
    kartZorlaYenile
  } = useDailyStore();

  const [arsivAcik, setArsivAcik] = useState(false);
  const [timerAcik, setTimerAcik] = useState(false);
  const [paylasBildirimi, setPaylasBildirimi] = useState<string | null>(null);

  useEffect(() => {
    void gunuKontrolEtVeYukle();
  }, [gunuKontrolEtVeYukle]);

  const handlePaylas = async () => {
    if (!bugunkuKart) return;

    const metin = `✦ ${bugunkuKart.baslik} (${bugunkuKart.alt_baslik})\n\n“${bugunkuKart.ozet}”\n\nGörev: ${bugunkuKart.gunluk_gorev}\n— Nüans & Atelier`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Nüans • ${bugunkuKart.baslik}`,
          text: metin
        });
        return;
      }
    } catch {
      // Kullanıcı paylaşımı iptal ettiyse veya desteklenmiyorsa panoya kopyala
    }

    try {
      await navigator.clipboard.writeText(metin);
      setPaylasBildirimi('Günün kartı panoya kopyalandı');
      setTimeout(() => setPaylasBildirimi(null), 2400);
    } catch {
      setPaylasBildirimi('Paylaşım metni hazırlandı');
      setTimeout(() => setPaylasBildirimi(null), 2000);
    }
  };

  return (
    <div className="relative min-h-dvh w-full bg-slate-950 text-slate-50 flex flex-col justify-between overflow-x-hidden">
      {/* Canlı Aurora & Yüzen Işık Zerreleri Arka Planı */}
      <AmbientBackground
        aktifTur={bugunkuKart?.tur}
        tamamlandiMi={bugunkuKart?.tamamlandi}
      />

      {/* Kopyalandı / Paylaşıldı Bildirim Hapı (Toast) */}
      <AnimatePresence>
        {paylasBildirimi && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.92 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-200 text-xs font-medium shadow-2xl backdrop-blur-xl"
          >
            <Check className="w-3.5 h-3.5 text-amber-400" />
            <span>{paylasBildirimi}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Üst Bar + Haftalık Ritüel İzi */}
      <Header
        streak={streak}
        gecmis={gecmis}
        bugunTamamlandiMi={Boolean(bugunkuKart?.tamamlandi)}
        yukleniyor={yukleniyor}
        aktifTur={bugunkuKart?.tur}
        onYeniKartCek={() => void kartZorlaYenile()}
        onArsivAc={() => setArsivAcik(true)}
      />

      {/* Ana İçerik Alanı */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-2">
        {yukleniyor ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto px-4 sm:px-6 my-auto"
          >
            <div className="relative overflow-hidden rounded-[28px] bg-slate-900/60 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-9 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="h-6 w-36 rounded-full bg-white/[0.06] animate-pulse" />
                <div className="h-5 w-20 rounded-full bg-white/[0.05] animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-44 rounded bg-amber-500/20 animate-pulse" />
                <div className="h-9 w-3/4 rounded-lg bg-white/[0.08] animate-pulse" />
              </div>
              <div className="h-16 w-full rounded-xl bg-white/[0.05] animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-white/[0.04] animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-white/[0.04] animate-pulse" />
                <div className="h-4 w-4/6 rounded bg-white/[0.04] animate-pulse" />
              </div>
              <div className="h-24 w-full rounded-2xl bg-amber-500/[0.06] border border-amber-500/15 animate-pulse" />
              <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-400">
                <div className="w-4 h-4 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
                <span className="font-serif tracking-wide">
                  Yeni odak kartı kürasyonu hazırlanıyor...
                </span>
              </div>
            </div>
          </motion.div>
        ) : hata ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg mx-auto px-6 py-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-rose-500/30 text-center space-y-4 shadow-2xl"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-serif text-xl font-semibold text-slate-100">
                Kart Yüklenemedi
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {hata}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void kartZorlaYenile()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs sm:text-sm font-medium text-slate-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tekrar Dene</span>
            </button>
          </motion.div>
        ) : bugunkuKart ? (
          <FocusCard
            kart={bugunkuKart}
            timerAcik={timerAcik}
            onToggleTimer={() => setTimerAcik((prev) => !prev)}
            onTamamla={kartiTamamla}
          />
        ) : null}
      </main>

      {/* PWA Yüzen Cam Alt Dock */}
      <BottomDock
        aktifTur={bugunkuKart?.tur}
        yukleniyor={yukleniyor}
        gecmisSayisi={gecmis.length}
        timerAcik={timerAcik}
        onToggleTimer={() => setTimerAcik((prev) => !prev)}
        onYeniKartCek={() => void kartZorlaYenile()}
        onArsivAc={() => setArsivAcik(true)}
        onPaylas={() => void handlePaylas()}
      />

      {/* Geçmiş Çekmecesi */}
      <ArchiveDrawer
        isOpen={arsivAcik}
        onClose={() => setArsivAcik(false)}
        gecmis={gecmis}
      />
    </div>
  );
};

export default App;
