// Configuration for backend API
import { Platform } from 'react-native';

export const API_CONFIG = {
  // Development URLs
  ANDROID_EMULATOR: "http://10.0.2.2:8000",
  IOS_SIMULATOR: "http://127.0.0.1:8000", 
  PHYSICAL_DEVICE: "http://172.20.10.2:8000", // Updated to your detected IP
  
  // Production URL (when deploying)
  PRODUCTION: "https://your-production-domain.com",
};

// Auto-detect platform and return appropriate URL
export const getBaseURL = () => {
  // Since you're using a physical device, return the physical device URL
  // This is the IP address where Metro is running (172.20.10.2)
  return API_CONFIG.PHYSICAL_DEVICE;
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/api/auth/login/",
  REGISTER: "/api/auth/register/",
  REFRESH_TOKEN: "/api/auth/token/refresh/",
  VERIFY_EMAIL: "/api/auth/verify-email/",
  RESEND_VERIFICATION: "/api/auth/resend-verification/",
  PROFILE: "/api/auth/profile/",
  
  // Product/Todo endpoints
  PRODUCTS: "/api/products/",
};

export default {
  API_CONFIG,
  getBaseURL,
  API_ENDPOINTS
};