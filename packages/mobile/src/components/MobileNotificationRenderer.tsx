
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationToast from './NotificationToast';
import NotificationModal from './NotificationModal'; // Import NotificationModal
import NotificationSnackbar from './NotificationSnackbar'; // Import NotificationSnackbar

const MobileNotificationRenderer: React.FC = () => {
  const { notifications, dismissNotification } = useNotifications();

  const toastNotifications = notifications.filter(n => n.displayType === 'toast');
  const modalNotifications = notifications.filter(n => n.displayType === 'modal');
  const snackbarNotifications = notifications.filter(n => n.displayType === 'snackbar');

  return (
    <>
      {/* Toast Notifications (bottom-aligned) */}
      <View style={styles.toastContainer}>
        {toastNotifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => dismissNotification(notification.id)}
          />
        ))}
      </View>

      {/* Modal Notifications (centered) */}
      {modalNotifications.map((notification) => (
        <NotificationModal
          key={notification.id}
          notification={notification}
          onClose={() => dismissNotification(notification.id)}
        />
      ))}

      {/* Snackbar Notifications (top-aligned) */}
      <View style={styles.snackbarContainer}>
        {snackbarNotifications.map((notification) => (
          <NotificationSnackbar
            key={notification.id}
            notification={notification}
            onClose={() => dismissNotification(notification.id)}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    zIndex: 1000,
    alignItems: 'center',
  },
  snackbarContainer: {
    position: 'absolute',
    top: 20, // Position at the top
    width: '100%',
    zIndex: 1000,
    alignItems: 'center',
  },
});

export default MobileNotificationRenderer;
