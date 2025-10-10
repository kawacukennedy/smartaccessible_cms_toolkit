import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import MobileThemeBuilder from '../components/MobileThemeBuilder';

const ThemeBuilderScreen = () => {
  const { themeStyles } = useTheme();

  return (
    <View style={[styles.container, themeStyles.background]}>
      <MobileThemeBuilder />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemeBuilderScreen;