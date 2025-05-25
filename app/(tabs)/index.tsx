import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { Share2, Download, Sparkles, Ratio as AspectRatio } from 'lucide-react-native';
import { generateImage, aspectRatios } from '@/utils/imageApi';
import { saveImage } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Easing from 'react-native-reanimated';

export default function CreateScreen() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('1:1');
  const { width } = useWindowDimensions();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.7],
  });
  
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const imageUrl = await generateImage(prompt, selectedAspectRatio);
      setGeneratedImage(imageUrl);
      // Save to history
      saveImage({ prompt, imageUrl, timestamp: new Date().toISOString() });
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (Platform.OS === 'web') {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `ai-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Download feature coming soon for mobile platforms');
    }
  };

  const handleShare = async () => {
    if (Platform.OS !== 'web') {
      alert('Share feature coming soon');
    } else {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'AI Generated Image',
            text: `AI image generated with prompt: ${prompt}`,
            url: generatedImage,
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      } else {
        navigator.clipboard.writeText(generatedImage);
        alert('Image URL copied to clipboard!');
      }
    }
  };

  const imageWidth = width > 600 ? 500 : width - 40;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['rgba(157, 78, 221, 0.05)', 'rgba(6, 182, 212, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />
        <Text style={styles.title}>Create AI Images</Text>
        <Text style={styles.subtitle}>Transform your ideas into stunning visuals</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Animated.View 
            style={[
              styles.inputGlow,
              { 
                opacity: glowOpacity,
                backgroundColor: prompt ? 'rgba(157, 78, 221, 0.15)' : 'rgba(157, 78, 221, 0.05)',
              }
            ]} 
          />
          <TextInput
            style={styles.input}
            placeholder="Describe the image you want to create..."
            placeholderTextColor="#888888"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            maxLength={500}
          />
        </View>

        <View style={styles.aspectRatioContainer}>
          <View style={styles.aspectRatioHeader}>
            <AspectRatio size={20} color="#ffffff" />
            <Text style={styles.aspectRatioTitle}>Aspect Ratio</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.aspectRatioList}>
            {aspectRatios.map((ratio) => (
              <TouchableOpacity
                key={ratio.value}
                style={[
                  styles.aspectRatioButton,
                  selectedAspectRatio === ratio.value && styles.aspectRatioButtonSelected,
                ]}
                onPress={() => setSelectedAspectRatio(ratio.value)}>
                <Text
                  style={[
                    styles.aspectRatioButtonText,
                    selectedAspectRatio === ratio.value && styles.aspectRatioButtonTextSelected,
                  ]}>
                  {ratio.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Animated.View
          style={[
            styles.generateButtonContainer,
            { transform: [{ scale: isLoading ? 1 : pulseAnim }] },
          ]}>
          <LinearGradient
            colors={['#9d4edd', '#6930c3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.generateButton}>
            <TouchableOpacity
              style={styles.generateButtonTouchable}
              onPress={handleGenerateImage}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Sparkles size={20} color="#ffffff" style={styles.buttonIcon} />
                  <Text style={styles.generateButtonText}>Generate Image</Text>
                </>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {generatedImage ? (
          <View style={[styles.resultContainer, { width: imageWidth }]}>
            <Image
              source={{ uri: generatedImage }}
              style={[styles.generatedImage, { width: imageWidth, height: imageWidth }]}
              resizeMode="contain"
            />
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
                <Download size={20} color="#ffffff" />
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share2 size={20} color="#ffffff" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    maxWidth: 300,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 20,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    zIndex: 1,
  },
  aspectRatioContainer: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 20,
  },
  aspectRatioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aspectRatioTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  aspectRatioList: {
    paddingVertical: 4,
  },
  aspectRatioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e1e1e',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  aspectRatioButtonSelected: {
    backgroundColor: '#9d4edd',
    borderColor: '#9d4edd',
  },
  aspectRatioButtonText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  aspectRatioButtonTextSelected: {
    color: '#ffffff',
  },
  generateButtonContainer: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 30,
    overflow: 'hidden',
    borderRadius: 12,
  },
  generateButton: {
    borderRadius: 12,
  },
  generateButtonTouchable: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: 8,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
  },
  generatedImage: {
    aspectRatio: 1,
    backgroundColor: '#0f0f0f',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});