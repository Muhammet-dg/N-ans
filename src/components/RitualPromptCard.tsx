import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Palette, Terminal, Sparkles } from 'lucide-react';
import { KartTuru } from '../types';

interface RitualPromptCardProps {
  aktifTur: KartTuru;
  yukleniyor: boolean;
  onKartiAc: () => void;
}

export const RitualPromptCard: React.FC<RitualPromptCardProps> = ({
  aktifTur,
  yukleniyor,
  onKartiAc
}) => {
  const içerik =
    aktifTur === 'KELIME'
      ? {
          ustEtiket: 'Bölüm I • Entelektüel Dağarcık',
          baslik: 'Günün Kavramını Keşfetmeye Hazır mısın?',
          aciklama:
            'Az bilinen derin bir Türkçe kelime veya felsefe, strateji ve bilişsel modeller dünyasından ufuk açıcı bir kavram seni bekliyor.',
          butonMetni: 'Günün Kelimesini Aç',
          yukleniyorMetni: 'Kavram Kürasyonu Açılıyor...',
          primaryHex: '#F59E0B',
          softHex: '#FDE68A',
          glowRgba: 'rgba(245, 158, 11, 0.28)',
          btnClass:
            'from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-[0_10px_35px_-5px_rgba(245,158,11,0.45)]',
          badgeClass: 'bg-amber-500/10 text-amber-200 border-amber-500/25',
          Icon: BookOpen
        }
      : aktifTur === 'CIZIM'
      ? {
          ustEtiket: 'Bölüm II • Kağıt & Kurşun Kalem',
          baslik: 'Günün Eskiz Ritüeline Başla',
          aciklama:
            'Sadece kağıt ve kurşun kalemle 10-15 dakikada tamamlayabileceğin mikro bir çizim tekniği ve göz-el koordinasyonu egzersizi.',
          butonMetni: 'Çizim Görevini Aç',
          yukleniyorMetni: 'Eskiz Tekniği Hazırlanıyor...',
          primaryHex: '#10B981',
          softHex: '#6EE7B7',
          glowRgba: 'rgba(16, 185, 129, 0.28)',
          btnClass:
            'from-emerald-400 via-emerald-500 to-emerald-600 text-slate-950 shadow-[0_10px_35px_-5px_rgba(16,185,129,0.45)]',
          badgeClass: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25',
          Icon: Palette
        }
      : {
          ustEtiket: 'Bölüm III • Bilgisayar Mühendisliği & Mimari',
          baslik: '15 Dakikalık Mühendislik Odağı',
          aciklama:
            'Yazılım mimarisi, veri yapıları, dağıtık sistemler veya işletim sistemlerinden 15 dakikada özümseyebileceğin çekirdek bir kavram.',
          butonMetni: 'Yazılım Konusunu Aç',
          yukleniyorMetni: 'Mühendislik Konusu Derleniyor...',
          primaryHex: '#38BDF8',
          softHex: '#BAE6FD',
          glowRgba: 'rgba(56, 189, 248, 0.28)',
          btnClass:
            'from-sky-400 via-sky-500 to-indigo-500 text-slate-950 shadow-[0_10px_35px_-5px_rgba(56,189,248,0.45)]',
          badgeClass: 'bg-sky-500/10 text-sky-200 border-sky-500/25',
          Icon: Terminal
        };

  const Icon = içerik.Icon;

  return (
    <div className="w-full max-w-xl mx-auto px-3.5 sm:px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={aktifTur}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="relative overflow-hidden rounded-3xl bg-slate-900/75 backdrop-blur-2xl border border-white/[0.09] shadow-2xl p-6 sm:p-10 text-center flex flex-col items-center"
        >
          {/* Üst İnce Işık Çizgisi */}
          <div
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${içerik.primaryHex} 50%, transparent 100%)`
            }}
          />

          {/* Üst Bölüm Rozeti */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase border mb-6 ${içerik.badgeClass}`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{içerik.ustEtiket}</span>
          </span>

          {/* Merkezdeki Animasyonlu Geometrik Mühür / Portal */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center my-2">
            {/* Arka Plan Nefes Alan Hale */}
            <motion.div
              animate={
                yukleniyor
                  ? { scale: [1, 1.45, 0.95, 1.3], opacity: [0.35, 0.7, 0.4, 0.65] }
                  : { scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }
              }
              transition={{
                duration: yukleniyor ? 1.1 : 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{ backgroundColor: içerik.primaryHex }}
              className="absolute w-20 h-20 rounded-full blur-2xl pointer-events-none"
            />

            {/* Dış Dönen Yörünge Çemberi */}
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{
                duration: yukleniyor ? 2.2 : 22,
                repeat: Infinity,
                ease: 'linear'
              }}
              viewBox="0 0 140 140"
              className="absolute inset-0 w-full h-full"
            >
              <circle
                cx="70"
                cy="70"
                r="62"
                fill="none"
                stroke={içerik.softHex}
                strokeOpacity="0.22"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              <circle cx="70" cy="8" r="3" fill={içerik.primaryHex} />
              <circle cx="70" cy="132" r="2.5" fill={içerik.softHex} fillOpacity="0.6" />
            </motion.svg>

            {/* İç Ters Yönde Dönen Geometrik Kare/Elmas */}
            <motion.svg
              animate={{
                rotate: -360,
                scale: yukleniyor ? [1, 0.86, 1.08, 1] : 1
              }}
              transition={{
                rotate: {
                  duration: yukleniyor ? 1.8 : 16,
                  repeat: Infinity,
                  ease: 'linear'
                },
                scale: {
                  duration: 0.9,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
              viewBox="0 0 140 140"
              className="absolute inset-0 w-full h-full"
            >
              <rect
                x="35"
                y="35"
                width="70"
                height="70"
                rx="14"
                fill="none"
                stroke={içerik.primaryHex}
                strokeOpacity="0.35"
                strokeWidth="1.2"
              />
            </motion.svg>

            {/* Merkez Mühür Butonu */}
            <motion.button
              type="button"
              disabled={yukleniyor}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={onKartiAc}
              style={{
                boxShadow: `0 0 30px ${içerik.glowRgba}`
              }}
              className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-slate-950/90 border border-white/[0.15] flex items-center justify-center cursor-pointer transition-transform"
              aria-label={içerik.butonMetni}
            >
              <motion.div
                animate={
                  yukleniyor
                    ? { rotate: [0, 180, 360], scale: [1, 1.2, 1] }
                    : { y: [0, -2, 0] }
                }
                transition={{
                  duration: yukleniyor ? 1 : 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Icon className="w-7 h-7" style={{ color: içerik.softHex }} />
              </motion.div>
            </motion.button>
          </div>

          {/* Başlık & Açıklama */}
          <div className="space-y-2.5 mt-5 max-w-md">
            <h1 className="font-serif text-xl sm:text-3xl font-semibold text-slate-50 leading-snug">
              {içerik.baslik}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {içerik.aciklama}
            </p>
          </div>

          {/* Ana Çağrı Butonu */}
          <div className="w-full max-w-xs mt-7">
            <motion.button
              type="button"
              disabled={yukleniyor}
              whileHover={{ scale: yukleniyor ? 1 : 1.03, y: yukleniyor ? 0 : -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={onKartiAc}
              className={`w-full min-h-[46px] rounded-2xl py-3.5 px-6 font-semibold text-xs sm:text-sm tracking-wide bg-gradient-to-r ${içerik.btnClass} flex items-center justify-center gap-2.5 cursor-pointer transition-all disabled:opacity-75`}
            >
              <Sparkles className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
              <span>{yukleniyor ? içerik.yukleniyorMetni : içerik.butonMetni}</span>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
