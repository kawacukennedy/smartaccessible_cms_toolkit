import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';

interface MobileEditorToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleAIPanel: () => void;
  onTogglePreview: () => void;
  onToggleMediaLibrary: () => void;
  onPublish: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isPreviewMode: boolean;
  isSaving: boolean; // New prop for autosave spinner
}

const MobileEditorToolbar: React.FC<MobileEditorToolbarProps> = ({
  onSave,
  onUndo,
  onRedo,
  onToggleAIPanel,
  onTogglePreview,
  onToggleMediaLibrary,
  onPublish,
  canUndo,
  canRedo,
  isPreviewMode,
  isSaving,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const ToolbarButton: React.FC<{ onPress: () => void; disabled?: boolean; children: React.ReactNode }> = ({
    onPress,
    disabled,
    children,
  }) => (
    <TouchableOpacity
      onPressIn={animateButton}
      onPress={onPress}
      disabled={disabled}
      style={styles.toolbarButton}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.toolbarContainer}>
      <View style={styles.leftControls}>
        <ToolbarButton onPress={onUndo} disabled={!canUndo}>
          <Text style={styles.buttonText}>Undo</Text>
        </ToolbarButton>
        <ToolbarButton onPress={onRedo} disabled={!canRedo}>
          <Text style={styles.buttonText}>Redo</Text>
        </ToolbarButton>
      </View>
      <View style={styles.rightControls}>
        {isSaving && <ActivityIndicator size="small" color="#0000ff" style={styles.spinner} />}
        <ToolbarButton onPress={onSave}>
          <Text style={styles.buttonText}>Save</Text>
        </ToolbarButton>
        <ToolbarButton onPress={onToggleAIPanel}>
          <Text style={styles.buttonText}>AI</Text>
        </ToolbarButton>
        <ToolbarButton onPress={onTogglePreview}>
          <Text style={styles.buttonText}>{isPreviewMode ? 'Editor' : 'Preview'}</Text>
        </ToolbarButton>
        <ToolbarButton onPress={onToggleMediaLibrary}>
          <Text style={styles.buttonText}>Media</Text>
        </ToolbarButton>
        <ToolbarButton onPress={onPublish}>
          <Text style={styles.buttonText}>Publish</Text>
        </ToolbarButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftControls: {
    flexDirection: 'row',
  },
  rightControls: {
    flexDirection: 'row
  },
  toolbarButton: {
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  spinner: {
    marginRight: 10,
  },
});

export default MobileEditorToolbar;
