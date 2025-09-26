
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingStep {
  title: string;
  completed: boolean;
}

interface OnboardingContextType {
  steps: OnboardingStep[];
  completeStep: (title: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { title: 'Create your first block', completed: false },
    { title: 'Use an AI suggestion', completed: false },
    { title: 'Explore the media library', completed: false },
    { title: 'Preview your content', completed: false },
    { title: 'Publish your first piece', completed: false },
  ]);

  const completeStep = (title: string) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.title === title ? { ...step, completed: true } : step
      )
    );
  };

  return (
    <OnboardingContext.Provider value={{ steps, completeStep }}>
      {children}
    </OnboardingContext.Provider>
  );
};
