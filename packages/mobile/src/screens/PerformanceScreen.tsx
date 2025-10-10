import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import MobilePerformanceDashboard from '../components/MobilePerformanceDashboard';

const PerformanceScreen = () => {
  const { themeStyles } = useTheme();

  return (
    <View style={[styles.container, themeStyles.background]}>
      <MobilePerformanceDashboard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PerformanceScreen;