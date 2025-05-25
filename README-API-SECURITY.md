# Secure API Integration Guide

This document outlines the secure API implementation in the application.

## Environment Variables

1. Create a `.env` file in the root directory based on `.env.example`
2. Never commit sensitive information to version control
3. Add `.env` to your `.gitignore` file

## Secure Storage

Sensitive data (tokens, API keys) are stored using `expo-secure-store` which uses platform-specific secure storage:
- iOS: Keychain Services
- Android: Encrypted SharedPreferences
- Web: Encrypted localStorage

## API Service

The API service (`services/api.ts`) includes:
- Automatic token refresh
- Request/response interceptors
- Error handling
- TypeScript support

### Making API Requests

```typescript
import { authenticatedRequest } from '@/services/api';

// Example GET request
const fetchData = async () => {
  try {
    const data = await authenticatedRequest({
      method: 'GET',
      url: '/endpoint',
      apiServiceName: 'your_service_name' // Optional: for service-specific API keys
    });
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Example POST request
const postData = async (payload) => {
  try {
    const response = await authenticatedRequest({
      method: 'POST',
      url: '/endpoint',
      data: payload,
      apiServiceName: 'your_service_name'
    });
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
```

## Security Best Practices

1. **API Keys**
   - Never hardcode API keys in source code
   - Use environment variables for API endpoints and public keys
   - Store sensitive keys using `secureStorage.ts`

2. **Authentication**
   - Use short-lived access tokens
   - Implement token refresh flow
   - Store tokens securely using `expo-secure-store`

3. **HTTPS**
   - Always use HTTPS for API requests
   - Enable certificate pinning in production

4. **Error Handling**
   - Don't expose sensitive error details to clients
   - Log errors securely on the server
   - Implement proper error boundaries in React components

## Adding New API Services

1. Add a new service configuration in `services/`
2. Use the `authenticatedRequest` helper for all API calls
3. Store any required API keys using `secureStorage.ts`
4. Add environment variables to `.env.example`

## Testing

1. Test API calls in development using mock data
2. Verify error handling for network failures
3. Test token refresh flow
4. Test with invalid/expired tokens
