import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MobileEditorToolbar from '../components/MobileEditorToolbar';
import MobileBlockCanvas from '../components/MobileBlockCanvas';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import MobileAISuggestionsPanel from '../components/MobileAISuggestionsPanel';

import MobileMediaLibrary from '../components/MobileMediaLibrary';

const ContentEditorScreen = () => {
  const { currentContent, addChange, undo, redo, canUndo, canRedo } = useUndoRedo();
  const { addNotification } = useNotifications();
  const { completeStep } = useOnboarding();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    console.log('Saving content:', currentContent);
    addNotification({
      displayType: 'toast',
      style: 'info',
      message: 'Content save initiated.',
    });
    setTimeout(() => {
      setIsSaving(false);
      addNotification({
        displayType: 'toast',
        style: 'success',
        message: 'Content saved successfully!',
      });
    }, 1000);
  };

  const handleContentChange = (newContent: string) => {
    addChange(newContent);
  };

  const toggleAIPanel = () => {
    setIsAIPanelOpen(!isAIPanelOpen);
    addNotification({
      displayType: 'toast',
      style: 'info',
      message: isAIPanelOpen ? 'AI Panel Closed' : 'AI Panel Opened',
    });
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    completeStep('Preview your content');
    addNotification({
      displayType: 'toast',
      style: 'info',
      message: isPreviewMode ? 'Exiting Preview' : 'Entering Preview',
    });
  };

  const toggleMediaLibrary = () => {
    setIsMediaLibraryOpen(!isMediaLibraryOpen);
    if (!isMediaLibraryOpen) {
      completeStep('Explore the media library');
    }
  };

  const handleContentChange = (newContent: string) => {
    addChange(newContent);
  };

  const handleSelectImage = (imageUri: string, altText: string) => {
    const newBlock = { id: Date.now().toString(), type: 'image', content: imageUri, alt: altText };
    const currentBlocks = JSON.parse(currentContent);
    const updatedBlocks = [...currentBlocks, newBlock];
    addChange(JSON.stringify(updatedBlocks));
    toggleMediaLibrary();
  };

  const handleApplySuggestion = (suggestion: { id: string; message: string; confidence: 'high' | 'medium' | 'low' }) => {
    const newContent = currentContent + '\n\n' + `[AI Suggestion Applied: ${suggestion.message}]`;
    addChange(newContent);
    completeStep('Use an AI suggestion');
  };

  const handleDismissSuggestion = (suggestion: { id: string; message: string; confidence: 'high' | 'medium' | 'low' }) => {
    console.log('Dismissed suggestion:', suggestion.message);
  };

  const handleApplyAllSuggestions = (suggestions: { id: string; message: string; confidence: 'high' | 'medium' | 'low' }[]) => {
    let newContent = currentContent;
    suggestions.forEach(suggestion => {
      newContent += '\n\n' + `[AI Suggestion Applied: ${suggestion.message}]`;
    });
    addChange(newContent);
    addNotification({
      displayType: 'toast',
      style: 'success',
      message: 'All suggestions applied!',
    });
  };

  const handleRevertAllSuggestions = () => {
    // For simplicity, this will just undo the last change. In a real app,
    // it would revert only the AI-applied changes.
    undo();
    addNotification({
      displayType: 'toast',
      style: 'info',
      message: 'All AI suggestions reverted.',
    });
  };

  const handlePublish = () => {
    setIsPublishModalOpen(true);
  };

  const handleConfirmPublish = () => {
    console.log('Publishing content confirmed:', currentContent);

    // 1. Run validations
    const issues = runValidationChecks();
    if (issues.length > 0) {
      addNotification({
        displayType: 'toast',
        style: 'error',
        message: `Validation failed: ${issues.join(', ')}`,
      });
      setIsPublishModalOpen(false);
      return;
    }

    addNotification({
      displayType: 'toast',
      style: 'info',
      message: 'Publishing content...',
    });
    // Simulate API call for publishing
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        addNotification({ displayType: 'toast',
          style: 'success',
          message: 'Content published successfully!' });
        completeStep('Publish your first piece');
      } else {
        // Simulate conflict handling
        const { conflict } = { conflict: Math.random() > 0.5 }; // 50% chance of conflict
        if (conflict) {
          addNotification({
            displayType: 'toast',
            style: 'warning',
            message: 'Publish conflict detected. Please review and try again.',
          });
        } else {
          addNotification({
            displayType: 'toast',
            style: 'error',
            message: 'Publish failed. Retry?',
          });
        }
      }
      setIsPublishModalOpen(false);
    }, 2000);
  };

  const runValidationChecks = (): string[] => {
    const issues: string[] = [];
    const blocks = JSON.parse(currentContent);

    if (blocks.length === 0) {
      issues.push('Content is empty.');
    }

    blocks.forEach((block: any) => {
      if (block.type === 'image' && !block.alt) {
        issues.push(`Image block ${block.id} is missing alt text.`);
      }
      // Add more validation rules here
    });

    return issues;
  };

  return (
    <View style={styles.container}>
      <MobileEditorToolbar
        onSave={handleSave}
        onUndo={undo}
        onRedo={redo}
        onToggleAIPanel={toggleAIPanel}
        onTogglePreview={togglePreviewMode}
        onToggleMediaLibrary={toggleMediaLibrary}
        onPublish={handlePublish}
        canUndo={canUndo}
        canRedo={canRedo}
        isPreviewMode={isPreviewMode}
        isSaving={isSaving}
      />
      <MobileBlockCanvas
        content={JSON.stringify(currentContent)}
        onContentChange={handleContentChange}
        panHandlers={panResponder.panHandlers}
      />
      {isAIPanelOpen && (
        <MobileAISuggestionsPanel
          onApplySuggestion={handleApplySuggestion}
          onDismissSuggestion={handleDismissSuggestion}
          onApplyAllSuggestions={handleApplyAllSuggestions}
          onRevertAllSuggestions={handleRevertAllSuggestions}
        />
      )}
      {isPreviewMode && (
        <View style={styles.overlayPanel}>
          <Text style={styles.overlayText}>Live Preview Content</Text>
        </View>
      )}
      <MobileMediaLibrary
        isVisible={isMediaLibraryOpen}
        onClose={toggleMediaLibrary}
        onSelectImage={handleSelectImage}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPublishModalOpen}
        onRequestClose={() => setIsPublishModalOpen(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to publish?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: '#2196F3' }}
                onPress={handleConfirmPublish}
              >
                <Text style={styles.textStyle}>Publish</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: '#f44336' }}
                onPress={() => setIsPublishModalOpen(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlayPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalButtons: {
    flexDirection: 'row',
  }
});

export default ContentEditorScreen;