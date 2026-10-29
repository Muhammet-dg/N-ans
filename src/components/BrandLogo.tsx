import React from 'react';
import { motion } from 'framer-motion';
import { KartTuru } from '../types';

interface BrandLogoProps {
  aktifTur: KartTuru;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ aktifTur }) => {
  const renkler =
    aktifTur === 'KELIME'
      ? {
          ana: '#F59E0B',
          acik: '#FDE68A',
          golge: 'rgba(245, 158, 11, 0.35)',
          aci: 0
        }
      : aktifTur === 'CIZIM'
      ? {
          ana: '#10B981',
          acik: '#6EE7B7',
          golge: 'rgba(16, 185, 129, 0.35)',
          aci: 120
        }
      : {
          ana: '#38BDF8',
          acik: '#BAE6FD',
          golge: 'rgba(56, 189, 248, 0.35)',
          aci: 240
        };

  return (
    <motion.div
      whileHover={{ scale: 1.06, rotate: 4 }}
      whileTap={{ scale: 0.94 }}
      style={{
        boxShadow: `0 0 18px -2px ${renkler.golge}`
      }}
      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-900 via-[#0B101D] to-slate-950 border border-white/[0.14] flex items-center justify-center shrink-0 overflow-hidden transition-shadow duration-500"
    >
      {/* Arka Plan Nefes Alan Işık */}
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ backgroundColor: renkler.ana }}
        className="absolute w-5 h-5 rounded-full blur-md pointer-events-none"
      />

      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-7 h-7 sm:w-8 sm:h-8"
      >
        {/* Dış Usturlap Yörünge Halkası (Kategori değiştikçe döner) */}
        <motion.g
          animate={{ rotate: renkler.aci }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          style={{ originX: '32px', originY: '32px' }}
        >
          <circle
            cx="32"
            cy="32"
            r="25"
            stroke={renkler.acik}
            strokeOpacity="0.32"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <circle cx="32" cy="7" r="2" fill="#FDE68A" />
          <circle cx="11" cy="45" r="2" fill="#6EE7B7" />
          <circle cx="53" cy="45" r="2" fill="#38BDF8" />
        </motion.g>

        {/* Elmas Pergel Çerçevesi */}
        <path
          d="M32 10L50 32L32 54L14 32L32 10Z"
          stroke={renkler.ana}
          strokeOpacity="0.45"
          strokeWidth="1.2"
          fill="#0F172A"
          fillOpacity="0.5"
        />

        {/* Dolma Kalem Ucu & Mimari İğne (Sol & Sağ Kanat) */}
        <path
          d="M31.2 12L19.5 33.5L25 48H31.2V30.5C29 30.1 27.5 28.2 27.5 26C27.5 23.6 29.2 21.8 31.2 21.8V12Z"
          fill={renkler.acik}
        />
        <path
          d="M32.8 12V21.8C34.8 21.8 36.5 23.6 36.5 26C36.5 28.2 35 30.1 32.8 30.5V48H39L44.5 33.5L32.8 12Z"
          fill={renkler.ana}
        />

        {/* Alt Metalik Bilezik */}
        <rect x="24" y="50" width="16" height="2.5" rx="1.25" fill={renkler.acik} />

        {/* Merkezdeki Parlayan Kutup Yıldızı */}
        <path
          d="M32 22.5L33.2 25.3L36 26.5L33.2 27.7L32 30.5L30.8 27.7L28 26.5L30.8 25.3L32 22.5Z"
          fill="#FFFFFF"
        />
      </svg>
    </motion.div>
  );
};
