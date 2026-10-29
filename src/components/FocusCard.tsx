import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  AnimatePresence
} from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  PenTool,
  Lightbulb,
  Compass,
  RefreshCw,
  Sparkles,
  Feather,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CardType, DailyCard } from '../types';

interface FocusCardProps {
  card: DailyCard;
  isLoading: boolean;
  onComplete: (note?: string) => void;
  onUpdateNote: (note: string) => void;
  onSwitchOrRefresh: (forceType?: CardType) => void;
}

export const FocusCard: React.FC<FocusCardProps> = ({
  card,
  isLoading,
  onComplete,
  onUpdateNote,
  onSwitchOrRefresh
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pulseWave, setPulseWave] = useState(false);
  const [showNotePanel, setShowNotePanel] = useState(Boolean(card.kullaniciNotu));
  const [noteDraft, setNoteDraft] = useState(card.kullaniciNotu || '');

  // Kart değiştiğinde not taslağını senkronize et
  React.useEffect(() => {
    setNoteDraft(card.kullaniciNotu || '');
    setShowNotePanel(Boolean(card.kullaniciNotu));
  }, [card.id, card.kullaniciNotu]);

  const isWord = card.tur === 'KELIME';

  // 3D Tilt & İmleç Takip Eden Radial Glow (Framer Motion Spring Physics)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(30);
  const isHovering = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5.5, -5.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5.5, 5.5]), springConfig);
  const smoothGlowX = useSpring(glowX, { stiffness: 180, damping: 25 });
  const smoothGlowY = useSpring(glowY, { stiffness: 180, damping: 25 });
  const glowOpacity = useSpring(isHovering, { stiffness: 200, damping: 25 });

  const accentRgb = isWord ? '245, 158, 11' : '16, 185, 129';
  const softHex = isWord ? '#FDE68A' : '#6EE7B7';
  const primaryHex = isWord ? '#F59E0B' : '#10B981';

  const radialSpotlight = useMotionTemplate`radial-gradient(520px circle at ${smoothGlowX}% ${smoothGlowY}%, rgba(${accentRgb}, 0.14), transparent 70%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
    glowX.set((clientX / width) * 100);
    glowY.set((clientY / height) * 100);
    isHovering.set(1);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    isHovering.set(0);
  };

  const triggerMicroCelebration = () => {
    setPulseWave(true);
    setTimeout(() => setPulseWave(false), 1400);

    // Göz yormayan, zarif mikro-parçacık patlaması
    try {
      confetti({
        particleCount: 36,
        spread: 62,
        origin: { y: 0.78 },
        colors: isWord
          ? ['#F59E0B', '#FDE68A', '#FFFBEB', '#D97706']
          : ['#10B981', '#6EE7B7', '#ECFDF5', '#059669'],
        disableForReducedMotion: true,
        scalar: 0.85,
        ticks: 160,
        gravity: 0.95
      });
    } catch {
      // Canvas-confetti desteklenmeyen ortamlarda sessizce devam et
    }
  };

  const handleCompleteClick = () => {
    if (!card.tamamlandi) {
      triggerMicroCelebration();
      onComplete(noteDraft);
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto px-4 sm:px-6 my-auto py-3"
      style={{ perspective: '1000px' }}
    >
      {/* Üst Odak Seçici Çubuk */}
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div className="inline-flex items-center p-1 rounded-full bg-slate-900/70 border border-white/[0.07] backdrop-blur-md">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => isWord || onSwitchOrRefresh('KELIME')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              isWord
                ? 'bg-amber-500/15 text-[#FDE68A] border border-amber-500/30 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Entelektüel Kavram</span>
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => !isWord || onSwitchOrRefresh('CIZIM')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              !isWord
                ? 'bg-emerald-500/15 text-[#6EE7B7] border border-emerald-500/30 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Eskiz &amp; Çizim</span>
          </button>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => onSwitchOrRefresh(card.tur)}
          title="Farklı bir odak kartı çek"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs text-[#94A3B8] hover:text-[#F8FAFC] bg-slate-900/50 hover:bg-slate-800/70 border border-white/[0.06] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span className="hidden sm:inline">Başka Kart</span>
        </button>
      </div>

      {/* Ana 3D Odak Kartı */}
      <AnimatePresence mode="wait">
        <motion.article
          key={card.id}
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d'
          }}
          className={`relative overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-xl border shadow-2xl transition-colors duration-500 ${
            pulseWave
              ? isWord
                ? 'border-[#F59E0B] shadow-[0_0_50px_-5px_rgba(245,158,11,0.55)]'
                : 'border-[#10B981] shadow-[0_0_50px_-5px_rgba(16,185,129,0.55)]'
              : card.tamamlandi
              ? isWord
                ? 'border-amber-500/35 shadow-glow-amber'
                : 'border-emerald-500/35 shadow-glow-sage'
              : 'border-white/[0.08] shadow-glass'
          }`}
        >
          {/* İmleci takip eden yumuşak radial ışık süzmesi */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              background: radialSpotlight,
              opacity: glowOpacity
            }}
          />

          {/* Üst Dekoratif İnce Vurgu Çizgisi */}
          <div
            className="h-[2px] w-full transition-colors duration-700"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${primaryHex} 50%, transparent 100%)`
            }}
          />

          {/* Tamamlanma Darbe Dalgası (Pulse Glow Overlay) */}
          <AnimatePresence>
            {pulseWave && (
              <motion.div
                initial={{ opacity: 0.55, scale: 0.96 }}
                animate={{ opacity: 0, scale: 1.06 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-0 rounded-3xl z-10"
                style={{
                  boxShadow: `inset 0 0 45px ${primaryHex}`
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 p-6 sm:p-9 space-y-6">
            {/* Kategori Etiketi & Kaynak */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${
                  isWord
                    ? 'bg-amber-500/10 text-[#FDE68A] border-amber-500/25'
                    : 'bg-emerald-500/10 text-[#6EE7B7] border-emerald-500/25'
                }`}
              >
                {isWord ? (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Günün Kavramı</span>
                  </>
                ) : (
                  <>
                    <PenTool className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Günün Eskiz Ritüeli</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8] px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                  <Sparkles className="w-3 h-3 opacity-75" style={{ color: softHex }} />
                  {card.kaynak === 'AI' ? 'Gemini Kürasyonu' : 'Atelier Koleksiyonu'}
                </span>
              </div>
            </div>

            {/* Başlık & Alt Başlık */}
            <div className="space-y-2">
              <p
                className="text-xs sm:text-sm font-medium tracking-wide uppercase"
                style={{ color: softHex }}
              >
                {card.alt_baslik}
              </p>
              <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[#F8FAFC] tracking-tight leading-tight">
                {card.baslik}
              </h1>
            </div>

            {/* Vurucu Özet (Editorial Quote Box) */}
            <div
              className={`relative pl-4 sm:pl-5 py-1 border-l-2 ${
                isWord ? 'border-[#F59E0B]/70' : 'border-[#10B981]/70'
              }`}
            >
              <p className="text-base sm:text-[17px] text-[#F8FAFC]/95 font-medium leading-relaxed">
                {card.ozet}
              </p>
            </div>

            {/* Derinlik / Felsefe / Teknik Püf Noktası */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">
                <Compass className="w-3.5 h-3.5" style={{ color: primaryHex }} />
                <span>{isWord ? 'Felsefi & Bilişsel Derinlik' : 'Tekniğin Anatomisi'}</span>
              </div>
              <p className="text-sm sm:text-[15px] text-[#94A3B8] leading-relaxed font-normal">
                {card.detay}
              </p>
            </div>

            {/* Günlük Somut Görev Kutusu */}
            <div
              className={`rounded-2xl p-4 sm:p-5 border transition-colors ${
                isWord
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
                  {isWord ? 'Bugünün Uygulama Görevi' : '10-15 Dakikalık Kağıt & Kalem Görevi'}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-medium">
                  {isWord ? 'Zihinsel Pratik' : 'Kurşun Kalem'}
                </span>
              </div>
              <p className="text-sm sm:text-[15px] text-[#F8FAFC] leading-relaxed">
                {card.gunluk_gorev}
              </p>
            </div>

            {/* Pratik İpucu */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <Lightbulb
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: primaryHex }}
              />
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                <strong className="text-[#F8FAFC] font-medium">Atelier İpucu: </strong>
                {card.ipucu}
              </p>
            </div>

            {/* Kişisel Tefekkür / Eskiz Gözlem Notu (İsteğe Bağlı) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowNotePanel((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                {showNotePanel ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {card.kullaniciNotu
                    ? 'Kişisel Notun (Düzenle)'
                    : isWord
                    ? '+ Kurduğun cümleyi veya düşünceni not düş'
                    : '+ Eskiz gözlemini not düş'}
                </span>
              </button>

              <AnimatePresence>
                {showNotePanel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <textarea
                      rows={2}
                      value={noteDraft}
                      onChange={(e) => {
                        setNoteDraft(e.target.value);
                        onUpdateNote(e.target.value);
                      }}
                      placeholder={
                        isWord
                          ? 'Bu kavramı bugün nasıl kullandığını veya sende uyandırdığı çağrışımı yaz...'
                          : 'Çizim sırasında fark ettiğin ışık, oran veya el-göz deneyimini kısaca kaydet...'
                      }
                      className="mt-2.5 w-full rounded-xl bg-slate-950/70 border border-white/[0.08] focus:border-white/25 px-3.5 py-2.5 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none leading-relaxed resize-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Aksiyon: "Bugün Tamamlandı" Mikro-Etkileşimli Buton */}
            <div className="pt-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: card.tamamlandi ? 1.0 : 1.01 }}
                onClick={handleCompleteClick}
                className={`w-full relative overflow-hidden rounded-2xl py-3.5 px-6 font-semibold text-sm sm:text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-3 ${
                  card.tamamlandi
                    ? isWord
                      ? 'bg-amber-500/20 text-[#FDE68A] border border-amber-400/40 shadow-glow-amber cursor-default'
                      : 'bg-emerald-500/20 text-[#6EE7B7] border border-emerald-400/40 shadow-glow-sage cursor-default'
                    : isWord
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20'
                    : 'bg-gradient-to-r from-[#10B981] to-[#059669] text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20'
                }`}
              >
                {/* SVG Path Çizim Animasyonlu İkon */}
                <span className="relative flex items-center justify-center w-5 h-5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      className="opacity-30"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <motion.path
                      d="M8 12.5L10.8 15.3L16.2 9.5"
                      initial={false}
                      animate={{
                        pathLength: card.tamamlandi ? 1 : 0,
                        opacity: card.tamamlandi ? 1 : 0
                      }}
                      transition={{
                        duration: 0.55,
                        ease: 'easeOut'
                      }}
                    />
                  </svg>
                </span>

                <span>
                  {card.tamamlandi
                    ? 'Bugünün Odak Ritüeli Tamamlandı'
                    : 'Bugün Tamamlandı Olarak İşaretle'}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
};

