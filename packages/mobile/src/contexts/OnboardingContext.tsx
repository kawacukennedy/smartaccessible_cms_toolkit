
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingStep {
  title: string;
  completed: boolean;
}

interface TourStep {
  id: string;
  title: string;
  message: string;
  targetComponentId?: string; // Optional ID of the component to highlight/attach tooltip
}

interface OnboardingContextType {
  steps: OnboardingStep[];
  completeStep: (title: string) => void;
  tourSteps: TourStep[];
  currentTourStepIndex: number | null;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
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

  const [currentTourStepIndex, setCurrentTourStepIndex] = useState<number | null>(null);

  const tourSteps: TourStep[] = [
    { id: 'tour-1', title: 'Welcome!', message: 'Let's take a quick tour of the SmartAccessible CMS Toolkit.' },
    { id: 'tour-2', title: 'Content Editor', message: 'This is where you create and edit your content blocks.', targetComponentId: 'mobile-block-canvas' },
    { id: 'tour-3', title: 'AI Suggestions', message: 'Get real-time AI suggestions to improve your content.', targetComponentId: 'mobile-ai-panel-toggle' },
    { id: 'tour-4', title: 'Media Library', message: 'Manage your images and other media assets here.', targetComponentId: 'mobile-media-library-toggle' },
    { id: 'tour-5', title: 'Live Preview', message: 'See how your content looks on different devices.', targetComponentId: 'mobile-preview-toggle' },
    { id: 'tour-6', title: 'Publish Content', message: 'When you're ready, publish your content to make it live.', targetComponentId: 'mobile-publish-button' },
    { id: 'tour-7', title: 'Undo/Redo', message: 'Swipe left/right on the canvas to undo or redo changes.', targetComponentId: 'mobile-block-canvas' },
    { id: 'tour-8', title: 'Accessibility', message: 'Check and improve your content's accessibility.', targetComponentId: 'mobile-accessibility-toggle' },
  ];

  const completeStep = (title: string) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.title === title ? { ...step, completed: true } : step
      )
    );
  };

  const startTour = () => {
    setCurrentTourStepIndex(0);
  };

  const nextTourStep = () => {
    if (currentTourStepIndex !== null && currentTourStepIndex < tourSteps.length - 1) {
      setCurrentTourStepIndex(currentTourStepIndex + 1);
    } else {
      endTour();
    }
  };

  const prevTourStep = () => {
    if (currentTourStepIndex !== null && currentTourStepIndex > 0) {
      setCurrentTourStepIndex(currentTourStepIndex - 1);
    }
  };

  const endTour = () => {
    setCurrentTourStepIndex(null);
  };

  return (
    <OnboardingContext.Provider value={{ steps, completeStep, tourSteps, currentTourStepIndex, startTour, nextTourStep, prevTourStep, endTour }}>
      {children}
    </OnboardingContext.Provider>
  );
};
