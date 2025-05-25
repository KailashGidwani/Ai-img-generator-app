/**
 * Storage utilities for managing generated images
 */

// Mock storage since we're using in-memory storage for this demo
// In a real app, this would use AsyncStorage, localStorage, or a database
let imageStore = [];

/**
 * Save a generated image to storage
 * @param {Object} imageData - The image data to save
 * @param {string} imageData.prompt - The prompt used to generate the image
 * @param {string} imageData.imageUrl - The URL of the generated image
 * @param {string} imageData.timestamp - The timestamp when the image was generated
 * @returns {Promise<Object>} - A promise that resolves to the saved image object
 */
export const saveImage = async (imageData) => {
  const id = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const newImage = {
    id,
    ...imageData,
  };
  
  imageStore.push(newImage);
  
  // In a real app, we would persist this to AsyncStorage or a database
  // For web, we could use localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const existingImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
      existingImages.push(newImage);
      localStorage.setItem('generatedImages', JSON.stringify(existingImages));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  return newImage;
};

/**
 * Get all saved images
 * @returns {Promise<Array>} - A promise that resolves to an array of saved images
 */
export const getImages = async () => {
  // Try to load from localStorage if available (for web)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedImages = localStorage.getItem('generatedImages');
      if (storedImages) {
        imageStore = JSON.parse(storedImages);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }
  
  return imageStore;
};

/**
 * Delete a specific image by ID
 * @param {string} id - The ID of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (id) => {
  imageStore = imageStore.filter(image => image.id !== id);
  
  // Update localStorage if available
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('generatedImages', JSON.stringify(imageStore));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }
};

/**
 * Clear all saved images
 * @returns {Promise<void>}
 */
export const clearAllImages = async () => {
  imageStore = [];
  
  // Clear localStorage if available
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem('generatedImages');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};