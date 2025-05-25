import * as SecureStore from 'expo-secure-store';

// Secure storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  API_KEYS: 'api_keys',
} as const;

/**
 * Securely store a value
 */
export const setSecureValue = async (key: string, value: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error) {
    console.error('Error storing secure value:', error);
    return false;
  }
};

/**
 * Retrieve a securely stored value
 */
export const getSecureValue = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Error retrieving secure value:', error);
    return null;
  }
};

/**
 * Remove a securely stored value
 */
export const removeSecureValue = async (key: string): Promise<boolean> => {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    console.error('Error removing secure value:', error);
    return false;
  }
};

/**
 * Store API keys securely
 */
export const storeApiKey = async (service: string, key: string): Promise<boolean> => {
  try {
    const existingKeys = await getApiKeys();
    const updatedKeys = { ...existingKeys, [service]: key };
    await setSecureValue(STORAGE_KEYS.API_KEYS, JSON.stringify(updatedKeys));
    return true;
  } catch (error) {
    console.error('Error storing API key:', error);
    return false;
  }
};

/**
 * Retrieve API key for a specific service
 */
export const getApiKey = async (service: string): Promise<string | null> => {
  try {
    const keys = await getApiKeys();
    return keys[service] || null;
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }
};

/**
 * Get all stored API keys
 */
const getApiKeys = async (): Promise<Record<string, string>> => {
  try {
    const keysJson = await getSecureValue(STORAGE_KEYS.API_KEYS);
    return keysJson ? JSON.parse(keysJson) : {};
  } catch (error) {
    console.error('Error parsing API keys:', error);
    return {};
  }
};
