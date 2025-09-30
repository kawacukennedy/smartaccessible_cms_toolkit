import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface AIErrorModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRetry: () => void;
  errorMessage?: string;
}

const AIErrorModal: React.FC<AIErrorModalProps> = ({ isVisible, onClose, onRetry, errorMessage }) => {
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
          <MaterialIcons name="error-outline" size={24} color="#F44336" style={styles.icon} />
          <Text style={styles.title}>AI Error</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>
          {errorMessage || 'An error occurred while processing your AI request. Please try again.'}
        </Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => {
              onRetry();
              onClose();
            }}
          >
            <Text style={styles.actionButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#9E9E9E' }]}
            onPress={onClose}
          >
            <Text style={styles.actionButtonText}>Dismiss</Text>
          </TouchableOpacity>
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
  icon: {
    marginRight: 10,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AIErrorModal;
