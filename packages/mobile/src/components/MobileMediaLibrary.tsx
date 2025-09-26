
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';

const dummyImages = [
  { id: 1, uri: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Image1', alt: 'Red placeholder image' },
  { id: 2, uri: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Image2', alt: 'Green placeholder image' },
  { id: 3, uri: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Image3', alt: 'Blue placeholder image' },
  { id: 4, uri: 'https://via.placeholder.com/150/FFFF00/000000?text=Image4', alt: 'Yellow placeholder image' },
  { id: 5, uri: 'https://via.placeholder.com/150/00FFFF/000000?text=Image5', alt: 'Cyan placeholder image' },
  { id: 6, uri: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Image6', alt: 'Magenta placeholder image' },
];

interface MobileMediaLibraryProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectImage: (imageUri: string, altText: string) => void;
}

const MobileMediaLibrary: React.FC<MobileMediaLibraryProps> = ({ isVisible, onClose, onSelectImage }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const generateAIAltText = async (imageUri: string): Promise<string> => {
    // Simulate AI alt text generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `AI generated alt text for ${imageUri.split('=')[1] || 'image'}`;
  };

  const handleImageSelect = async (imageUri: string) => {
    const altText = await generateAIAltText(imageUri);
    onSelectImage(imageUri, altText);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Media Library</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadSection}>
          <TouchableOpacity onPress={simulateUpload} style={styles.uploadButton} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>Bulk Upload Dummy Images</Text>
            )}
          </TouchableOpacity>
          {uploading && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
              <Text style={styles.progressText}>{uploadProgress}%</Text>
            </View>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.imageList}>
          {dummyImages.map(image => (
            <TouchableOpacity key={image.id} onPress={() => handleImageSelect(image.uri)}>
              <Image source={{ uri: image.uri }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007BFF',
  },
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
  uploadSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
});

export default MobileMediaLibrary;
