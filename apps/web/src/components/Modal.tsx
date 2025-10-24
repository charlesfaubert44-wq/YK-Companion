'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-northern-midnight to-dark-900 rounded-2xl shadow-2xl border border-aurora-blue/30 overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-northern-midnight/95 backdrop-blur-sm border-b border-gray-700/50">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
            {title}
          </h1>

          <div className="flex items-center gap-4">
            <LanguageSelector />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50 hover:bg-aurora-blue/20 border border-gray-700/50 hover:border-aurora-blue/50 transition-all group"
              aria-label="Close"
            >
              <span className="text-gray-400 group-hover:text-aurora-blue text-2xl leading-none">×</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
