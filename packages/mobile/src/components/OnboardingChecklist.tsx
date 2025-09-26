
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOnboarding } from './../contexts/OnboardingContext';
import Icon from 'react-native-vector-icons/Ionicons';

const OnboardingChecklist = () => {
  const { steps } = useOnboarding();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <Icon
            name={step.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={step.completed ? '#4CAF50' : '#9E9E9E'}
          />
          <Text style={[styles.stepText, step.completed && styles.completedStepText]}>
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#212121',
  },
  completedStepText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
});

export default OnboardingChecklist;
