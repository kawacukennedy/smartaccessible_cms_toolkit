import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TourStep } from '@/contexts/OnboardingContext'; // Assuming TourStep is exported

interface TourStepModalProps {
  isVisible: boolean;
  onClose: () => void;
  step: TourStep | null;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const TourStepModal: React.FC<TourStepModalProps> = ({
  isVisible,
  onClose,
  step,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}) => {
  if (!step) return null;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{step.title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>{step.message}</Text>

        <View style={styles.navigationContainer}>
          {!isFirstStep && (
            <TouchableOpacity style={styles.navButton} onPress={onPrev}>
              <MaterialIcons name="arrow-back" size={24} color="#2196F3" />
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          {!isLastStep ? (
            <TouchableOpacity style={styles.navButton} onPress={onNext}>
              <Text style={styles.navButtonText}>Next</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#2196F3" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.navButton} onPress={onClose}>
              <Text style={styles.navButtonText}>Finish Tour</Text>
              <MaterialIcons name="check" size={24} color="#4CAF50" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  navButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

export default TourStepModal;
