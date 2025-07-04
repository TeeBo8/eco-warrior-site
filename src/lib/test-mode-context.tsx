"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

type TestMode = 'dev' | 'normal' | 'premium';

interface TestModeContextType {
  testMode: TestMode;
  setTestMode: (mode: TestMode) => void;
  isDeveloper: boolean;
  isPremiumForced: boolean;
}

const TestModeContext = createContext<TestModeContextType | undefined>(undefined);

export function TestModeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [testMode, setTestModeState] = useState<TestMode>('dev');

  // Vérifier si l'utilisateur est un développeur
  const isDeveloper = user?.emailAddresses?.[0]?.emailAddress === 't.leture@gmail.com';

  // Calculer si le mode premium est forcé
  const isPremiumForced = testMode === 'dev' ? isDeveloper : testMode === 'premium';

  // Persister le mode de test dans localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('eco-warrior-test-mode') as TestMode;
    if (savedMode && ['dev', 'normal', 'premium'].includes(savedMode)) {
      setTestModeState(savedMode);
    }
  }, []);

  const setTestMode = (mode: TestMode) => {
    setTestModeState(mode);
    localStorage.setItem('eco-warrior-test-mode', mode);
  };

  return (
    <TestModeContext.Provider value={{
      testMode,
      setTestMode,
      isDeveloper,
      isPremiumForced
    }}>
      {children}
    </TestModeContext.Provider>
  );
}

export function useTestMode() {
  const context = useContext(TestModeContext);
  if (context === undefined) {
    throw new Error('useTestMode must be used within a TestModeProvider');
  }
  return context;
}

// Hook personnalisé pour vérifier le statut premium avec le mode de test
export function usePremiumStatus() {
  const { user } = useUser();
  const { testMode, isPremiumForced } = useTestMode();
  
  // Vérification normale du statut premium
  const hasAdminRole = user?.publicMetadata?.role === 'admin';
  const hasSubscription = Boolean(
    user?.publicMetadata?.stripe && 
    typeof user.publicMetadata.stripe === 'object' && 
    'isSubscribed' in user.publicMetadata.stripe &&
    user.publicMetadata.stripe.isSubscribed === true
  );
  const isPremiumReal = hasAdminRole || hasSubscription;

  // Retourner le statut selon le mode de test
  switch (testMode) {
    case 'dev':
      return isPremiumForced || isPremiumReal;
    case 'premium':
      return true;
    case 'normal':
      return false;
    default:
      return isPremiumReal;
  }
} 