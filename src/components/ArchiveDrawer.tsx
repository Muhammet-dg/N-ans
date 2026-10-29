import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, PenTool, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { CardType, DailyCard } from '../types';

interface ArchiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  archive: DailyCard[];
}

export const ArchiveDrawer: React.FC<ArchiveDrawerProps> = ({
  isOpen,
  onClose,
  archive
}) => {
  const [filter, setFilter] = useState<'TUMU' | CardType>('TUMU');
  const [selectedCard, setSelectedCard] = useState<DailyCard | null>(null);

  const filteredArchive = archive.filter((item) =>
    filter === 'TUMU' ? true : item.tur === filter
  );

  const completedCount = archive.filter((c) => c.tamamlandi).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Karartma Arka Plan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Alttan Yukarı Açılan Çekmece (damping: 30, stiffness: 300) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="relative z-10 w-full max-w-2xl max-h-[86vh] flex flex-col rounded-t-3xl bg-[#0F172A]/95 backdrop-blur-2xl border-t border-x border-white/[0.1] shadow-2xl overflow-hidden"
          >
            {/* Tutamaç Çizgisi */}
            <div className="w-full pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-white/15" />
            </div>

            {/* Çekmece Üst Başlık */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.08]">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#F8FAFC]">
                  Atelier Hafıza &amp; Arşiv
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Toplam {archive.length} kayıt • {completedCount} tamamlanan ritüel
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                aria-label="Arşivi Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filtre Sekmeleri */}
            <div className="px-6 py-3 flex items-center gap-2 border-b border-white/[0.06] bg-slate-950/40">
              <button
                onClick={() => setFilter('TUMU')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === 'TUMU'
                    ? 'bg-white/15 text-[#F8FAFC]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Tümü ({archive.length})
              </button>
              <button
                onClick={() => setFilter('KELIME')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === 'KELIME'
                    ? 'bg-amber-500/20 text-[#FDE68A] border border-amber-500/30'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#F59E0B]" />
                Kavramlar
              </button>
              <button
                onClick={() => setFilter('CIZIM')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === 'CIZIM'
                    ? 'bg-emerald-500/20 text-[#6EE7B7] border border-emerald-500/30'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-[#10B981]" />
                Eskizler
              </button>
            </div>

            {/* İçerik Listesi */}
            <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
              {filteredArchive.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Sparkles className="w-8 h-8 text-[#94A3B8]/50 mx-auto" />
                  <p className="text-sm text-[#94A3B8]">
                    Bu kategoride henüz arşivlenmiş bir odak kartı bulunmuyor.
                  </p>
                  <p className="text-xs text-[#94A3B8]/70 max-w-xs mx-auto">
                    Günün kartını tamamladığında veya yeni bir güne geçtiğinde tüm kartların burada birikir.
                  </p>
                </div>
              ) : (
                filteredArchive.map((item) => {
                  const isWord = item.tur === 'KELIME';
                  const isExpanded = selectedCard?.id === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      onClick={() => setSelectedCard(isExpanded ? null : item)}
                      className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-colors ${
                        isWord
                          ? 'bg-slate-900/70 hover:bg-slate-900/95 border-white/[0.07] hover:border-amber-500/30'
                          : 'bg-slate-900/70 hover:bg-slate-900/95 border-white/[0.07] hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                isWord
                                  ? 'bg-amber-500/15 text-[#FDE68A]'
                                  : 'bg-emerald-500/15 text-[#6EE7B7]'
                              }`}
                            >
                              {isWord ? 'Kavram' : 'Eskiz'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
                              <Calendar className="w-3 h-3" />
                              {item.tarih}
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-semibold text-[#F8FAFC]">
                            {item.baslik}
                          </h3>
                          <p className="text-xs text-[#94A3B8]">{item.alt_baslik}</p>
                        </div>

                        {item.tamamlandi && (
                          <span
                            title="Tamamlandı"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                              isWord
                                ? 'bg-amber-500/15 text-[#FDE68A]'
                                : 'bg-emerald-500/15 text-[#6EE7B7]'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Tamamlandı</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-[#F8FAFC]/85 mt-2.5 leading-relaxed">
                        {item.ozet}
                      </p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pt-4 mt-3 border-t border-white/[0.07] space-y-3 text-xs sm:text-sm"
                          >
                            <div>
                              <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold block mb-1">
                                Derinlik &amp; Detay
                              </span>
                              <p className="text-[#94A3B8] leading-relaxed">{item.detay}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <span
                                className="text-[11px] uppercase tracking-wider font-semibold block mb-1"
                                style={{ color: isWord ? '#FDE68A' : '#6EE7B7' }}
                              >
                                Günlük Görev
                              </span>
                              <p className="text-[#F8FAFC] leading-relaxed">{item.gunluk_gorev}</p>
                            </div>
                            {item.kullaniciNotu && (
                              <div className="p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20">
                                <span className="text-[11px] uppercase tracking-wider text-[#FDE68A] font-semibold block mb-1">
                                  Kişisel Notun
                                </span>
                                <p className="text-[#F8FAFC]/90 italic leading-relaxed">
                                  “{item.kullaniciNotu}”
                                </p>
                              </div>
                            )}
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

