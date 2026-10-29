import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { PreferredMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  preferredMode: PreferredMode;
  onSaveApiKey: (key: string) => void;
  onChangePreferredMode: (mode: PreferredMode) => void;
  onRegenerateNow: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  preferredMode,
  onSaveApiKey,
  onChangePreferredMode,
  onRegenerateNow
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Arka Plan Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Gövdesi */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0F172A]/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[#F59E0B]">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#F8FAFC]">
                    Atelier Yapılandırması
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Gemini 1.5 Flash AI &amp; Günlük Ritüel Tercihleri
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                aria-label="Ayarları Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Günlük Odak Akışı Tercihi */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Günlük Kürasyon Dengesi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'KARMA', label: 'Dengeli Karma', desc: 'Bir gün kavram, bir gün eskiz' },
                      { id: 'KELIME', label: 'Sadece Kavram', desc: 'Felsefe, strateji & kelime' },
                      { id: 'CIZIM', label: 'Sadece Eskiz', desc: 'Kağıt & kalem mikro teknik' }
                    ] as const
                  ).map((option) => {
                    const active = preferredMode === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onChangePreferredMode(option.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          active
                            ? 'bg-amber-500/15 border-amber-500/40 text-[#F8FAFC]'
                            : 'bg-slate-900/60 border-white/[0.07] text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        <div className="text-xs font-semibold">{option.label}</div>
                        <div className="text-[10px] opacity-75 mt-0.5 leading-snug">
                          {option.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Google Gemini API Anahtarı */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="gemini-api-key"
                    className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Google Gemini API Anahtarı</span>
                  </label>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      inputKey.trim()
                        ? 'bg-emerald-500/15 text-[#6EE7B7]'
                        : 'bg-white/[0.06] text-[#94A3B8]'
                    }`}
                  >
                    {inputKey.trim() ? 'AI Kürasyonu Hazır' : 'Yerel Koleksiyon Modu'}
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="gemini-api-key"
                    type={showKey ? 'text' : 'password'}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="AIzaSy... (Boş bırakılırsa 11 seçkin yerel kart kullanılır)"
                    className="w-full rounded-2xl bg-slate-950/90 border border-white/[0.1] focus:border-[#F59E0B]/60 px-4 py-3 pr-11 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/45 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#94A3B8] hover:text-[#F8FAFC]"
                    aria-label="API Anahtarını Göster/Gizle"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-start gap-2 text-[11px] text-[#94A3B8] leading-relaxed pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>
                    API anahtarınız hiçbir sunucuya gönderilmez; yalnızca tarayıcınızın{' '}
                    <code className="text-[#F8FAFC]">localStorage</code> hafızasında saklanır ve doğrudan{' '}
                    <code className="text-[#F8FAFC]">gemini-1.5-flash</code> servisiyle iletişim kurar.
                  </span>
                </div>
              </div>

              {/* Kaydet & Yeni Kart Üret Aksiyonları */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  {savedToast ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ayarlar Kaydedildi</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Kaydet</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSaveApiKey(inputKey);
                    onRegenerateNow();
                    onClose();
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-[#F8FAFC] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#6EE7B7]" />
                  <span>Şimdi Yeni Kart Üret</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

