import React from 'react';
import { motion } from 'framer-motion';
import { KartTuru } from '../types';

interface BrandLogoProps {
  aktifTur: KartTuru;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ aktifTur }) => {
  const vurguRenk =
    aktifTur === 'KELIME'
      ? '#F59E0B'
      : aktifTur === 'CIZIM'
      ? '#10B981'
      : '#38BDF8';

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0D121C] border border-white/[0.12] flex items-center justify-center shrink-0 shadow-sm"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 sm:w-7 sm:h-7"
      >
        {/* Editorial Minimalist "N" Monogramı */}
        <path
          d="M14 18H21.5V20H19V44H22.5V46H13V44H16.2V20H14V18Z"
          fill="#F8FAFC"
        />
        <path
          d="M36.5 18H45.5V20H42.2V46H39.5V20H36.5V18Z"
          fill="#F8FAFC"
        />
        <path
          d="M16.8 18H21.8L42.2 46H37.2L16.8 18Z"
          fill="#F8FAFC"
        />

        {/* "N°" — Kategoriye Göre Renk Değiştiren Minimal Nüans Halkası */}
        <motion.circle
          cx="49.5"
          cy="17.5"
          r="3.6"
          initial={false}
          animate={{
            stroke: vurguRenk,
            scale: [1, 1.18, 1]
          }}
          transition={{ duration: 0.35 }}
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  );
};
