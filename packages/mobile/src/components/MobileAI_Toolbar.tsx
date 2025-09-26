import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MobileAI_ToolbarProps {
  onGenerateSuggestions: () => void;
}

const MobileAI_Toolbar: React.FC<MobileAI_ToolbarProps> = ({ onGenerateSuggestions }) => {
  return (
    <View style={styles.toolbarContainer}>
      <TouchableOpacity onPress={onGenerateSuggestions} style={styles.toolbarButton}>
        <Text style={styles.buttonText}>Generate AI Suggestions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  toolbarButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default MobileAI_Toolbar;
