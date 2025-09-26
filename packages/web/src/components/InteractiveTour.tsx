
import React from 'react';
import Joyride, { Step, STATUS } from 'react-joyride';

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

const InteractiveTour = ({ run, setRunTour }) => {
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
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
