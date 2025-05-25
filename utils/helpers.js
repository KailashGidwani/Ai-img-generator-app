/**
 * Helper utilities for the application
 */

/**
 * Format a date string into a human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Get current date for comparison
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    // Format as today, yesterday, or specific date
    if (isSameDay(date, now)) {
      return `Today at ${formatTime(date)}`;
    } else if (isSameDay(date, yesterday)) {
      return `Yesterday at ${formatTime(date)}`;
    } else {
      // Format as Month Day, Year
      return `${date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      })}`;
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} - True if dates are the same day
 */
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Format time to hours and minutes
 * @param {Date} date - Date object
 * @returns {string} - Formatted time string
 */
const formatTime = (date) => {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate a random placeholder prompt
 * @returns {string} - Random placeholder prompt
 */
export const getRandomPlaceholder = () => {
  const placeholders = [
    'A serene landscape with mountains and a lake at sunset',
    'Futuristic cityscape with flying cars and neon lights',
    'Abstract digital art with vibrant colors and geometric shapes',
    'A cute robot in a garden of alien flowers',
    'Photorealistic portrait of a dragon with human eyes',
    'Fantasy castle floating among clouds',
    'Underwater scene with bioluminescent creatures',
  ];
  
  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

/**
 * Check if the device is in portrait orientation
 * @param {Object} dimensions - Window dimensions
 * @returns {boolean} - True if in portrait orientation
 */
export const isPortrait = (dimensions) => {
  return dimensions.height > dimensions.width;
};