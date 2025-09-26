
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OnboardingChecklist from '../components/OnboardingChecklist';
import { useOnboarding } from '../contexts/OnboardingContext';
import ConfettiCannon from 'react-native-confetti-cannon';

const OnboardingScreen = () => {
  const { steps } = useOnboarding();
  const allStepsCompleted = steps.every(step => step.completed);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SmartAccessible CMS</Text>
      <OnboardingChecklist />
      {allStepsCompleted && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />}
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
});

export default OnboardingScreen;
