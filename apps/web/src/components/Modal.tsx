'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LanguageSelector from './LanguageSelector';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-b from-northern-midnight to-dark-900 border-aurora-blue/30 text-white">
        <DialogHeader className="sticky top-0 z-10 flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-700/50">
          <div className="flex-1">
            <DialogTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-gray-400 mt-2">
                {description}
              </DialogDescription>
            )}
          </div>
          <LanguageSelector />
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-1 py-4 custom-scrollbar">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
