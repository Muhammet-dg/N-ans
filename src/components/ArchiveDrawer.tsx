import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Palette,
  Terminal,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { KartTuru, GunlukKart } from '../types';

interface ArchiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  gecmis: GunlukKart[];
}

export const ArchiveDrawer: React.FC<ArchiveDrawerProps> = ({
  isOpen,
  onClose,
  gecmis
}) => {
  const [filter, setFilter] = useState<'TUMU' | KartTuru>('TUMU');
  const [seciliKart, setSeciliKart] = useState<GunlukKart | null>(null);

  const filtrelenmisGecmis = gecmis.filter((item) =>
    filter === 'TUMU' ? true : item.tur === filter
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-t-3xl bg-slate-900/95 backdrop-blur-2xl border-t border-x border-white/[0.1] shadow-2xl overflow-hidden"
          >
            <div className="w-full pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-white/15" />
            </div>

            <div className="px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-white/[0.08]">
              <div>
                <h2 className="font-serif text-lg sm:text-2xl font-semibold text-slate-50">
                  Tamamlanan Kartlar Arşivi
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Toplam {gecmis.length} tamamlanan odak kartı
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                aria-label="Arşivi Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4'lü Filtre Sekmeleri */}
            <div className="px-4 sm:px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto border-b border-white/[0.06] bg-slate-950/40">
              <button
                onClick={() => setFilter('TUMU')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filter === 'TUMU'
                    ? 'bg-white/15 text-slate-100'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                Tümü ({gecmis.length})
              </button>
              <button
                onClick={() => setFilter('KELIME')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filter === 'KELIME'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Kelime
              </button>
              <button
                onClick={() => setFilter('CIZIM')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filter === 'CIZIM'
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                Çizim
              </button>
              <button
                onClick={() => setFilter('YAZILIM')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filter === 'YAZILIM'
                    ? 'bg-sky-500/20 text-sky-200 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                Yazılım
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
              {filtrelenmisGecmis.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm text-slate-400">
                    Bu kategoride henüz tamamlanmış bir odak kartı bulunmuyor.
                  </p>
                </div>
              ) : (
                filtrelenmisGecmis.map((item) => {
                  const acikMi = seciliKart?.id === item.id;
                  const renkSınıfı =
                    item.tur === 'KELIME'
                      ? 'bg-amber-500/15 text-amber-200'
                      : item.tur === 'CIZIM'
                      ? 'bg-emerald-500/15 text-emerald-200'
                      : 'bg-sky-500/15 text-sky-200';

                  const kategoriAd =
                    item.tur === 'KELIME'
                      ? 'KELİME'
                      : item.tur === 'CIZIM'
                      ? 'ÇİZİM'
                      : 'YAZILIM';

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      onClick={() => setSeciliKart(acikMi ? null : item)}
                      className="cursor-pointer rounded-2xl p-4 border transition-colors bg-slate-900/70 hover:bg-slate-900/95 border-white/[0.08]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${renkSınıfı}`}
                            >
                              {kategoriAd}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                              <Calendar className="w-3 h-3" />
                              {item.tarih}
                            </span>
                          </div>
                          <h3 className="font-serif text-base sm:text-lg font-semibold text-slate-100">
                            {item.baslik}
                          </h3>
                          <p className="text-xs text-slate-400">{item.alt_baslik}</p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${renkSınıfı}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Tamamlandı</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200/85 mt-2 leading-relaxed">
                        {item.ozet}
                      </p>

                      <AnimatePresence>
                        {acikMi && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pt-3.5 mt-3 border-t border-white/[0.07] space-y-2.5 text-xs sm:text-sm"
                          >
                            <p className="text-slate-300 leading-relaxed">{item.detay}</p>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <span className="text-[11px] uppercase tracking-wider font-semibold block mb-1 text-slate-200">
                                Günlük Görev
                              </span>
                              <p className="text-slate-100 leading-relaxed">{item.gunluk_gorev}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
