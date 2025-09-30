
import React from 'react';
import Joyride, { Step, STATUS, CallBackProps } from 'react-joyride';

const steps: Step[] = [
  {
    target: '.sidebar',
    content: 'This is the sidebar. You can navigate to different sections of the application from here.',
  },
  {
    target: '.btn-primary',
    content: 'You can create a new page using this button.',
  },
  {
    target: 'input[placeholder="Search sidebar..."]',
    content: 'Search for pages, templates, and content types.',
  },
  {
    target: 'a[href="/onboarding"]',
    content: 'You can always come back to the onboarding page to see your progress.',
  },
];

interface InteractiveTourProps {
  run: boolean;
  setRunTour: (run: boolean) => void;
}

const InteractiveTour: React.FC<InteractiveTourProps> = ({ run, setRunTour }) => {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      setRunTour(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
    />
  );
};

export default InteractiveTour;
