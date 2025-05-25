import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Trash2, Info, ExternalLink } from 'lucide-react-native';
import { clearAllImages } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleClearHistory = async () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      return;
    }
    
    await clearAllImages();
    setClearConfirm(false);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // This would normally save to app settings
  };

  const handleToggleHighQuality = () => {
    setHighQuality(!highQuality);
    // This would normally save to app settings
  };

  const handleToggleAutoSave = () => {
    setAutoSave(!autoSave);
    // This would normally save to app settings
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://example.com/terms');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['rgba(157, 78, 221, 0.1)', 'rgba(6, 182, 212, 0.05)', 'rgba(6, 182, 212, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradientBackground}
      />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={handleToggleDarkMode}
            trackColor={{ false: '#444', true: '#9d4edd' }}
            thumbColor={darkMode ? '#ffffff' : '#f0f0f0'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image Generation</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>High Quality Images</Text>
          <Switch
            value={highQuality}
            onValueChange={handleToggleHighQuality}
            trackColor={{ false: '#444', true: '#9d4edd' }}
            thumbColor={highQuality ? '#ffffff' : '#f0f0f0'}
          />
        </View>
        <Text style={styles.settingDescription}>
          Higher quality images take longer to generate but provide better results.
        </Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto-save Generated Images</Text>
          <Switch
            value={autoSave}
            onValueChange={handleToggleAutoSave}
            trackColor={{ false: '#444', true: '#9d4edd' }}
            thumbColor={autoSave ? '#ffffff' : '#f0f0f0'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleClearHistory}>
          <Trash2 size={18} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.dangerButtonText}>
            {clearConfirm ? 'Tap again to confirm' : 'Clear Image History'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.settingDescription}>
          This will permanently delete all generated images from your history.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.linkItem} onPress={openPrivacyPolicy}>
          <Info size={18} color="#9d4edd" style={styles.linkIcon} />
          <Text style={styles.linkText}>Privacy Policy</Text>
          <ExternalLink size={16} color="#888888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkItem} onPress={openTermsOfService}>
          <Info size={18} color="#9d4edd" style={styles.linkIcon} />
          <Text style={styles.linkText}>Terms of Service</Text>
          <ExternalLink size={16} color="#888888" />
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
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
  section: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingLabel: {
    color: '#ffffff',
    fontSize: 16,
  },
  settingDescription: {
    color: '#888888',
    fontSize: 14,
    marginTop: 8,
  },
  dangerButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginVertical: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  dangerButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  linkIcon: {
    marginRight: 12,
  },
  linkText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    color: '#888888',
    fontSize: 14,
  },
});