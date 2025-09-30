import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Notification } from '@/types/notification';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface NotificationModalProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose }) => {
  const getStyleColors = (style: Notification['style']) => {
    switch (style) {
      case 'info':
        return { backgroundColor: '#BBDEFB', iconColor: '#2196F3' };
      case 'warning':
        return { backgroundColor: '#FFECB3', iconColor: '#FFC107' };
      case 'error':
        return { backgroundColor: '#FFCDD2', iconColor: '#F44336' };
      case 'success':
        return { backgroundColor: '#C8E6C9', iconColor: '#4CAF50' };
      case 'ai_suggestion':
        return { backgroundColor: '#E0F7FA', iconColor: '#00BCD4' };
      default:
        return { backgroundColor: '#E0E0E0', iconColor: '#9E9E9E' };
    }
  };

  const getIconName = (style: Notification['style']) => {
    switch (style) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'check-circle';
      case 'ai_suggestion':
        return 'auto-awesome';
      default:
        return 'notifications';
    }
  };

  const { backgroundColor, iconColor } = getStyleColors(notification.style);
  const iconName = getIconName(notification.style);

  return (
    <Modal
      isVisible={true} // Always visible when rendered by MobileNotificationRenderer
      onBackdropPress={() => onClose(notification.id)}
      onSwipeComplete={() => onClose(notification.id)}
      swipeDirection={['down']}
      style={styles.modal}
    >
      <View style={[styles.modalContent, { backgroundColor }]}>
        <View style={styles.header}>
          <MaterialIcons name={iconName} size={24} color={iconColor} style={styles.icon} />
          <Text style={styles.title}>{notification.title || notification.style.toUpperCase()}</Text>
          <TouchableOpacity onPress={() => onClose(notification.id)} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>{notification.message}</Text>
        {notification.actions && notification.actions.length > 0 && (
          <View style={styles.actionsContainer}>
            {notification.actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={() => {
                  action.onClick();
                  onClose(notification.id);
                }}
              >
                <Text style={styles.actionButtonText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NotificationModal;
