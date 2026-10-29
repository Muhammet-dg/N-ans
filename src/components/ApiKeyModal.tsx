import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, Eye, EyeOff, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { getActiveApiKey, saveCustomApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavedAndRefresh: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSavedAndRefresh
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [kaydedildi, setKaydedildi] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getActiveApiKey());
      setKaydedildi(false);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomApiKey(keyInput);
    setKaydedildi(true);
    setTimeout(() => {
      onSavedAndRefresh();
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="relative z-10 w-full max-w-md rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold text-slate-50">
                    Mobil &amp; AI Bağlantısı
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Gemini API Anahtarı &amp; Çevrimdışı Koleksiyon
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="mobile-gemini-key"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Gemini API Anahtarı (İsteğe Bağlı)
                  </label>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      keyInput.trim()
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-200 border border-amber-500/30'
                    }`}
                  >
                    {keyInput.trim() ? 'Gemini AI Aktif' : 'Yerel Koleksiyon Aktif'}
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="mobile-gemini-key"
                    type={showKey ? 'text' : 'password'}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="AIzaSy... (Boş bırakılırsa 22 seçkin yerel kart çalışır)"
                    className="w-full rounded-2xl bg-slate-950/90 border border-white/[0.1] focus:border-amber-500/60 px-3.5 py-3 pr-10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Anahtar girmeseniz bile uygulama 22 küratörlü kavram ve çizim kartıyla <strong>%100 çevrimdışı</strong> çalışır. Anahtar girerseniz yalnızca telefonunuzun hafızasına kaydedilir.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform"
              >
                {kaydedildi ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Kaydedildi &amp; Yenileniyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Kaydet ve Kartı Güncelle</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

