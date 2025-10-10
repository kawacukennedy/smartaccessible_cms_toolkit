import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface MobileBlockCanvasProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useOnboarding } from '../contexts/OnboardingContext';
import { AISuggestion } from '../lib/mobileAIService';

const highlightContent = (content: string, aiSuggestions: AISuggestion[]) => {
  let highlightedContent: (string | JSX.Element)[] = [content];

  aiSuggestions.forEach(suggestion => {
    const newHighlightedContent: (string | JSX.Element)[] = [];
    highlightedContent.forEach(segment => {
      if (typeof segment === 'string') {
        const parts = segment.split(new RegExp(`(${suggestion.message})`, 'gi'));
        parts.forEach((part, index) => {
          if (part.toLowerCase() === suggestion.message.toLowerCase()) {
            newHighlightedContent.push(
              <Text key={`${suggestion.id}-${index}`} style={styles.aiHighlight}>
                {part}
              </Text>
            );
          } else {
            newHighlightedContent.push(part);
          }
        });
      } else {
        newHighlightedContent.push(segment);
      }
    });
    highlightedContent = newHighlightedContent;
  });

  return highlightedContent;
};

interface Block {
  id: string;
  type: 'text' | 'image' | 'header';
  content: string;
  alt?: string; // Optional alt text for image blocks
}

interface MobileBlockCanvasProps {
  content: string;
  onContentChange: (newContent: string) => void;
  panHandlers?: any;
  aiSuggestions: AISuggestion[];
  onScroll?: (percentage: number) => void;
}

const MobileBlockCanvas: React.FC<MobileBlockCanvasProps> = ({
  content,
  onContentChange,
  panHandlers,
  aiSuggestions,
  onScroll
}) => {
  const { completeStep } = useOnboarding();
  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      return JSON.parse(content) || [];
    } catch (e) {
      return [];
    }
  });
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  const handleScroll = (event: any) => {
    if (onScroll) {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const percentage = contentOffset.y / (contentSize.height - layoutMeasurement.height);
      onScroll(percentage);
    }
  };

  const handleSaveEdit = () => {
    if (editingBlockId) {
      const newBlocks = blocks.map(block =>
        block.id === editingBlockId ? { ...block, content: editedContent } : block
      );
      setBlocks(newBlocks);
      onContentChange(JSON.stringify(newBlocks));
      setEditingBlockId(null);
      if (newBlocks.length > 0) {
        completeStep('Create your first block');
      }
    }
  };

  const addNewBlock = (type: 'text' | 'header' = 'text') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'header' ? 'New Header' : 'New text block...'
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    onContentChange(JSON.stringify(newBlocks));
    setEditingBlockId(newBlock.id);
    setEditedContent(newBlock.content);
  };

  const deleteBlock = (blockId: string) => {
    const newBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(newBlocks);
    onContentChange(JSON.stringify(newBlocks));
  };

  const renderBlock = (block: Block) => {
    if (editingBlockId === block.id) {
      return (
        <View style={styles.editingBlock}>
          <TextInput
            style={styles.textInput}
            multiline
            value={editedContent}
            onChangeText={setEditedContent}
            onBlur={handleSaveEdit}
            autoFocus
            placeholder="Enter your content..."
          />
          <View style={styles.editActions}>
            <TouchableOpacity onPress={handleSaveEdit} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingBlockId(null)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.blockContainer}>
        <TouchableOpacity
          style={styles.blockContent}
          onPress={() => {
            setEditingBlockId(block.id);
            setEditedContent(block.content);
          }}
          onLongPress={() => deleteBlock(block.id)}
        >
          {block.type === 'header' && (
            <Text style={styles.headerText}>
              {highlightContent(block.content, aiSuggestions)}
            </Text>
          )}
          {block.type === 'image' && (
            <View>
              <Image source={{ uri: block.content }} style={styles.image} accessibilityLabel={block.alt} />
              {block.alt && <Text style={styles.altText}>Alt: {block.alt}</Text>}
            </View>
          )}
          {block.type === 'text' && (
            <Text style={styles.contentText}>
              {highlightContent(block.content, aiSuggestions)}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.blockActions}>
          <TouchableOpacity onPress={() => addNewBlock('text')} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Text</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addNewBlock('header')} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Header</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container} {...panHandlers}>
      <ScrollView style={styles.scrollView} onScroll={handleScroll} scrollEventThrottle={16}>
        {blocks.map(block => (
          <View key={block.id}>
            {renderBlock(block)}
          </View>
        ))}
        {blocks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Tap to start creating content</Text>
            <View style={styles.emptyActions}>
              <TouchableOpacity onPress={() => addNewBlock('header')} style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Add Header</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addNewBlock('text')} style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Add Text</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 10,
  },
  emptyButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  blockContainer: {
    margin: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  blockContent: {
    padding: 15,
    minHeight: 60,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 6,
    marginVertical: 8,
  },
  altText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  editingBlock: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 8,
    margin: 10,
  },
  textInput: {
    fontSize: 16,
    padding: 15,
    textAlignVertical: 'top',
    minHeight: 100,
    color: '#333',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  blockActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#e9ecef',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  aiHighlight: {
    backgroundColor: '#fff3cd',
    borderBottomWidth: 2,
    borderBottomColor: '#ffc107',
    fontWeight: '600',
  },
});

export default MobileBlockCanvas;
