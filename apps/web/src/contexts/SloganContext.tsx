'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SloganContextType {
  currentSlogan: string;
  setCurrentSlogan: (slogan: string) => void;
}

const SloganContext = createContext<SloganContextType | undefined>(undefined);

export function SloganProvider({ children }: { children: ReactNode }) {
  const [currentSlogan, setCurrentSlogan] = useState('');

  return (
    <SloganContext.Provider value={{ currentSlogan, setCurrentSlogan }}>
      {children}
    </SloganContext.Provider>
  );
}

export function useSlogan() {
  const context = useContext(SloganContext);
  if (context === undefined) {
    throw new Error('useSlogan must be used within a SloganProvider');
  }
  return context;
}
