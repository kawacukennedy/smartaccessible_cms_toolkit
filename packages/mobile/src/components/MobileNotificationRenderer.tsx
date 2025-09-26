
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationToast from './NotificationToast';

const MobileNotificationRenderer: React.FC = () => {
  const { notifications, dismissNotification } = useNotifications();

  const toastNotifications = notifications.filter(n => n.displayType === 'toast');
  // In-app notifications would be rendered differently, perhaps in a modal or a dedicated screen area

  return (
    <View style={styles.container}>
      {toastNotifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => dismissNotification(notification.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    zIndex: 1000,
    alignItems: 'center',
  },
});

export default MobileNotificationRenderer;
