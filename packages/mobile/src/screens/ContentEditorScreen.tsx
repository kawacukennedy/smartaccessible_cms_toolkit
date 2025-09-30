import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MobileEditorToolbar from '../components/MobileEditorToolbar';
import MobileBlockCanvas from '../components/MobileBlockCanvas';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import MobileAISuggestionsPanel from '../components/MobileAISuggestionsPanel';
import MobileLivePreviewPanel from '../components/MobileLivePreviewPanel'; // Import MobileLivePreviewPanel
import ConflictResolutionModal from '../components/ConflictResolutionModal'; // Import ConflictResolutionModal
import AIErrorModal from '../components/AIErrorModal'; // Import AIErrorModal
import { trackEvent } from '../lib/telemetry'; // Import trackEvent
import NetInfo from "@react-native-community/netinfo";

import MobileMediaLibrary from '../components/MobileMediaLibrary';

const ContentEditorScreen = () => {
  const { currentContent, addChange, undo, redo, canUndo, canRedo } = useUndoRedo();
  const { addNotification } = useNotifications();
  const { completeStep } = useOnboarding();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false); // New state for conflict modal
  const [isAIErrorModalOpen, setIsAIErrorModalOpen] = useState(false); // New state for AI error modal
  const [isSaving, setIsSaving] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const newOfflineStatus = !state.isConnected;
      if (newOfflineStatus !== isOffline) {
        setIsOffline(newOfflineStatus);
        addNotification({
          displayType: 'toast',
          style: newOfflineStatus ? 'warning' : 'success',
          message: newOfflineStatus ? 'You are now offline.' : 'You are back online!',
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOffline, addNotification]);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const activeScroller = useRef<'editor' | 'preview' | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (source: 'editor' | 'preview', percentage: number) => {
    if (activeScroller.current && activeScroller.current !== source) {
      return;
    }

    activeScroller.current = source;
    setScrollPercentage(percentage);

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      activeScroller.current = null;
    }, 150);
  };

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
      trackEvent('content_save', { type: 'manual' });
  const handleContentChange = (newContent: string) => {
    addChange(newContent);
    trackEvent('content_save', { type: 'autosave' });
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
    trackEvent('preview', { mode: isPreviewMode ? 'exit' : 'enter' });
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
    trackEvent('media_upload', { type: 'select_image', imageUri: imageUri });
  };

  const handleApplySuggestion = (suggestion: { id: string; message: string; confidence: 'high' | 'medium' | 'low' }) => {
    const newContent = currentContent + '\n\n' + `[AI Suggestion Applied: ${suggestion.message}]`;
    addChange(newContent);
    completeStep('Use an AI suggestion');
    trackEvent('ai_applied', { suggestionType: suggestion.id, confidence: suggestion.confidence });
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
        trackEvent('publish', { status: 'success' });
      } else {
        // Simulate conflict handling
        const { conflict } = { conflict: Math.random() > 0.5 }; // 50% chance of conflict
        if (conflict) {
          setIsConflictModalOpen(true); // Open conflict resolution modal
          addNotification({
            displayType: 'toast',
            style: 'warning',
            message: 'Publish conflict detected. Please resolve.',
          });
          trackEvent('publish', { status: 'failed', reason: 'conflict' });
        } else {
          addNotification({
            displayType: 'toast',
            style: 'error',
            message: 'Publish failed. Retry?',
          });
          trackEvent('publish', { status: 'failed', reason: 'unknown' });
        }
      }
      setIsPublishModalOpen(false);
    }, 2000);
  };

  const handleConflictResolution = (resolution: 'keep_mine' | 'keep_server' | 'merge', mergedContent?: string) => {
    setIsConflictModalOpen(false);
    if (resolution === 'keep_mine') {
      addNotification({ displayType: 'toast', style: 'info', message: 'Keeping your version.' });
      // Re-attempt publish with current content
      handleConfirmPublish();
    } else if (resolution === 'keep_server') {
      addNotification({ displayType: 'toast', style: 'info', message: 'Keeping server version.' });
      // In a real app, you would fetch the server content and update currentContent
      // For simulation, we'll just consider it resolved and re-attempt publish
      handleConfirmPublish();
    } else if (resolution === 'merge' && mergedContent) {
      addNotification({ displayType: 'toast', style: 'info', message: 'Merging content.' });
      addChange(mergedContent); // Apply merged content to editor
      handleConfirmPublish(); // Re-attempt publish with merged content
    }
  };

  const handleAISuggestionRequest = () => {
    addNotification({ displayType: 'toast', style: 'info', message: 'AI scan requested. Processing...' });
    // Simulate AI scan process
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        // Mock AI suggestions
        // For now, we'll just add a success notification
        addNotification({ displayType: 'toast', style: 'success', message: 'AI scan complete. Suggestions ready.' });
      } else {
        setIsAIErrorModalOpen(true); // Show AI error modal
        addNotification({ displayType: 'toast', style: 'error', message: 'AI scan failed.' });
      }
    }, 1500);
  };

  const handleRetryAIScan = () => {
    setIsAIErrorModalOpen(false);
    handleAISuggestionRequest(); // Re-trigger the AI scan
  };

  const runValidationChecks = (): string[] => {
    trackEvent('validation', { type: 'pre_publish' });
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
        isOffline={isOffline}
        testID="mobile-editor-toolbar"
        saveAccessibilityLabel="Save content"
        saveAccessibilityHint="Saves the current content draft"
        undoAccessibilityLabel="Undo last action"
        undoAccessibilityHint="Reverts the last change made to the content"
        redoAccessibilityLabel="Redo last action"
        redoAccessibilityHint="Re-applies the last undone change to the content"
        aiPanelAccessibilityLabel="Toggle AI Panel"
        aiPanelAccessibilityHint="Opens or closes the AI suggestions panel"
        previewAccessibilityLabel={isPreviewMode ? "Exit preview mode" : "Enter preview mode"}
        previewAccessibilityHint={isPreviewMode ? "Switch back to content editor" : "View live preview of content"}
        mediaLibraryAccessibilityLabel="Open Media Library"
        mediaLibraryAccessibilityHint="Access and manage your media assets"
        publishAccessibilityLabel="Publish content"
        publishAccessibilityHint="Publishes the current content to make it live"
      />
      <MobileBlockCanvas
        content={JSON.stringify(currentContent)}
        onContentChange={handleContentChange}
        panHandlers={panResponder.panHandlers}
        aiSuggestions={suggestions}
        onScroll={(p) => handleScroll('editor', p)}
        testID="mobile-block-canvas"
        accessibilityLabel="Content editor canvas"
        accessibilityHint="Double tap to edit a block, swipe left or right to undo or redo changes."
      />
      {/* PanResponder definition for swipe gestures */}
      {(() => {
        const panResponder = useRef(
          PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderRelease: (evt, gestureState) => {
              const swipeThreshold = 50; // Minimum horizontal swipe distance to trigger undo/redo
              if (gestureState.dx > swipeThreshold) {
                // Swiped right, perform redo
                redo();
                addNotification({ displayType: 'toast', style: 'info', message: 'Redo action performed.' });
                trackEvent('redo');
              } else if (gestureState.dx < -swipeThreshold) {
                // Swiped left, perform undo
                undo();
                addNotification({ displayType: 'toast', style: 'info', message: 'Undo action performed.' });
                trackEvent('undo');
              }
            },
          })
        ).current;
        return null; // PanResponder is attached to MobileBlockCanvas, no direct UI needed here
      })()}
      />
      {isAIPanelOpen && (
        <MobileAISuggestionsPanel
          onApplySuggestion={handleApplySuggestion}
          onDismissSuggestion={handleDismissSuggestion}
          onApplyAllSuggestions={handleApplyAllSuggestions}
          onRevertAllSuggestions={handleRevertAllSuggestions}
          testID="mobile-ai-panel"
          accessibilityLabel="AI Suggestions Panel"
          accessibilityHint="Displays AI-generated suggestions for content improvement."
        />
      )}
      {isPreviewMode && (
        <MobileLivePreviewPanel
          content={currentContent}
          onScroll={(p) => handleScroll('preview', p)}
          scrollPercentage={scrollPercentage}
          testID="mobile-live-preview-panel"
          accessibilityLabel="Live Preview Panel"
          accessibilityHint="Shows how your content will appear on different devices."
        />
      )}
      <MobileMediaLibrary
        isVisible={isMediaLibraryOpen}
        onClose={toggleMediaLibrary}
        onSelectImage={handleSelectImage}
        testID="mobile-media-library"
        accessibilityLabel="Media Library"
        accessibilityHint="Access and manage your images and other media assets."
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPublishModalOpen}
        onRequestClose={() => setIsPublishModalOpen(false)}
        testID="mobile-publish-confirmation-modal"
        accessibilityLabel="Publish Confirmation Dialog"
        accessibilityHint="Confirms if you want to publish your content."
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

      <AIErrorModal
        isVisible={isAIErrorModalOpen}
        onClose={() => setIsAIErrorModalOpen(false)}
        onRetry={handleRetryAIScan}
        accessibilityLabel="AI Error Dialog"
        accessibilityHint="An error occurred with the AI service. You can retry or dismiss."
      />
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