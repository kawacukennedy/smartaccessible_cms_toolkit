
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Switch, FlatList } from 'react-native';
import { MobileMediaProcessor, MediaFile, ProcessingOptions, BatchProcessingResult } from '../lib/mobileMediaProcessor';

const dummyImages: MediaFile[] = [
  { id: '1', uri: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Image1', type: 'image', size: 1024, name: 'Image1.jpg' },
  { id: '2', uri: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Image2', type: 'image', size: 2048, name: 'Image2.png' },
  { id: '3', uri: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Image3', type: 'image', size: 1536, name: 'Image3.gif' },
  { id: '4', uri: 'https://via.placeholder.com/150/FFFF00/000000?text=Image4', type: 'image', size: 2560, name: 'Image4.webp' },
  { id: '5', uri: 'https://via.placeholder.com/150/00FFFF/000000?text=Image5', type: 'image', size: 3072, name: 'Image5.jpg' },
  { id: '6', uri: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Image6', type: 'image', size: 3584, name: 'Image6.png' },
];

interface MobileMediaLibraryProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectImage: (imageUri: string, altText: string, metadata?: any) => void;
}

const MobileMediaLibrary: React.FC<MobileMediaLibraryProps> = ({ isVisible, onClose, onSelectImage }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedImages, setProcessedImages] = useState<MediaFile[]>([]);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    enableOCR: true,
    enableSmartTagging: true,
    generateAltText: true,
    validateFiles: true,
  });

  const simulateUpload = async () => {
    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    setUploading(false);
    Alert.alert('Upload Complete', 'Dummy images uploaded successfully!');
  };

  const processBatchImages = async () => {
    setProcessing(true);
    setProcessingProgress(0);

    try {
      const result: BatchProcessingResult = await MobileMediaProcessor.processBatch(
        dummyImages,
        processingOptions,
        (processed, total) => {
          setProcessingProgress(Math.round((processed / total) * 100));
        }
      );

      setProcessedImages(result.processed);
      MobileMediaProcessor.showProcessingAlert(result);

      if (result.failed.length > 0) {
        Alert.alert(
          'Processing Issues',
          `${result.failed.length} files failed to process. Check console for details.`
        );
      }
    } catch (error) {
      Alert.alert('Processing Error', 'Failed to process images. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleImageSelect = async (image: MediaFile) => {
    const altText = image.metadata?.altText || `Media file: ${image.name}`;
    onSelectImage(image.uri, altText, image.metadata);
  };

  const renderProcessingOptions = () => (
    <View style={styles.processingOptions}>
      <Text style={styles.sectionTitle}>Processing Options</Text>
      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>OCR Text Extraction</Text>
        <Switch
          value={processingOptions.enableOCR}
          onValueChange={(value) => setProcessingOptions(prev => ({ ...prev, enableOCR: value }))}
        />
      </View>
      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Smart Tagging</Text>
        <Switch
          value={processingOptions.enableSmartTagging}
          onValueChange={(value) => setProcessingOptions(prev => ({ ...prev, enableSmartTagging: value }))}
        />
      </View>
      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Generate Alt Text</Text>
        <Switch
          value={processingOptions.generateAltText}
          onValueChange={(value) => setProcessingOptions(prev => ({ ...prev, generateAltText: value }))}
        />
      </View>
      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Validate Files</Text>
        <Switch
          value={processingOptions.validateFiles}
          onValueChange={(value) => setProcessingOptions(prev => ({ ...prev, validateFiles: value }))}
        />
      </View>
    </View>
  );

  const renderImageItem = ({ item }: { item: MediaFile }) => (
    <TouchableOpacity style={styles.imageItem} onPress={() => handleImageSelect(item)}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <View style={styles.imageInfo}>
        <Text style={styles.imageName} numberOfLines={1}>{item.name}</Text>
        {item.metadata?.tags && (
          <Text style={styles.imageTags} numberOfLines={1}>
            Tags: {item.metadata.tags.join(', ')}
          </Text>
        )}
        {item.metadata?.ocrText && (
          <Text style={styles.imageOcr} numberOfLines={2}>
            OCR: {item.metadata.ocrText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Advanced Media Library</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderProcessingOptions()}

          <View style={styles.uploadSection}>
            <TouchableOpacity onPress={simulateUpload} style={styles.uploadButton} disabled={uploading}>
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.uploadButtonText}>Bulk Upload Images</Text>
              )}
            </TouchableOpacity>
            {uploading && (
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                <Text style={styles.progressText}>{uploadProgress}%</Text>
              </View>
            )}
          </View>

          <View style={styles.processingSection}>
            <TouchableOpacity
              onPress={processBatchImages}
              style={[styles.processButton, processing && styles.disabledButton]}
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.processButtonText}>Process All Images</Text>
              )}
            </TouchableOpacity>
            {processing && (
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${processingProgress}%` }]} />
                <Text style={styles.progressText}>{processingProgress}%</Text>
              </View>
            )}
          </View>

          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>
              {processedImages.length > 0 ? 'Processed Images' : 'Available Images'}
            </Text>
            <FlatList
              data={processedImages.length > 0 ? processedImages : dummyImages}
              renderItem={renderImageItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.imageGrid}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007BFF',
  },
  processingOptions: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: 16,
    flex: 1,
  },
  uploadSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  processingSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  processButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  progressBarContainer: {
    width: '100%',
    height: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 12,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  },
  imageSection: {
    padding: 15,
  },
  imageGrid: {
    paddingBottom: 20,
  },
  imageItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    maxWidth: '48%',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
  },
  imageInfo: {
    flex: 1,
  },
  imageName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  imageTags: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  imageOcr: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default MobileMediaLibrary;
