import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import MobileAnalyticsDashboard from '../components/MobileAnalyticsDashboard';

const AnalyticsScreen = () => {
  const { themeStyles } = useTheme();

  return (
    <View style={[styles.container, themeStyles.background]}>
      <MobileAnalyticsDashboard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AnalyticsScreen;