import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface MobileLivePreviewPanelProps {
  content: string;
  onScroll?: (percentage: number) => void;
  scrollPercentage?: number;
}

const MobileLivePreviewPanel: React.FC<MobileLivePreviewPanelProps> = ({ content, onScroll, scrollPercentage }) => {
  const { theme } = useTheme();
  const { highContrast, reducedMotion, fontSize } = useAccessibility();
  const [deviceMode, setDeviceMode] = useState<'phone' | 'tablet'>('phone');
  const scrollViewRef = React.useRef<ScrollView>(null);

  const getDeviceDimensions = () => {
    if (deviceMode === 'phone') {
      return { width: 375, height: 667 }; // iPhone 8 dimensions
    } else {
      return { width: 768, height: 1024 }; // iPad dimensions
    }
  };

  const { width, height } = getDeviceDimensions();

  const previewStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
    },
    deviceFrame: {
      borderWidth: 10,
      borderColor: '#333',
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    },
    previewContent: {
      width: width,
      height: height,
      backgroundColor: theme === 'dark' ? '#212529' : '#fff',
      padding: 15,
    },
    contentText: {
      fontSize: fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16,
      color: theme === 'dark' ? '#fff' : '#000',
      lineHeight: fontSize === 'small' ? 20 : fontSize === 'large' ? 26 : 22,
    },
    // Apply high contrast styles
    highContrastText: {
      color: highContrast ? '#0f0' : (theme === 'dark' ? '#fff' : '#000'),
    },
    highContrastBackground: {
      backgroundColor: highContrast ? '#000' : (theme === 'dark' ? '#212529' : '#fff'),
    },
  });

  // Scroll synchronization
  useEffect(() => {
    if (scrollViewRef.current && scrollPercentage !== undefined) {
      // This is a simplified scroll sync. In a real app, you'd need to map content heights.
      scrollViewRef.current.scrollTo({
        y: scrollPercentage * (scrollViewRef.current.contentSize.height - scrollViewRef.current.layoutMeasurement.height),
        animated: !reducedMotion
      });
    }
  }, [scrollPercentage, reducedMotion]);

  const handleScroll = (event: any) => {
    if (onScroll) {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const percentage = contentOffset.y / (contentSize.height - layoutMeasurement.height);
      onScroll(percentage);
    }
  };

  // Debounce for live update (not directly implemented here, but assumed to be handled by parent passing debounced content)

  return (
    <View style={previewStyles.container}>
      <View style={styles.deviceModeToggle}>
        <TouchableOpacity
          onPress={() => setDeviceMode('phone')}
          style={[styles.deviceModeButton, deviceMode === 'phone' && styles.deviceModeButtonActive]}
        >
          <Text style={styles.deviceModeButtonText}>Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDeviceMode('tablet')}
          style={[styles.deviceModeButton, deviceMode === 'tablet' && styles.deviceModeButtonActive]}
        >
          <Text style={styles.deviceModeButtonText}>Tablet</Text>
        </TouchableOpacity>
      </View>
      <View style={[previewStyles.deviceFrame, { width: width + 20, height: height + 20 }]}>
        <ScrollView
          ref={scrollViewRef}
          style={[previewStyles.previewContent, previewStyles.highContrastBackground]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Text style={[previewStyles.contentText, previewStyles.highContrastText]}>
            {content}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deviceModeToggle: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  deviceModeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deviceModeButtonActive: {
    backgroundColor: '#2196F3',
  },
  deviceModeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default MobileLivePreviewPanel;
