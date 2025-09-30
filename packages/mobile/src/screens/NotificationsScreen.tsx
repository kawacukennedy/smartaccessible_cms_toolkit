import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Notification } from '@/types/notification';

const NotificationsScreen = () => {
  const { notifications, dismissNotification, clearAllNotifications } = useNotifications();

  const getStyleColors = (style: Notification['style']) => {
    switch (style) {
      case 'info':
        return { backgroundColor: '#BBDEFB', textColor: '#2196F3' };
      case 'warning':
        return { backgroundColor: '#FFECB3', textColor: '#FFC107' };
      case 'error':
        return { backgroundColor: '#FFCDD2', textColor: '#F44336' };
      case 'success':
        return { backgroundColor: '#C8E6C9', textColor: '#4CAF50' };
      case 'ai_suggestion':
        return { backgroundColor: '#E0F7FA', textColor: '#00BCD4' };
      default:
        return { backgroundColor: '#E0E0E0', textColor: '#9E9E9E' };
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAllNotifications} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No new notifications</Text>
        </View>
      ) : (
        <ScrollView style={styles.notificationList}>
          {notifications.map((notification) => {
            const { backgroundColor, textColor } = getStyleColors(notification.style);
            const iconName = getIconName(notification.style);
            return (
              <View key={notification.id} style={[styles.notificationItem, { backgroundColor }]}>
                <MaterialIcons name={iconName} size={24} color={textColor} style={styles.notificationIcon} />
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationMessage, { color: textColor }]}>{notification.message}</Text>
                  <Text style={styles.notificationTimestamp}>{new Date(notification.timestamp).toLocaleString()}</Text>
                </View>
                <TouchableOpacity onPress={() => dismissNotification(notification.id)} style={styles.dismissButton}>
                  <MaterialIcons name="close" size={20} color={textColor} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  clearButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 10,
  },
  notificationList: {
    flex: 1,
    padding: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    fontWeight: '500',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  dismissButton: {
    padding: 5,
    marginLeft: 10,
  },
});

export default NotificationsScreen;
