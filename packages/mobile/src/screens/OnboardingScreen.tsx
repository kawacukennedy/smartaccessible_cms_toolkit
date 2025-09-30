
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import OnboardingChecklist from '../components/OnboardingChecklist';
import { useOnboarding } from '../contexts/OnboardingContext';
import ConfettiCannon from 'react-native-confetti-cannon';
import TourStepModal from '../components/TourStepModal'; // Import TourStepModal

const OnboardingScreen = () => {
  const { steps, tourSteps, currentTourStepIndex, startTour, nextTourStep, prevTourStep, endTour } = useOnboarding();
  const allStepsCompleted = steps.every(step => step.completed);

  const currentTourStep = currentTourStepIndex !== null ? tourSteps[currentTourStepIndex] : null;
  const isTourVisible = currentTourStepIndex !== null;
  const isFirstStep = currentTourStepIndex === 0;
  const isLastStep = currentTourStepIndex === tourSteps.length - 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SmartAccessible CMS</Text>
      <OnboardingChecklist />
      {!isTourVisible && (
        <TouchableOpacity style={styles.startButton} onPress={startTour}>
          <Text style={styles.startButtonText}>Start Interactive Tour</Text>
        </TouchableOpacity>
      )}
      {allStepsCompleted && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />}

      <TourStepModal
        isVisible={isTourVisible}
        onClose={endTour}
        step={currentTourStep}
        onNext={nextTourStep}
        onPrev={prevTourStep}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
