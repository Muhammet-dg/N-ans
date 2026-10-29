import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
  Variants
} from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  PenTool,
  Lightbulb,
  Compass,
  Feather,
  Play,
  Pause,
  RotateCcw,
  Timer
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
      staggerChildren: 0.075,
      delayChildren: 0.08
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 22
    }
  }
};

export const FocusCard: React.FC<FocusCardProps> = ({
  kart,
  timerAcik,
  onToggleTimer,
  onTamamla
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pulseActive, setPulseActive] = useState(false);

  // 12 Dakikalık Ritüel Odak Sayacı State'i
  const [secilenDakika, setSecilenDakika] = useState<number>(12);
  const [kalanSaniye, setKalanSaniye] = useState<number>(12 * 60);
  const [sayacCalisiyor, setSayacCalisiyor] = useState<boolean>(false);

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

  const kelimeMi = kart.tur === 'KELIME';

  // 3D Tilt & İmleç Takip Eden Radial Işık Süzmesi
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(30);
  const isHovering = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);
  const smoothGlowX = useSpring(glowX, { stiffness: 180, damping: 25 });
  const smoothGlowY = useSpring(glowY, { stiffness: 180, damping: 25 });
  const glowOpacity = useSpring(isHovering, { stiffness: 200, damping: 25 });

  const accentRgb = kelimeMi ? '245, 158, 11' : '16, 185, 129';
  const softHex = kelimeMi ? '#FDE68A' : '#6EE7B7';
  const primaryHex = kelimeMi ? '#F59E0B' : '#10B981';

  const radialSpotlight = useMotionTemplate`radial-gradient(520px circle at ${smoothGlowX}% ${smoothGlowY}%, rgba(${accentRgb}, 0.16), transparent 70%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouseX.set(clientX / rect.width - 0.5);
    mouseY.set(clientY / rect.height - 0.5);
    glowX.set((clientX / rect.width) * 100);
    glowY.set((clientY / rect.height) * 100);
    isHovering.set(1);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    isHovering.set(0);
  };

  const handleTamamlaClick = () => {
    if (kart.tamamlandi) return;

    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 1400);

    try {
      const colors = kelimeMi
        ? ['#F59E0B', '#FDE68A', '#FFFBEB', '#D97706']
        : ['#10B981', '#6EE7B7', '#ECFDF5', '#059669'];

      confetti({
        particleCount: 42,
        spread: 65,
        origin: { y: 0.78 },
        colors,
        disableForReducedMotion: true,
        scalar: 0.9
      });

      setTimeout(() => {
        confetti({
          particleCount: 24,
          angle: 60,
          spread: 50,
          origin: { x: 0.2, y: 0.75 },
          colors,
          disableForReducedMotion: true,
          scalar: 0.75
        });
        confetti({
          particleCount: 24,
          angle: 120,
          spread: 50,
          origin: { x: 0.8, y: 0.75 },
          colors,
          disableForReducedMotion: true,
          scalar: 0.75
        });
      }, 180);
    } catch {
      // Confetti desteklenmeyen ortamda sessizce devam et
    }

    onTamamla();
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto px-4 sm:px-6 my-auto py-2"
      style={{ perspective: '1100px' }}
    >
      <AnimatePresence mode="wait">
        <motion.article
          key={kart.id}
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          initial={{ opacity: 0, y: 32, scale: 0.97, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, scale: 0.98, filter: 'blur(8px)' }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 22
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d'
          }}
          className={`relative overflow-hidden rounded-[28px] bg-slate-900/65 backdrop-blur-2xl border shadow-2xl transition-colors duration-500 ${
            pulseActive
              ? kelimeMi
                ? 'border-amber-400 shadow-[0_0_55px_-5px_rgba(245,158,11,0.55)]'
                : 'border-emerald-400 shadow-[0_0_55px_-5px_rgba(16,185,129,0.55)]'
              : kart.tamamlandi
              ? kelimeMi
                ? 'border-amber-500/35 shadow-glow-amber'
                : 'border-emerald-500/35 shadow-glow-sage'
              : 'border-white/[0.09] shadow-glass'
          }`}
        >
          {/* İmleci takip eden yumuşak radial ışık süzmesi */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: radialSpotlight,
              opacity: glowOpacity
            }}
          />

          {/* Üst Hareketli Işık Şeridi (Animated Shimmer Line) */}
          <div className="relative h-[2px] w-full overflow-hidden bg-white/[0.04]">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
              className="h-full w-2/3"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${primaryHex} 50%, transparent 100%)`
              }}
            />
          </div>

          {/* Tamamlanma Darbe Dalgası */}
          <AnimatePresence>
            {pulseActive && (
              <motion.div
                initial={{ opacity: 0.6, scale: 0.96 }}
                animate={{ opacity: 0, scale: 1.05 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-0 rounded-[28px] z-10"
                style={{
                  boxShadow: `inset 0 0 48px ${primaryHex}`
                }}
              />
            )}
          </AnimatePresence>

          {/* Kademeli (Staggered) İçerik Gövdesi */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 p-6 sm:p-8 space-y-5"
          >
            {/* 1. Üst Kategori Etiketi & Odak Sayacı Tetikleyicisi */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between gap-2"
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${
                  kelimeMi
                    ? 'bg-amber-500/10 text-amber-200 border-amber-500/25'
                    : 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25'
                }`}
              >
                {kelimeMi ? (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Entelektüel Kavram</span>
                  </>
                ) : (
                  <>
                    <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Çizim &amp; Eskiz Görevi</span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={onToggleTimer}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  timerAcik || sayacCalisiyor
                    ? kelimeMi
                      ? 'bg-amber-500/15 border-amber-500/35 text-amber-200'
                      : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
                    : 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Timer className="w-3.5 h-3.5" style={{ color: primaryHex }} />
                <span>{sayacCalisiyor ? `${dakikaMetni}:${saniyeMetni}` : `${secilenDakika} dk Sayaç`}</span>
              </button>
            </motion.div>

            {/* Etkileşimli Odak & Eskiz Zamanlayıcısı (Açılır Panel) */}
            <AnimatePresence>
              {timerAcik && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-2xl bg-slate-950/75 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Sol: Dairesel SVG Odak Halkası */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        {sayacCalisiyor && (
                          <motion.span
                            animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.1, 0.35] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: primaryHex }}
                          />
                        )}
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="3.5"
                          />
                          <motion.circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke={primaryHex}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 24}
                            animate={{
                              strokeDashoffset: 2 * Math.PI * 24 * (1 - ilerlemeOrani)
                            }}
                            transition={{ duration: 0.4 }}
                          />
                        </svg>
                        <span className="absolute font-mono text-xs font-bold text-slate-100">
                          {dakikaMetni}:{saniyeMetni}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-100">
                          {sayacCalisiyor ? 'Derin Odak Aktif...' : 'Ritüel Odak Sayacı'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {kelimeMi
                            ? 'Kavram üzerine derin okuma & tefekkür'
                            : 'Kağıt ve kurşun kalemle kesintisiz eskiz'}
                        </p>
                      </div>
                    </div>

                    {/* Sağ: Süre Seçimi & Başlat/Duraklat */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/[0.06]">
                        {[5, 12, 15].map((dk) => (
                          <button
                            key={dk}
                            type="button"
                            onClick={() => sureSec(dk)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                              secilenDakika === dk
                                ? 'bg-white/15 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {dk}dk
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSayacCalisiyor((prev) => !prev)}
                        className="p-2.5 rounded-xl text-slate-950 font-semibold transition-transform active:scale-95"
                        style={{ backgroundColor: primaryHex }}
                        title={sayacCalisiyor ? 'Duraklat' : 'Başlat'}
                      >
                        {sayacCalisiyor ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => sureSec(secilenDakika)}
                        className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 transition-colors"
                        title="Sayacı Sıfırla"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Başlık & Alt Başlık */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <p
                className="text-xs sm:text-sm font-medium tracking-wide uppercase"
                style={{ color: softHex }}
              >
                {kart.alt_baslik}
              </p>
              <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-slate-50 tracking-tight leading-tight">
                {kart.baslik}
              </h1>
            </motion.div>

            {/* 3. Vurucu Özet */}
            <motion.div
              variants={itemVariants}
              className={`pl-4 sm:pl-5 py-1 border-l-2 ${
                kelimeMi ? 'border-amber-500/70' : 'border-emerald-500/70'
              }`}
            >
              <p className="text-base sm:text-[17px] text-slate-100 font-medium leading-relaxed">
                {kart.ozet}
              </p>
            </motion.div>

            {/* 4. Detay / Felsefe / Teknik Püf Noktası */}
            <motion.div variants={itemVariants} className="space-y-2 pt-0.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                <Compass className="w-3.5 h-3.5" style={{ color: primaryHex }} />
                <span>{kelimeMi ? 'Felsefi & Bilişsel Derinlik' : 'Tekniğin Kritik Noktası'}</span>
              </div>
              <p className="text-sm sm:text-[15px] text-slate-300/90 leading-relaxed">
                {kart.detay}
              </p>
            </motion.div>

            {/* 5. Günlük Somut Görev */}
            <motion.div
              variants={itemVariants}
              className={`rounded-2xl p-4 sm:p-5 border ${
                kelimeMi
                  ? 'bg-gradient-to-br from-amber-500/[0.09] via-slate-900/60 to-slate-900/80 border-amber-500/25'
                  : 'bg-gradient-to-br from-emerald-500/[0.09] via-slate-900/60 to-slate-900/80 border-emerald-500/25'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{ color: softHex }}
                >
                  <Feather className="w-3.5 h-3.5" />
                  {kelimeMi ? 'Günlük Kullanım & Araştırma Görevi' : '10-15 Dakikalık Eskiz Görevi'}
                </span>
              </div>
              <p className="text-sm sm:text-[15px] text-slate-100 leading-relaxed">
                {kart.gunluk_gorev}
              </p>
            </motion.div>

            {/* 6. Pratik İpucu */}
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06]"
            >
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryHex }} />
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                <strong className="text-slate-200 font-medium">İpucu: </strong>
                {kart.ipucu}
              </p>
            </motion.div>

            {/* 7. Tamamlandı Butonu (SVG Path Çizim Animasyonlu) */}
            <motion.div variants={itemVariants} className="pt-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: kart.tamamlandi ? 1 : 1.01 }}
                onClick={handleTamamlaClick}
                disabled={kart.tamamlandi}
                className={`w-full rounded-2xl py-3.5 px-6 font-semibold text-sm sm:text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  kart.tamamlandi
                    ? kelimeMi
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-glow-amber cursor-default'
                      : 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 shadow-glow-sage cursor-default'
                    : kelimeMi
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20'
                }`}
              >
                <span className="relative flex items-center justify-center w-5 h-5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5"
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
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </svg>
                </span>
                <span>
                  {kart.tamamlandi ? 'Bugün Tamamlandı ✓' : 'Tamamlandı Olarak İşaretle'}
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
};
