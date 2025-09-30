import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface MobileBlockCanvasProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AISuggestion } from '@/types/ai-suggestion'; // Import AISuggestion type

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
              <Text key={`${suggestion.id}-${index}`} style={styles.aiHighlight} accessibilityLabel={suggestion.recommendation}>
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
  panHandlers?: any; // Add panHandlers prop
  aiSuggestions: AISuggestion[]; // New prop for AI suggestions
  onScroll?: (percentage: number) => void; // New prop for scroll synchronization
}

const MobileBlockCanvas: React.FC<MobileBlockCanvasProps> = ({ content, onContentChange, panHandlers, aiSuggestions, onScroll }) => {
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

  const renderBlock = (block: Block) => {
    if (editingBlockId === block.id) {
      return (
        <TextInput
          style={styles.textInput}
          multiline
          value={editedContent}
          onChangeText={setEditedContent}
          onBlur={handleSaveEdit}
          autoFocus
        />
      );
    }

    switch (block.type) {
      case 'header':
        return <Text style={styles.headerText}>{highlightContent(block.content, aiSuggestions)}</Text>;
      case 'image':
        return (
          <View>
            <Image source={{ uri: block.content }} style={styles.image} accessibilityLabel={block.alt} />
            {block.alt && <Text style={styles.altText}>Alt: {block.alt}</Text>}
          </View>
        );
      default:
        return <Text style={styles.contentText}>{highlightContent(block.content, aiSuggestions)}</Text>;
    }
  };

  return (
    <View style={styles.container} {...panHandlers}>
      <ScrollView style={styles.scrollView} onScroll={handleScroll} scrollEventThrottle={16}>
        {blocks.map(block => (
          <TouchableOpacity key={block.id} onPress={() => {
            setEditingBlockId(block.id);
            setEditedContent(block.content);
          }}>
            {renderBlock(block)}
          </TouchableOpacity>
        ))}
        {blocks.length === 0 && (
          <TouchableOpacity onPress={() => {
            const newBlock: Block = { id: Date.now().toString(), type: 'text', content: 'Tap to add content...' };
            setBlocks([newBlock]);
            setEditingBlockId(newBlock.id);
            setEditedContent(newBlock.content);
          }}>
            <Text style={styles.contentText}>Tap to add content...</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentDisplay: {
    minHeight: 100,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#333',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  altText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
  },
  aiHighlight: {
    backgroundColor: 'yellow',
    fontWeight: 'bold',
  },
});

export default MobileBlockCanvas;
