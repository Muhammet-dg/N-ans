import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KartTuru } from '../types';

interface AmbientBackgroundProps {
  aktifTur?: KartTuru;
  tamamlandiMi?: boolean;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  aktifTur = 'KELIME',
  tamamlandiMi = false
}) => {
  // Sabit tohumlu mikro ışık zerreleri
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 94}%`,
        top: `${(i * 23 + 11) % 90}%`,
        size: (i % 3) + 2,
        duration: 9 + (i % 6) * 2.5,
        delay: (i % 5) * 0.8
      })),
    []
  );

  const birincilGradyan =
    aktifTur === 'KELIME'
      ? 'radial-gradient(circle, rgba(245,158,11,0.52) 0%, rgba(217,119,6,0.14) 45%, rgba(15,23,42,0) 72%)'
      : aktifTur === 'CIZIM'
      ? 'radial-gradient(circle, rgba(16,185,129,0.52) 0%, rgba(5,150,105,0.14) 45%, rgba(15,23,42,0) 72%)'
      : 'radial-gradient(circle, rgba(56,189,248,0.52) 0%, rgba(99,102,241,0.16) 45%, rgba(15,23,42,0) 72%)';

  const ikincilGradyan =
    aktifTur === 'KELIME'
      ? 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)'
      : aktifTur === 'CIZIM'
      ? 'radial-gradient(circle, rgba(56,189,248,0.14) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 70%)';

  const zerreRenk =
    aktifTur === 'KELIME'
      ? '#FDE68A'
      : aktifTur === 'CIZIM'
      ? '#6EE7B7'
      : '#BAE6FD';

  const zerreGolge =
    aktifTur === 'KELIME'
      ? '0 0 12px rgba(253, 230, 138, 0.6)'
      : aktifTur === 'CIZIM'
      ? '0 0 12px rgba(110, 231, 183, 0.6)'
      : '0 0 12px rgba(186, 230, 253, 0.65)';

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#070A10]">
      {/* Derin Gece Gradyanı */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/90 via-[#0A0D14] to-[#05070B]" />

      {/* Nefes Alan Birincil Aurora Küresi */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: tamamlandiMi ? [0.22, 0.32, 0.22] : [0.15, 0.23, 0.15],
          x: ['-50%', '-46%', '-50%'],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ background: birincilGradyan }}
        className="absolute -top-40 left-1/2 w-[680px] h-[680px] rounded-full blur-3xl transition-all duration-700"
      />

      {/* İkincil Karşıt Ambiyans Küresi */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          x: [0, -30, 0],
          y: [0, -25, 0]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ background: ikincilGradyan }}
        className="absolute -bottom-48 -right-24 w-[540px] h-[540px] rounded-full blur-3xl transition-all duration-700"
      />

      {/* İnce Mimari Izgara Dokusu */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Süzülen Işık Zerreleri */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0.1, y: 0 }}
          animate={{
            opacity: [0.1, 0.55, 0.1],
            y: [0, -36, 0],
            x: [0, p.id % 2 === 0 ? 12 : -12, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: zerreRenk,
            boxShadow: zerreGolge
          }}
          className="absolute rounded-full transition-colors duration-500"
        />
      ))}
    </div>
  );
};
