import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, theme === 'dark' ? darkStyles.container : lightStyles.container]}>
      <Text style={theme === 'dark' ? { color: '#fff' } : { color: '#000' }}>{t('notifications')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#212529',
  },
});

export default NotificationsScreen;
