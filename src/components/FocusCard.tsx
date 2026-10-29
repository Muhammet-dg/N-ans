import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Palette,
  Terminal,
  Lightbulb,
  Compass,
  Feather,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Cpu
} from 'lucide-react';
import { GunlukKart } from '../types';

interface FocusCardProps {
  kart: GunlukKart;
  timerAcik: boolean;
  onToggleTimer: () => void;
  onTamamla: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 24
    }
  }
};

export const FocusCard: React.FC<FocusCardProps> = ({
  kart,
  timerAcik,
  onToggleTimer,
  onTamamla
}) => {
  const [pulseActive, setPulseActive] = useState(false);

  // Kategoriye göre önerilen varsayılan odak süresi (Yazılım: 15dk, Çizim: 12dk, Kelime: 10dk)
  const varsayilanDakika = kart.tur === 'YAZILIM' ? 15 : kart.tur === 'CIZIM' ? 12 : 10;
  const [secilenDakika, setSecilenDakika] = useState<number>(varsayilanDakika);
  const [kalanSaniye, setKalanSaniye] = useState<number>(varsayilanDakika * 60);
  const [sayacCalisiyor, setSayacCalisiyor] = useState<boolean>(false);

  useEffect(() => {
    const yeniVarsayilan = kart.tur === 'YAZILIM' ? 15 : kart.tur === 'CIZIM' ? 12 : 10;
    setSayacCalisiyor(false);
    setSecilenDakika(yeniVarsayilan);
    setKalanSaniye(yeniVarsayilan * 60);
  }, [kart.tur]);

  useEffect(() => {
    if (!sayacCalisiyor) return;
    const interval = window.setInterval(() => {
      setKalanSaniye((onceki) => {
        if (onceki <= 1) {
          setSayacCalisiyor(false);
          return 0;
        }
        return onceki - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sayacCalisiyor]);

  const sureSec = (dk: number) => {
    setSayacCalisiyor(false);
    setSecilenDakika(dk);
    setKalanSaniye(dk * 60);
  };

  const toplamSaniye = secilenDakika * 60;
  const ilerlemeOrani = toplamSaniye > 0 ? (toplamSaniye - kalanSaniye) / toplamSaniye : 0;
  const dakikaMetni = String(Math.floor(kalanSaniye / 60)).padStart(2, '0');
  const saniyeMetni = String(kalanSaniye % 60).padStart(2, '0');

  // 3 Kategori için Tema Renkleri
  const tema =
    kart.tur === 'KELIME'
      ? {
          primaryHex: '#F59E0B',
          softHex: '#FDE68A',
          badgeClass: 'bg-amber-500/12 text-amber-200 border-amber-500/30',
          borderLeftClass: 'border-amber-500/70',
          taskBoxClass:
            'bg-gradient-to-br from-amber-500/[0.11] via-slate-900/60 to-slate-900/80 border-amber-500/25',
          pulseClass: 'border-amber-400 shadow-[0_0_45px_-5px_rgba(245,158,11,0.5)]',
          doneCardClass: 'border-amber-500/35 shadow-glow-amber',
          doneBtnClass:
            'bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-glow-amber cursor-default',
          activeBtnClass:
            'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25',
          confettiColors: ['#F59E0B', '#FDE68A', '#FFFBEB', '#D97706'],
          etiketMetni: 'Entelektüel Kavram',
          detayBasligi: 'Felsefi & Bilişsel Derinlik',
          gorevBasligi: 'Günlük Kullanım & Araştırma Görevi',
          sayacAciklama: 'Derin okuma & kavramsal tefekkür'
        }
      : kart.tur === 'CIZIM'
      ? {
          primaryHex: '#10B981',
          softHex: '#6EE7B7',
          badgeClass: 'bg-emerald-500/12 text-emerald-200 border-emerald-500/30',
          borderLeftClass: 'border-emerald-500/70',
          taskBoxClass:
            'bg-gradient-to-br from-emerald-500/[0.11] via-slate-900/60 to-slate-900/80 border-emerald-500/25',
          pulseClass: 'border-emerald-400 shadow-[0_0_45px_-5px_rgba(16,185,129,0.5)]',
          doneCardClass: 'border-emerald-500/35 shadow-glow-sage',
          doneBtnClass:
            'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 shadow-glow-sage cursor-default',
          activeBtnClass:
            'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/25',
          confettiColors: ['#10B981', '#6EE7B7', '#ECFDF5', '#059669'],
          etiketMetni: 'Çizim & Hobi Ritüeli',
          detayBasligi: 'Tekniğin Kritik Noktası',
          gorevBasligi: '10-15 Dakikalık Eskiz Görevi',
          sayacAciklama: 'Kağıt & kurşun kalemle eskiz süresi'
        }
      : {
          primaryHex: '#38BDF8',
          softHex: '#BAE6FD',
          badgeClass: 'bg-sky-500/12 text-sky-200 border-sky-500/30',
          borderLeftClass: 'border-sky-400/70',
          taskBoxClass:
            'bg-gradient-to-br from-sky-500/[0.12] via-indigo-950/30 to-slate-900/85 border-sky-500/30',
          pulseClass: 'border-sky-400 shadow-[0_0_45px_-5px_rgba(56,189,248,0.5)]',
          doneCardClass: 'border-sky-500/40 shadow-[0_0_35px_-5px_rgba(56,189,248,0.3)]',
          doneBtnClass:
            'bg-sky-500/20 text-sky-200 border border-sky-400/40 cursor-default',
          activeBtnClass:
            'bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 text-slate-950 hover:brightness-110 shadow-lg shadow-sky-500/25',
          confettiColors: ['#38BDF8', '#BAE6FD', '#818CF8', '#E0F2FE'],
          etiketMetni: 'Yazılım & Bilgisayar Müh.',
          detayBasligi: 'Mimari & Mühendislik Derinliği',
          gorevBasligi: '15 Dakikalık Mühendislik Pratiği',
          sayacAciklama: '15 dk algoritma & sistem tasarımı odaklanması'
        };

  const handleTamamlaClick = () => {
    if (kart.tamamlandi) return;

    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 1200);

    try {
      confetti({
        particleCount: 42,
        spread: 64,
        origin: { y: 0.75 },
        colors: tema.confettiColors,
        disableForReducedMotion: true,
        scalar: 0.88
      });
    } catch {
      // Confetti desteklenmeyen ortamda sessizce devam et
    }

    onTamamla();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3.5 sm:px-6">
      <AnimatePresence mode="wait">
        <motion.article
          key={kart.id}
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.985 }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 24
          }}
          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900/80 backdrop-blur-xl border shadow-2xl transition-colors duration-500 ${
            pulseActive
              ? tema.pulseClass
              : kart.tamamlandi
              ? tema.doneCardClass
              : 'border-white/[0.09] shadow-glass'
          }`}
        >
          {/* Üst Hareketli Işık Şeridi */}
          <div className="relative h-[2px] w-full overflow-hidden bg-white/[0.04]">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="h-full w-2/3"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${tema.primaryHex} 50%, transparent 100%)`
              }}
            />
          </div>

          {/* Kademeli (Staggered) İçerik Gövdesi */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 p-4 sm:p-7 space-y-3.5 sm:space-y-4"
          >
            {/* 1. Üst Kategori Rozeti & Odak Sayacı Butonu */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between gap-2"
            >
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase border ${tema.badgeClass}`}
              >
                {kart.tur === 'KELIME' ? (
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                ) : kart.tur === 'CIZIM' ? (
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                )}
                <span>{tema.etiketMetni}</span>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.93 }}
                onClick={onToggleTimer}
                className={`min-h-[32px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                  timerAcik || sayacCalisiyor
                    ? tema.badgeClass
                    : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white'
                }`}
              >
                <Timer className="w-3.5 h-3.5" style={{ color: tema.primaryHex }} />
                <span>
                  {sayacCalisiyor ? `${dakikaMetni}:${saniyeMetni}` : `${secilenDakika} dk Sayaç`}
                </span>
              </motion.button>
            </motion.div>

            {/* Etkileşimli Odak Sayacı Paneli */}
            <AnimatePresence>
              {timerAcik && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 rounded-xl bg-slate-950/85 border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke={tema.primaryHex}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 24}
                            strokeDashoffset={2 * Math.PI * 24 * (1 - ilerlemeOrani)}
                          />
                        </svg>
                        <span className="absolute font-mono text-[10px] font-bold text-slate-100">
                          {dakikaMetni}:{saniyeMetni}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-100">
                          {sayacCalisiyor ? 'Odak Sayacı Çalışıyor' : 'Ritüel Zamanlayıcı'}
                        </p>
                        <p className="text-[10px] text-slate-400">{tema.sayacAciklama}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-white/[0.06]">
                        {[10, 12, 15].map((dk) => (
                          <button
                            key={dk}
                            type="button"
                            onClick={() => sureSec(dk)}
                            className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                              secilenDakika === dk
                                ? 'bg-white/15 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {dk}dk
                          </button>
                        ))}
                      </div>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSayacCalisiyor((prev) => !prev)}
                        className="p-2 rounded-lg text-slate-950 font-semibold cursor-pointer"
                        style={{ backgroundColor: tema.primaryHex }}
                        title={sayacCalisiyor ? 'Duraklat' : 'Başlat'}
                      >
                        {sayacCalisiyor ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                      </motion.button>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => sureSec(secilenDakika)}
                        className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 transition-colors cursor-pointer"
                        title="Sayacı Sıfırla"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Başlık & Alt Başlık */}
            <motion.div variants={itemVariants} className="space-y-1">
              <p
                className="text-[11px] sm:text-xs font-medium tracking-wide uppercase"
                style={{ color: tema.softHex }}
              >
                {kart.alt_baslik}
              </p>
              <h1 className="font-serif text-xl sm:text-3xl font-semibold text-slate-50 tracking-tight leading-snug">
                {kart.baslik}
              </h1>
            </motion.div>

            {/* 3. Vurucu Özet */}
            <motion.div
              variants={itemVariants}
              className={`pl-3 sm:pl-4 py-0.5 border-l-2 ${tema.borderLeftClass}`}
            >
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                {kart.ozet}
              </p>
            </motion.div>

            {/* 4. Detay / Felsefe / Mühendislik Derinliği */}
            <motion.div variants={itemVariants} className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400">
                {kart.tur === 'YAZILIM' ? (
                  <Cpu className="w-3.5 h-3.5 shrink-0" style={{ color: tema.primaryHex }} />
                ) : (
                  <Compass className="w-3.5 h-3.5 shrink-0" style={{ color: tema.primaryHex }} />
                )}
                <span>{tema.detayBasligi}</span>
              </div>
              <p className="text-[13px] sm:text-[15px] text-slate-300/95 leading-relaxed">
                {kart.detay}
              </p>
            </motion.div>

            {/* 5. Günlük Somut Görev */}
            <motion.div
              variants={itemVariants}
              className={`rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border ${tema.taskBoxClass}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{ color: tema.softHex }}
                >
                  <Feather className="w-3.5 h-3.5 shrink-0" />
                  {tema.gorevBasligi}
                </span>
              </div>
              <p className="text-[13px] sm:text-[15px] text-slate-100 leading-relaxed">
                {kart.gunluk_gorev}
              </p>
            </motion.div>

            {/* 6. Pratik İpucu */}
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <Lightbulb
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5"
                style={{ color: tema.primaryHex }}
              />
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-slate-100 font-medium">İpucu: </strong>
                {kart.ipucu}
              </p>
            </motion.div>

            {/* 7. Tamamlandı Butonu */}
            <motion.div variants={itemVariants} className="pt-0.5">
              <motion.button
                type="button"
                whileHover={{ scale: kart.tamamlandi ? 1 : 1.01 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleTamamlaClick}
                disabled={kart.tamamlandi}
                className={`w-full min-h-[44px] rounded-xl sm:rounded-2xl py-3 sm:py-3.5 px-4 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  kart.tamamlandi ? tema.doneBtnClass : tema.activeBtnClass
                }`}
              >
                <span className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" className="opacity-35" />
                    <motion.path
                      d="M8 12.5L10.8 15.3L16.2 9.5"
                      initial={false}
                      animate={{
                        pathLength: kart.tamamlandi ? 1 : 0.25,
                        opacity: kart.tamamlandi ? 1 : 0.7
                      }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    />
                  </svg>
                </span>
                <span>
                  {kart.tamamlandi ? 'Bu Odak Tamamlandı ✓' : 'Tamamlandı Olarak İşaretle'}
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
};
