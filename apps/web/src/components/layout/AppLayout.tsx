'use client';

import { ReactNode, useState } from 'react';
import YKBuddySeasonalBanner from '@/components/YKBuddySeasonalBanner';
import InteractiveMenu from '@/components/InteractiveMenu';
import LanguageSelector from '@/components/LanguageSelector';
import Modal from '@/components/Modal';
import AboutContent from '@/components/AboutContent';
import ContactContent from '@/components/ContactContent';
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showBanner?: boolean;
  showMenu?: boolean;
  className?: string;
}

export default function AppLayout({
  children,
  breadcrumbs,
  showBanner = true,
  showMenu = true,
  className = '',
}: AppLayoutProps) {
  const { t } = useLanguage();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 ${className}`}>
      {/* Language Selector - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      {/* Seasonal Banner */}
      {showBanner && <YKBuddySeasonalBanner />}

      {/* Navigation Menu */}
      {showMenu && (
        <InteractiveMenu
          onAboutClick={() => setShowAboutModal(true)}
          onContactClick={() => setShowContactModal(true)}
        />
      )}

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} />
          )}

          {/* Page Content */}
          {children}

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-700/30">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                {t('footer')}
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* About Modal */}
      <Modal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="About YK Buddy"
      >
        <AboutContent />
      </Modal>

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Us"
      >
        <ContactContent />
      </Modal>
    </div>
  );
}
