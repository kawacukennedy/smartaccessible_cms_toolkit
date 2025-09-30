import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Notification } from '@/types/notification';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface NotificationSnackbarProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({ notification, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const slideAnim = useRef(new Animated.Value(50)).current; // Initial value for slide: 50 (off-screen)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Auto-hide after a few seconds if no action is present
      if (!notification.actionLabel) {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 50,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => onClose(notification.id));
        }, 3000); // 3 seconds
      }
    });
  }, [fadeAnim, slideAnim, notification.id, notification.actionLabel, onClose]);

  const getStyleColors = (style: Notification['style']) => {
    switch (style) {
      case 'info':
        return { backgroundColor: '#2196F3', textColor: '#fff' };
      case 'warning':
        return { backgroundColor: '#FFC107', textColor: '#000' };
      case 'error':
        return { backgroundColor: '#F44336', textColor: '#fff' };
      case 'success':
        return { backgroundColor: '#4CAF50', textColor: '#fff' };
      case 'ai_suggestion':
        return { backgroundColor: '#00BCD4', textColor: '#fff' };
      default:
        return { backgroundColor: '#333', textColor: '#fff' };
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

  const { backgroundColor, textColor } = getStyleColors(notification.style);
  const iconName = getIconName(notification.style);

  return (
    <Animated.View
      style={[
        styles.snackbar,
        { backgroundColor, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <MaterialIcons name={iconName} size={20} color={textColor} style={styles.icon} />
      <Text style={[styles.message, { color: textColor }]}>{notification.message}</Text>
      {notification.actionLabel && notification.onActionClick && (
        <TouchableOpacity onPress={() => {
          notification.onActionClick && notification.onActionClick();
          onClose(notification.id);
        }} style={styles.actionButton}>
          <Text style={[styles.actionButtonText, { color: textColor }]}>{notification.actionLabel}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => onClose(notification.id)} style={styles.closeButton}>
        <MaterialIcons name="close" size={20} color={textColor} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    marginLeft: 10,
  },
  actionButtonText: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default NotificationSnackbar;
