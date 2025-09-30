import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface TelemetryConsentModalProps {
  isVisible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const TelemetryConsentModal: React.FC<TelemetryConsentModalProps> = ({ isVisible, onAccept, onDecline }) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.7}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriverForBackdrop
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <MaterialIcons name="analytics" size={50} color="#2196F3" style={styles.icon} />
        <Text style={styles.title}>Telemetry Data Collection</Text>
        <Text style={styles.message}>
          We collect anonymous usage data to help us improve the app's performance and features.
          This data does not include any personal information.
          Do you consent to sharing this anonymous telemetry data?
        </Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={onAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={onDecline}>
            <Text style={styles.buttonText}>Decline</Text>
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
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TelemetryConsentModal;
