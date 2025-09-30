import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ConflictResolutionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onResolve: (resolution: 'keep_mine' | 'keep_server' | 'merge', mergedContent?: string) => void;
  currentContent: string;
  serverContent: string;
}

const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isVisible,
  onClose,
  onResolve,
  currentContent,
  serverContent,
}) => {
  const [mergedContent, setMergedContent] = React.useState('');

  React.useEffect(() => {
    // Initialize merged content with current content or a merge strategy
    setMergedContent(currentContent);
  }, [currentContent, serverContent]);

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
          <MaterialIcons name="sync-problem" size={24} color="#FFC107" style={styles.icon} />
          <Text style={styles.title}>Publish Conflict Detected</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>
          Your changes conflict with the server version. Please choose how to resolve:
        </Text>

        <ScrollView style={styles.contentArea}>
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Your Version:</Text>
            <Text style={styles.contentText}>{currentContent}</Text>
          </View>
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Server Version:</Text>
            <Text style={styles.contentText}>{serverContent}</Text>
          </View>
          {/* A more advanced merge UI would go here */}
        </ScrollView>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => onResolve('keep_mine')}
          >
            <Text style={styles.actionButtonText}>Keep Mine</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => onResolve('keep_server')}
          >
            <Text style={styles.actionButtonText}>Keep Server</Text>
          </TouchableOpacity>
          {/* Merge option would be more complex, potentially opening a merge editor */}
          {/* <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FFC107' }]}
            onPress={() => onResolve('merge', mergedContent)}
          >
            <Text style={styles.actionButtonText}>Merge</Text>
          </TouchableOpacity> */}
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
    width: '90%',
    maxHeight: '80%',
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
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  contentArea: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
  },
  contentSection: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contentText: {
    fontSize: 12,
    color: '#555',
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

export default ConflictResolutionModal;
