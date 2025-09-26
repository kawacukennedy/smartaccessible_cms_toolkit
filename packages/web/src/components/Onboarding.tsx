
import { useOnboarding } from '@/contexts/OnboardingContext';
import Confetti from 'react-confetti';
import { Check, Star } from 'lucide-react';

const OnboardingStep = ({ title, completed }: { title: string; completed: boolean }) => (
  <div className={`flex items-center p-4 rounded-lg transition-all duration-300 ${completed ? 'bg-green-100 text-gray-500' : 'bg-white'}`}>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${completed ? 'bg-green-500' : 'bg-gray-300'}`}>
      {completed && <Check size={16} className="text-white" />}
    </div>
    <span className={completed ? 'line-through' : ''}>{title}</span>
  </div>
);

const Onboarding = () => {
  const { steps } = useOnboarding();
  const allStepsCompleted = steps.every(step => step.completed);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {allStepsCompleted && <Confetti />}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Welcome to SmartAccessible CMS</h1>
          {allStepsCompleted && <Star size={32} className="text-yellow-400" />}
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
