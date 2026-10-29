import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useDailyStore } from './store/useDailyStore';
import { Header } from './components/Header';
import { FocusCard } from './components/FocusCard';
import { ArchiveDrawer } from './components/ArchiveDrawer';
import { AmbientBackground } from './components/AmbientBackground';
import { BottomDock } from './components/BottomDock';
import { ApiKeyModal } from './components/ApiKeyModal';

export const App: React.FC = () => {
  const {
    bugunkuKart,
    gecmis,
    streak,
    yukleniyor,
    gunuKontrolEtVeYukle,
    kartiTamamla,
    kartZorlaYenile
  } = useDailyStore();

  const [arsivAcik, setArsivAcik] = useState(false);
  const [ayarlarAcik, setAyarlarAcik] = useState(false);
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

  const guvenliGecmis = Array.isArray(gecmis) ? gecmis : [];

  return (
    <div className="relative min-h-screen w-full bg-[#0A0D14] text-slate-50 flex flex-col overflow-x-hidden">
      {/* Canlı Aurora & Yüzen Işık Zerreleri Arka Planı */}
      <AmbientBackground
        aktifTur={bugunkuKart?.tur}
        tamamlandiMi={bugunkuKart?.tamamlandi}
      />

      {/* Kopyalandı / Paylaşıldı Bildirim Hapı (Toast) */}
      <AnimatePresence>
        {paylasBildirimi && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.92 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-200 text-xs font-medium shadow-2xl backdrop-blur-xl"
          >
            <Check className="w-3.5 h-3.5 text-amber-400" />
            <span>{paylasBildirimi}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sabit Üst Bar (z-40 ile her zaman görünür ve dokunulabilir) */}
      <Header
        streak={streak}
        gecmis={guvenliGecmis}
        bugunTamamlandiMi={Boolean(bugunkuKart?.tamamlandi)}
        yukleniyor={yukleniyor}
        aktifTur={bugunkuKart?.tur}
        onYeniKartCek={() => void kartZorlaYenile()}
        onAyarlarAc={() => setAyarlarAcik(true)}
      />

      {/* Ana İçerik Alanı: Üstten doğal akış (justify-start), altta dock için boşluk (pb-24) */}
      <main className="relative z-10 flex-1 w-full pt-3 pb-24 sm:py-6 sm:pb-28">
        {yukleniyor || !bugunkuKart ? (
          <div className="w-full max-w-xl mx-auto px-3.5 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900/75 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-7 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 rounded-full bg-white/[0.06] animate-pulse" />
                <div className="h-5 w-20 rounded-full bg-white/[0.05] animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-40 rounded bg-amber-500/20 animate-pulse" />
                <div className="h-7 w-3/4 rounded-lg bg-white/[0.08] animate-pulse" />
              </div>
              <div className="h-12 w-full rounded-xl bg-white/[0.05] animate-pulse" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-white/[0.04] animate-pulse" />
                <div className="h-3.5 w-5/6 rounded bg-white/[0.04] animate-pulse" />
              </div>
              <div className="h-16 w-full rounded-xl bg-amber-500/[0.06] border border-amber-500/15 animate-pulse" />
              <div className="pt-1 flex items-center justify-center gap-2.5 text-xs text-slate-400">
                <div className="w-4 h-4 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
                <span className="font-serif tracking-wide">
                  Günün odak kartı hazırlanıyor...
                </span>
              </div>
            </div>
          </div>
        ) : (
          <FocusCard
            kart={bugunkuKart}
            timerAcik={timerAcik}
            onToggleTimer={() => setTimerAcik((prev) => !prev)}
            onTamamla={kartiTamamla}
          />
        )}
      </main>

      {/* PWA Yüzen Cam Alt Dock */}
      <BottomDock
        aktifTur={bugunkuKart?.tur}
        yukleniyor={yukleniyor}
        gecmisSayisi={guvenliGecmis.length}
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
        gecmis={guvenliGecmis}
      />

      {/* Mobil API Anahtarı & Bağlantı Modalı */}
      <ApiKeyModal
        isOpen={ayarlarAcik}
        onClose={() => setAyarlarAcik(false)}
        onSavedAndRefresh={() => void kartZorlaYenile()}
      />
    </div>
  );
};

export default App;
