'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FABAction {
  icon: string;
  label: string;
  onClick: () => void;
  primary?: boolean;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export default function FloatingActionButton({
  actions: customActions,
  position = 'bottom-right',
}: FloatingActionButtonProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [contextActions, setContextActions] = useState<FABAction[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Determine context-based actions
  useEffect(() => {
    const actions: FABAction[] = [];

    if (pathname === '/aurora' || pathname === '/aurora-live') {
      actions.push(
        {
          icon: '🔔',
          label: 'Set Alert',
          onClick: () => {
            console.log('Setting aurora alert');
            // TODO: Implement alert functionality
          },
        },
        {
          icon: '📸',
          label: 'Upload Photo',
          onClick: () => {
            console.log('Uploading aurora photo');
            // TODO: Implement photo upload
          },
        },
        {
          icon: '📤',
          label: 'Share Forecast',
          onClick: () => {
            if (navigator.share) {
              navigator.share({
                title: 'Aurora Forecast - YK Buddy',
                text: 'Check out the aurora forecast for Yellowknife!',
                url: window.location.href,
              });
            }
          },
          primary: true,
        }
      );
    } else if (pathname === '/living/garage-sales') {
      actions.push(
        {
          icon: '🗺️',
          label: 'View Map',
          onClick: () => {
            const mapSection = document.getElementById('garage-sale-map');
            mapSection?.scrollIntoView({ behavior: 'smooth' });
          },
        },
        {
          icon: '🚗',
          label: 'Plan Route',
          onClick: () => {
            console.log('Planning garage sale route');
            // TODO: Implement route planning
          },
          primary: true,
        },
        {
          icon: '➕',
          label: 'Add Sale',
          onClick: () => {
            console.log('Adding new garage sale');
            // TODO: Implement add sale form
          },
        }
      );
    } else if (pathname === '/visiting' || pathname === '/living' || pathname === '/moving') {
      actions.push(
        {
          icon: '💾',
          label: 'Save for Later',
          onClick: () => {
            console.log('Saving page');
            // TODO: Implement save functionality
          },
        },
        {
          icon: '📤',
          label: 'Share',
          onClick: () => {
            if (navigator.share) {
              navigator.share({
                title: 'YK Buddy',
                text: 'Check out this Yellowknife guide!',
                url: window.location.href,
              });
            }
          },
          primary: true,
        }
      );
    } else {
      // Default actions for other pages
      actions.push({
        icon: '📤',
        label: 'Share',
        onClick: () => {
          if (navigator.share) {
            navigator.share({
              title: 'YK Buddy - Your Yellowknife Companion',
              text: 'Because Nobody Should Face -40° Alone',
              url: window.location.href,
            });
          }
        },
        primary: true,
      });
    }

    setContextActions(customActions || actions);
  }, [pathname, customActions]);

  if (contextActions.length === 0) {
    return null;
  }

  const primaryAction = contextActions.find((action) => action.primary) || contextActions[0];
  const secondaryActions = contextActions.filter((action) => !action.primary);

  const positionClasses = {
    'bottom-right': 'bottom-20 right-6',
    'bottom-left': 'bottom-20 left-6',
    'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={cn(
        'fixed z-40 transition-all duration-300',
        positionClasses[position],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      )}
    >
      {/* Secondary actions (shown when expanded) */}
      {isExpanded && secondaryActions.length > 0 && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-3 animate-slide-up">
          {secondaryActions.map((action, index) => (
            <Button
              key={index}
              onClick={() => {
                action.onClick();
                setIsExpanded(false);
              }}
              variant="secondary"
              className="group flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-semibold whitespace-nowrap">{action.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Primary FAB button */}
      <div className="flex items-center gap-3">
        {isExpanded && (
          <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-slide-right">
            {primaryAction.label}
          </span>
        )}
        <Button
          onClick={() => {
            if (secondaryActions.length > 0) {
              setIsExpanded(!isExpanded);
            } else {
              primaryAction.onClick();
            }
          }}
          variant="aurora"
          size="icon"
          className={cn(
            'w-16 h-16 rounded-full shadow-2xl text-3xl transition-all transform hover:scale-110',
            isExpanded && 'bg-gray-700 rotate-45'
          )}
          aria-label={primaryAction.label}
        >
          {isExpanded ? '✕' : primaryAction.icon}
        </Button>
      </div>

      {/* Backdrop when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
