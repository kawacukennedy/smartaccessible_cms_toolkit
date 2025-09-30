
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const OnboardingStep = ({ title, completed }: { title: string; completed: boolean }) => (
  <div className={`flex items-center p-4 rounded-lg transition-all duration-300 ${completed ? 'bg-green-100 text-gray-500' : 'bg-white'}`}>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${completed ? 'bg-green-500' : 'bg-gray-300'}`}>
      {completed && <i className="bi bi-check-lg text-white"></i>}
    </div>
    <span className={completed ? 'line-through' : ''}>{title}</span>
  </div>
);

const Onboarding = () => {
  const { steps } = useOnboarding();
  const allStepsCompleted = steps.every(step => step.completed);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Welcome to SmartAccessible CMS</h1>
          {allStepsCompleted && <i className="bi bi-star-fill text-warning fs-3"></i>}
        </div>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <OnboardingStep key={index} title={step.title} completed={step.completed} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
