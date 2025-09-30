
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingStep {
  title: string;
  completed: boolean;
  tooltip?: string;
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
    { title: 'Create your first block', completed: false, tooltip: 'Add a new content block to the editor.' },
    { title: 'Use an AI suggestion', completed: false, tooltip: 'Apply an AI-generated suggestion to your content.' },
    { title: 'Explore the media library', completed: false, tooltip: 'Upload and manage your media assets.' },
    { title: 'Preview your content', completed: false, tooltip: 'See how your content looks on different devices.' },
    { title: 'Publish your first piece', completed: false, tooltip: 'Make your content live for the world to see.' },
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
