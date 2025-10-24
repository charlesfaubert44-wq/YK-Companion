import React, { useState, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface Tab {
  /**
   * Unique tab identifier
   */
  id: string;

  /**
   * Tab label
   */
  label: string;

  /**
   * Tab content
   */
  content: React.ReactNode;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Icon before label
   */
  icon?: React.ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Array of tabs
   */
  tabs: Tab[];

  /**
   * Default active tab ID
   */
  defaultTab?: string;

  /**
   * Controlled active tab ID
   */
  activeTab?: string;

  /**
   * Tab change callback
   */
  onChange?: (tabId: string) => void;

  /**
   * Enable pixel art aesthetic
   * @default true
   */
  pixel?: boolean;

  /**
   * Full width tabs
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Tabs component for organizing content
 *
 * @example
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: 'profile', label: 'Profile', content: <ProfileContent /> },
 *     { id: 'settings', label: 'Settings', content: <SettingsContent /> }
 *   ]}
 * />
 * ```
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  pixel = true,
  fullWidth = false,
  className,
  ...props
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={cn('w-full', className)} {...props}>
      {/* Tab List */}
      <div
        role="tablist"
        className={cn(
          'flex border-b-4 border-[#0a1128]',
          fullWidth ? 'w-full' : 'inline-flex'
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              disabled={isDisabled}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'px-6 py-3 font-bold transition-all duration-200 flex items-center gap-2',
                pixel
                  ? 'border-4 border-b-0'
                  : 'border-b-4',
                fullWidth ? 'flex-1' : '',
                isActive
                  ? pixel
                    ? 'bg-[#00ff88] text-[#0a1128] border-[#00cc6a] translate-y-[4px]'
                    : 'border-[#00ff88] text-[#00ff88]'
                  : pixel
                  ? 'bg-[#151b3a] text-gray-400 border-[#1f2937] hover:bg-[#1f2937]'
                  : 'border-transparent text-gray-400 hover:text-white',
                isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              )}
            >
              {tab.icon && <span className="inline-flex">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={tab.id}
            hidden={tab.id !== activeTab}
            className={cn(
              'transition-all duration-200',
              tab.id === activeTab ? 'animate-in fade-in' : ''
            )}
          >
            {tab.id === activeTab && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
