'use client';

import React, { useEffect, useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Check, Star } from 'lucide-react';

const OnboardingStep = ({ title, completed, tooltip }: { title: string; completed: boolean; tooltip?: string }) => (
  <div className={`flex items-center p-4 rounded-lg transition-all duration-300 ${completed ? 'bg-green-100 text-gray-500' : 'bg-white'}`} title={tooltip}>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${completed ? 'bg-green-500' : 'bg-gray-300'}`}>
      {completed && <Check size={16} className="text-white" />}
    </div>
    <span className={completed ? 'line-through' : ''}>{title}</span>
  </div>
);

const Confetti = () => {
  return (
    <div className="confetti-container">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
          }}
        ></div>
      ))}
    </div>
  );
};

const DynamicOnboardingPage = () => {
  const { steps } = useOnboarding();
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);

  useEffect(() => {
    setAllStepsCompleted(steps.every(step => step.completed));
  }, [steps]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {allStepsCompleted && <Confetti />}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Welcome to SmartAccessible CMS</h1>
          {allStepsCompleted && <Star size={24} className="text-warning" />}
          <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600" onClick={() => window.dispatchEvent(new Event('startTour'))}>Start Interactive Tour</button>
        </div>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <OnboardingStep key={index} title={step.title} completed={step.completed} tooltip={step.tooltip} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicOnboardingPage;
