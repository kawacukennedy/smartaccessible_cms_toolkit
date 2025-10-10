import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import TextEditor from '../components/content-editor/TextEditor';
import SEOPanel from '../components/content-editor/SEOPanel';
import MediaUploader from '../components/content-editor/MediaUploader';
import { MobileContentEditor, ContentDocument, ContentBlock, MediaFile } from '../lib/mobileContentEditor';

const AdvancedContentEditorScreen: React.FC = () => {
  const { theme } = useTheme();
  const [currentDocument, setCurrentDocument] = useState<ContentDocument | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const containerStyle = theme === 'dark' ? darkStyles.container : lightStyles.container;
  const headerStyle = theme === 'dark' ? darkStyles.header : lightStyles.header;
  const titleStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };

  useEffect(() => {
    loadOrCreateDocument();
  }, []);

  const loadOrCreateDocument = async () => {
    try {
      setIsLoading(true);
      // Try to load existing document or create new one
      const documents = await MobileContentEditor.getAllDocuments();
      let document: ContentDocument;

      if (documents.length > 0) {
        // Load the most recent document
        document = documents[0];
      } else {
        // Create a new document
        document = await MobileContentEditor.createDocument('New Document', 'User');
      }

      setCurrentDocument(document);
      setDocumentTitle(document.title);
      setDocumentContent(document.blocks.map(block => block.content).join('\n\n'));
      setSeoTitle(document.metadata.seo.title);
      setSeoDescription(document.metadata.seo.description);
      setSeoKeywords(document.metadata.seo.keywords);
      setWordCount(document.blocks.reduce((count, block) => count + block.content.split(/\s+/).length, 0));
    } catch (error) {
      console.error('Error loading document:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Error Loading Document', `Failed to load document: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!currentDocument) {
      Alert.alert('Error', 'No document to save');
      return;
    }

    if (!documentTitle.trim()) {
      Alert.alert('Error', 'Document title is required');
      return;
    }

    setIsSaving(true);
    try {
      // Update document with current state
      const updatedBlocks: ContentBlock[] = documentContent
        .split('\n\n')
        .filter(content => content.trim())
        .map((content, index) => ({
          id: currentDocument.blocks[index]?.id || MobileContentEditor.generateId(),
          type: 'text' as const,
          content: content.trim(),
        }));

      const updatedDocument: ContentDocument = {
        ...currentDocument,
        title: documentTitle.trim(),
        blocks: updatedBlocks,
        metadata: {
          ...currentDocument.metadata,
          seo: {
            title: seoTitle,
            description: seoDescription,
            keywords: seoKeywords,
            canonicalUrl: currentDocument.metadata.seo.canonicalUrl,
          },
        },
      };

      await MobileContentEditor.saveDocument(updatedDocument);
      setCurrentDocument(updatedDocument);

      Alert.alert('Success', 'Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      Alert.alert('Error', 'Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaSelect = useCallback((media: MediaFile) => {
    try {
      if (!currentDocument) {
        Alert.alert('Error', 'No document loaded to add media to');
        return;
      }

      // Add media to document content
      const mediaBlock: ContentBlock = {
        id: MobileContentEditor.generateId(),
        type: media.type,
        content: media.uri,
        metadata: {
          alt: media.name,
          url: media.uri,
        },
      };

      const updatedDocument = MobileContentEditor.addBlock(currentDocument, mediaBlock);
      setCurrentDocument(updatedDocument);
      // Update content display
      setDocumentContent(prev => prev + `\n\n[${media.type.toUpperCase()}: ${media.name}]`);
    } catch (error) {
      console.error('Error adding media to document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add media';
      Alert.alert('Error', errorMessage);
    }
  }, [currentDocument]);

  const handleCreateNewDocument = async () => {
    try {
      const newDocument = await MobileContentEditor.createDocument('New Document', 'User');
      setCurrentDocument(newDocument);
      setDocumentTitle(newDocument.title);
      setDocumentContent('');
      setSeoTitle(newDocument.metadata.seo.title);
      setSeoDescription(newDocument.metadata.seo.description);
      setSeoKeywords(newDocument.metadata.seo.keywords);
      setWordCount(0);
      Alert.alert('Success', 'New document created!');
    } catch (error) {
      console.error('Error creating document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create new document';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleContentChange = (content: string) => {
    setDocumentContent(content);
    const count = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(count);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, containerStyle]}>
        <Text style={titleStyle}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.header, headerStyle]}>
        <Text style={[styles.title, titleStyle]}>Advanced Content Editor</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: '#28a745' }]}
            onPress={handleCreateNewDocument}
          >
            <Text style={styles.headerButtonText}>New</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: '#007bff' }, isSaving && styles.disabledButton]}
            onPress={handleSaveDocument}
            disabled={isSaving}
          >
            <Text style={styles.headerButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, titleStyle]}>Document Details</Text>
          <TextEditor
            value={documentTitle}
            onChangeText={setDocumentTitle}
            placeholder="Enter document title..."
            showToolbar={false}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, titleStyle]}>Content</Text>
            <Text style={[styles.wordCount, titleStyle]}>{wordCount} words</Text>
          </View>
          <TextEditor
            value={documentContent}
            onChangeText={handleContentChange}
            placeholder="Start writing your content here..."
            showToolbar={true}
          />
        </View>

        <View style={styles.section}>
          <SEOPanel
            title={seoTitle}
            description={seoDescription}
            keywords={seoKeywords}
            content={documentContent}
            onTitleChange={setSeoTitle}
            onDescriptionChange={setSeoDescription}
            onKeywordsChange={setSeoKeywords}
          />
        </View>

        <View style={styles.section}>
          <MediaUploader
            onMediaSelect={handleMediaSelect}
            maxFiles={10}
            allowedTypes={['image', 'video']}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomColor: '#dee2e6',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#212529',
  },
  header: {
    backgroundColor: '#343a40',
    borderBottomColor: '#495057',
  },
});

export default AdvancedContentEditorScreen;