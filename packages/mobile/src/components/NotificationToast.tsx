
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationToast: React.FC<{ notification: Notification; onClose: () => void }> = ({
  notification,
  onClose,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }
    ).start();

    const timer = setTimeout(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }
      ).start(() => onClose());
    }, 3000); // Auto-dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [fadeAnim, onClose]);

  const getIconName = (style: Notification['style']) => {
    switch (style) {
      case 'info': return 'information-circle';
      case 'ai_suggestion':
        backgroundColor = '#E0F7FA'; // Light blue for AI suggestions
        iconName = 'auto-awesome';
        iconColor = '#00BCD4';
        break;
      case 'warning': return 'warning';
      case 'error': return 'close-circle';
      case 'AI': return 'sparkles';
      default: return 'notifications';
    }
  };

  const getBackgroundColor = (style: Notification['style']) => {
    switch (style) {
      case 'info': return '#17a2b8';
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      case 'AI': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  return (
    <Animated.View style={{ ...styles.toastContainer, backgroundColor: getBackgroundColor(notification.style), opacity: fadeAnim }}>
      <Icon name={getIconName(notification.style)} size={20} color="#fff" style={styles.toastIcon} />
      <Text style={styles.toastMessage}>{notification.message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="close" size={16} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastIcon: {
    marginRight: 10,
  },
  toastMessage: {
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default NotificationToast;
