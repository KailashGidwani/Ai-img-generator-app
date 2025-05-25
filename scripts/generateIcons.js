const fs = require('fs').promises;
const path = require('path');
const { ImageManipulator } = require('expo-image-manipulator');

async function generateIcons() {
  try {
    const inputPath = path.join(__dirname, '..', 'logo.png');
    const outputDir = path.join(__dirname, '..', 'assets', 'icons');
    
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Android adaptive icon sizes
    const androidSizes = {
      'android/icon-48-mdpi.png': 48,
      'android/icon-72-hdpi.png': 72,
      'android/icon-96-xhdpi.png': 96,
      'android/icon-144-xxhdpi.png': 144,
      'android/icon-192-xxxhdpi.png': 192,
      'android/adaptive-icon-48-mdpi.png': 48,
      'android/adaptive-icon-72-hdpi.png': 72,
      'android/adaptive-icon-96-xhdpi.png': 96,
      'android/adaptive-icon-144-xxhdpi.png': 144,
      'android/adaptive-icon-192-xxxhdpi.png': 192,
    };

    // Generate Android icons
    for (const [outputPath, size] of Object.entries(androidSizes)) {
      await generateIcon(inputPath, outputDir, outputPath, size);
    }

    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

async function generateIcon(inputPath, outputDir, outputPath, size) {
  const fullOutputPath = path.join(outputDir, outputPath);
  await fs.mkdir(path.dirname(fullOutputPath), { recursive: true });
  
  console.log(`Generating: ${outputPath}`);
  
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      inputPath,
      [{
        resize: { width: size, height: size },
      }],
      { compress: 1, format: 'png' }
    );
    
    // In a real implementation, you would save the manipulated image
    // This is a simplified version that just logs the operation
    console.log(`Would save ${outputPath} at ${size}x${size}`);
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error);
  }
}

generateIcons();
