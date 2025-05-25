import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import { Trash2, Download } from 'lucide-react-native';
import { getImages, deleteImage } from '@/utils/storage';
import { formatDate } from '@/utils/helpers';
import { LinearGradient } from 'expo-linear-gradient';

export default function HistoryScreen() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { width } = useWindowDimensions();
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    loadImages();
  }, []);
  
  useEffect(() => {
    if (selectedImage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.cubic,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [selectedImage]);

  const loadImages = async () => {
    const savedImages = await getImages();
    setImages(savedImages.reverse()); // Most recent first
  };

  const handleImagePress = (image) => {
    setSelectedImage(selectedImage?.id === image.id ? null : image);
  };

  const handleDeleteImage = async (id) => {
    await deleteImage(id);
    setSelectedImage(null);
    loadImages();
  };

  const handleDownload = (imageUrl) => {
    if (Platform.OS === 'web') {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `ai-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Download feature coming soon for mobile platforms');
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedImage?.id === item.id;
    const itemWidth = width > 600 ? width / 3 - 20 : width / 2 - 24;
    
    return (
      <TouchableOpacity
        style={[
          styles.imageCard,
          { width: itemWidth, height: itemWidth * 1.2 },
          isSelected && styles.selectedCard,
        ]}
        onPress={() => handleImagePress(item)}
        activeOpacity={0.9}>
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
        <View style={styles.cardOverlay}>
          <Text style={styles.promptText} numberOfLines={2}>
            {item.prompt}
          </Text>
          <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
        </View>
        
        {isSelected && (
          <Animated.View style={[styles.imageActions, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDownload(item.imageUrl)}>
              <Download size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteImage(item.id)}>
              <Trash2 size={20} color="#ffffff" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(157, 78, 221, 0.1)', 'rgba(6, 182, 212, 0.05)', 'rgba(6, 182, 212, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradientBackground}
      />
      
      {images.length > 0 ? (
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={width > 600 ? 3 : 2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Images Yet</Text>
          <Text style={styles.emptyText}>
            Generated images will appear here. Head to the Create tab to make your first image!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  gridContainer: {
    padding: 12,
  },
  imageCard: {
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#9d4edd',
  },
  thumbnail: {
    width: '100%',
    height: '70%',
    backgroundColor: '#0f0f0f',
  },
  cardOverlay: {
    padding: 10,
    height: '30%',
    justifyContent: 'space-between',
  },
  promptText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    color: '#888888',
    fontSize: 10,
  },
  imageActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 4,
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    maxWidth: 300,
  },
});