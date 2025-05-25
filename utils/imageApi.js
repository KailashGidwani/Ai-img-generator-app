/**
 * API utilities for generating images using Pollinations API
 */

/**
 * Generates an image using the Pollinations.ai API based on a text prompt
 * @param {string} prompt - The text prompt to generate an image from
 * @param {string} aspectRatio - The desired aspect ratio for the image
 * @returns {Promise<string>} - A promise that resolves to the URL of the generated image
 */
export const generateImage = async (prompt, aspectRatio = '1:1') => {
  try {
    // Encode the prompt for URL safety
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Calculate dimensions based on aspect ratio
    const [width, height] = getImageDimensions(aspectRatio);
    
    // Use Pollinations.ai API for image generation with nologo=true
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&width=${width}&height=${height}`;
    
    // In a real app, we would check if the image generation was successful
    // For now, we'll simulate a delay to mimic the API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
};

/**
 * Calculate image dimensions based on aspect ratio
 * @param {string} aspectRatio - Aspect ratio in format "width:height"
 * @returns {[number, number]} - Width and height
 */
const getImageDimensions = (aspectRatio) => {
  const [w, h] = aspectRatio.split(':').map(Number);
  const baseSize = 512; // Base size for the smaller dimension
  
  if (w > h) {
    return [baseSize * (w/h), baseSize];
  } else {
    return [baseSize, baseSize * (h/w)];
  }
};

/**
 * Available aspect ratios for image generation
 */
export const aspectRatios = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Portrait (3:4)', value: '3:4' },
  { label: 'Landscape (4:3)', value: '4:3' },
  { label: 'Wide (16:9)', value: '16:9' },
  { label: 'Tall (9:16)', value: '9:16' },
];

/**
 * Gets information about available image generation models
 * @returns {Promise<Array>} - A promise that resolves to an array of available models
 */
export const getAvailableModels = async () => {
  // This would normally fetch from an API
  // For now, return some mock data
  return [
    { id: 'default', name: 'Standard', description: 'Balanced quality and speed' },
    { id: 'highQuality', name: 'High Quality', description: 'Best quality, slower generation' },
    { id: 'fast', name: 'Fast', description: 'Quick generation, lower quality' },
  ];
};

/**
 * Helper function to build a more complex prompt with additional parameters
 * @param {Object} params - Parameters for the prompt
 * @returns {string} - The formatted prompt string
 */
export const buildAdvancedPrompt = (params) => {
  const { prompt, style, mood, lighting } = params;
  
  let advancedPrompt = prompt;
  
  if (style) {
    advancedPrompt += `, ${style} style`;
  }
  
  if (mood) {
    advancedPrompt += `, ${mood} mood`;
  }
  
  if (lighting) {
    advancedPrompt += `, ${lighting} lighting`;
  }
  
  return advancedPrompt;
};