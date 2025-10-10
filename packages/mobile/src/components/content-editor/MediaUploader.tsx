import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';

interface MediaFile {
  id: string;
  uri: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  width?: number;
  height?: number;
}

interface MediaUploaderProps {
  onMediaSelect?: (media: MediaFile) => void;
  maxFiles?: number;
  allowedTypes?: ('image' | 'video')[];
}

const MediaUploader: React.FC<MediaUploaderProps> = React.memo(({
  onMediaSelect,
  maxFiles = 10,
  allowedTypes = ['image', 'video'],
}) => {
  const { theme } = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const buttonStyle = theme === 'dark' ? darkStyles.button : lightStyles.button;
  const buttonTextStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };
  const cardStyle = theme === 'dark' ? darkStyles.card : lightStyles.card;
  const textStyle = theme === 'dark' ? { color: '#fff' } : { color: '#000' };

  const requestPermissions = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Media library access is required to upload files.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  }, []);

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allowedTypes.includes('video')
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: maxFiles - uploadedFiles.length,
      });

      if (!result.canceled && result.assets) {
        await processSelectedMedia(result.assets);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access media library');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera access is required to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        await processSelectedMedia(result.assets);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access camera');
    }
  };

  const processSelectedMedia = async (assets: ImagePicker.ImagePickerAsset[]) => {
    setIsUploading(true);

    try {
      const newFiles: MediaFile[] = [];

      for (const asset of assets) {
        if (uploadedFiles.length + newFiles.length >= maxFiles) {
          Alert.alert('Limit Reached', `Maximum ${maxFiles} files allowed.`);
          break;
        }

        const file: MediaFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          name: asset.fileName || `file_${Date.now()}.${asset.uri.split('.').pop()}`,
          size: asset.fileSize || 0,
          width: asset.width,
          height: asset.height,
        };

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
          Alert.alert('File Too Large', `${file.name} is too large. Maximum size is 50MB.`);
          continue;
        }

        newFiles.push(file);
      }

      if (newFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...newFiles]);

        // Call onMediaSelect for each new file
        newFiles.forEach(file => onMediaSelect?.(file));

        Alert.alert('Success', `Uploaded ${newFiles.length} file(s) successfully!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process selected media');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderFileItem = ({ item }: { item: MediaFile }) => (
    <View style={[styles.fileItem, cardStyle]}>
      {item.type === 'image' ? (
        <Image source={{ uri: item.uri }} style={styles.fileThumbnail} />
      ) : (
        <View style={[styles.videoPlaceholder, { backgroundColor: theme === 'dark' ? '#495057' : '#e9ecef' }]}>
          <Text style={styles.videoIcon}>🎥</Text>
        </View>
      )}

      <View style={styles.fileInfo}>
        <Text style={[styles.fileName, textStyle]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.fileSize, textStyle]}>
          {formatFileSize(item.size)}
        </Text>
        {item.width && item.height && (
          <Text style={[styles.fileDimensions, textStyle]}>
            {item.width} × {item.height}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFile(item.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, textStyle]}>Media Library</Text>

      <View style={styles.uploadButtons}>
        <TouchableOpacity
          style={[styles.uploadButton, buttonStyle]}
          onPress={pickFromGallery}
          disabled={isUploading}
        >
          <Text style={[styles.buttonText, buttonTextStyle]}>
            📁 Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadButton, buttonStyle]}
          onPress={takePhoto}
          disabled={isUploading}
        >
          <Text style={[styles.buttonText, buttonTextStyle]}>
            📷 Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadButton, buttonStyle]}
          onPress={() => setShowGallery(true)}
          disabled={uploadedFiles.length === 0}
        >
          <Text style={[styles.buttonText, buttonTextStyle]}>
            🖼️ View ({uploadedFiles.length})
          </Text>
        </TouchableOpacity>
      </View>

      {isUploading && (
        <View style={styles.uploadingIndicator}>
          <ActivityIndicator size="small" color={theme === 'dark' ? '#fff' : '#007bff'} />
          <Text style={[styles.uploadingText, textStyle]}>Processing media...</Text>
        </View>
      )}

      {uploadedFiles.length > 0 && (
        <View style={styles.filesSummary}>
          <Text style={[styles.summaryText, textStyle]}>
            {uploadedFiles.length} file(s) uploaded
          </Text>
        </View>
      )}

      {/* Gallery Modal */}
      <Modal
        visible={showGallery}
        animationType="slide"
        onRequestClose={() => setShowGallery(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme === 'dark' ? '#212529' : '#f8f9fa' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, textStyle]}>Media Gallery</Text>
            <TouchableOpacity onPress={() => setShowGallery(false)}>
              <Text style={[styles.closeButton, textStyle]}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={uploadedFiles}
            renderItem={renderFileItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.filesList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  uploadButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  uploadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
  },
  uploadingText: {
    marginLeft: 10,
    fontSize: 14,
  },
  filesSummary: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filesList: {
    padding: 15,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  fileThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  videoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoIcon: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  fileDimensions: {
    fontSize: 12,
    opacity: 0.7,
  },
  removeButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#dc3545',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const lightStyles = StyleSheet.create({
  button: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

const darkStyles = StyleSheet.create({
  button: {
    backgroundColor: '#555',
    borderColor: '#777',
  },
  card: {
    backgroundColor: '#343a40',
    borderWidth: 1,
    borderColor: '#495057',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default MediaUploader;
