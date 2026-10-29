import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useDailyStore } from './store/useDailyStore';
import { Header } from './components/Header';
import { FocusCard } from './components/FocusCard';
import { RitualPromptCard } from './components/RitualPromptCard';
import { ArchiveDrawer } from './components/ArchiveDrawer';
import { AmbientBackground } from './components/AmbientBackground';
import { BottomDock } from './components/BottomDock';
import { ApiKeyModal } from './components/ApiKeyModal';

export const App: React.FC = () => {
  const {
    aktifTur,
    bugunkuKart,
    bugunkuKartlar,
    gecmis,
    streak,
    yukleniyor,
    turSec,
    gunuKontrolEtVeYukle,
    kartiAc,
    kartiTamamla,
    kartZorlaYenile
  } = useDailyStore();

  const [arsivAcik, setArsivAcik] = useState(false);
  const [ayarlarAcik, setAyarlarAcik] = useState(false);
  const [timerAcik, setTimerAcik] = useState(false);
  const [paylasBildirimi, setPaylasBildirimi] = useState<string | null>(null);

  useEffect(() => {
    gunuKontrolEtVeYukle();
  }, [gunuKontrolEtVeYukle]);

  const handlePaylas = async () => {
    if (!bugunkuKart) {
      setPaylasBildirimi('Önce günün odak kartını açın');
      setTimeout(() => setPaylasBildirimi(null), 2000);
      return;
    }

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
        aktifTur={aktifTur}
        tamamlandiMi={bugunkuKart?.tamamlandi}
      />

      {/* Kopyalandı / Paylaşıldı Bildirim Hapı (Toast) */}
      <AnimatePresence>
        {paylasBildirimi && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.92 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-200 text-xs font-medium shadow-2xl backdrop-blur-xl"
          >
            <Check className="w-3.5 h-3.5 text-amber-400" />
            <span>{paylasBildirimi}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sabit Üst Bar + 3'lü Animasyonlu Mod Seçici (Kelime | Çizim | Yazılım) */}
      <Header
        streak={streak}
        gecmis={guvenliGecmis}
        bugunkuKartlar={bugunkuKartlar}
        yukleniyor={yukleniyor}
        aktifTur={aktifTur}
        onTurSec={(tur) => turSec(tur)}
        onYeniKartCek={() => void kartZorlaYenile()}
        onAyarlarAc={() => setAyarlarAcik(true)}
      />

      {/* Ana İçerik Alanı: Kullanıcı isteyene kadar mühürlü ritüel kartı, bastığında sinematik açılış */}
      <main className="relative z-10 flex-1 w-full pt-4 pb-24 sm:py-6 sm:pb-28 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!bugunkuKart || yukleniyor ? (
            <motion.div
              key={`prompt-${aktifTur}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <RitualPromptCard
                aktifTur={aktifTur}
                yukleniyor={yukleniyor}
                onKartiAc={() => void kartiAc(aktifTur)}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`card-${bugunkuKart.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FocusCard
                kart={bugunkuKart}
                timerAcik={timerAcik}
                onToggleTimer={() => setTimerAcik((prev) => !prev)}
                onTamamla={kartiTamamla}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* PWA Yüzen Cam Alt Dock */}
      <BottomDock
        aktifTur={aktifTur}
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
