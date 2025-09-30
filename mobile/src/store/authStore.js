import { create } from "zustand";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { getBaseURL } from '../utils/config';

// Configure axios defaults
axios.defaults.baseURL = getBaseURL();

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  emailVerificationRequired: false,

  // Set auth headers for axios
  setAuthHeaders: (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  },

  // Save to SecureStore (more secure than localStorage on mobile)
  saveToStorage: async (state) => {
    try {
      await SecureStore.setItemAsync('auth_token', state.token || '');
      await SecureStore.setItemAsync('auth_refresh', state.refreshToken || '');
      await SecureStore.setItemAsync('auth_user', JSON.stringify(state.user || {}));
      await SecureStore.setItemAsync('auth_isAuthenticated', state.isAuthenticated.toString());
      await SecureStore.setItemAsync('auth_emailVerificationRequired', state.emailVerificationRequired?.toString() || 'false');
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  },

  // Load from SecureStore
  loadFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const refreshToken = await SecureStore.getItemAsync('auth_refresh');
      const userStr = await SecureStore.getItemAsync('auth_user');
      const isAuthenticated = await SecureStore.getItemAsync('auth_isAuthenticated') === 'true';
      const emailVerificationRequired = await SecureStore.getItemAsync('auth_emailVerificationRequired') === 'true';

      if (token && refreshToken && userStr && isAuthenticated) {
        try {
          const user = JSON.parse(userStr);
          set({
            token,
            refreshToken,
            user,
            isAuthenticated,
            emailVerificationRequired
          });
          get().setAuthHeaders(token);
          return true;
        } catch (e) {
          console.error('Failed to parse stored user data');
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to load auth data:', error);
      return false;
    }
  },

  // Clear storage
  clearStorage: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('auth_refresh');
      await SecureStore.deleteItemAsync('auth_user');
      await SecureStore.deleteItemAsync('auth_isAuthenticated');
      await SecureStore.deleteItemAsync('auth_emailVerificationRequired');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  },

  // Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      console.log('🔍 Attempting login to:', axios.defaults.baseURL);
      console.log('📝 Login credentials:', { username: credentials.username, password: '***' });
      
      const response = await axios.post("/api/auth/login/", credentials);
      console.log('✅ Login response received:', response.status);
      
      // Check if email verification is required
      if (response.data.email_verification_required) {
        const newState = {
          loading: false,
          error: response.data.error,
          emailVerificationRequired: true,
        };
        set(newState);
        await get().saveToStorage(get());
        return { 
          success: false, 
          message: response.data.error,
          emailVerificationRequired: true,
          userId: response.data.user_id
        };
      }

      const { user, tokens } = response.data;
      
      const newState = {
        user,
        token: tokens.access,
        refreshToken: tokens.refresh,
        isAuthenticated: true,
        loading: false,
        error: null,
        emailVerificationRequired: false,
      };
      
      set(newState);
      get().setAuthHeaders(tokens.access);
      await get().saveToStorage(newState);
      
      return { success: true, message: "Login successful" };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('📍 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      let errorMessage = "Login failed";
      let emailVerificationRequired = false;
      
      if (error.response?.status === 403 && error.response?.data?.email_verification_required) {
        errorMessage = error.response.data.error;
        emailVerificationRequired = true;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message.includes('Network Error') || error.code === 'NETWORK_ERROR') {
        errorMessage = "Cannot connect to server. Please check your connection.";
      } else {
        errorMessage = error.response?.data?.error || error.message || "Login failed";
      }
      
      const newState = { 
        loading: false, 
        error: errorMessage, 
        emailVerificationRequired 
      };
      
      set(newState);
      await get().saveToStorage(get());
      
      return { 
        success: false, 
        message: errorMessage, 
        emailVerificationRequired,
        userId: error.response?.data?.user_id
      };
    }
  },

  // Register
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      console.log('🔍 Attempting registration to:', axios.defaults.baseURL);
      console.log('📝 Registration data:', { 
        username: userData.username, 
        email: userData.email, 
        password: '***' 
      });
      
      const response = await axios.post("/api/auth/register/", userData);
      console.log('✅ Registration response received:', response.status);
      
      // Check if email verification is required
      if (response.data.email_verification_required) {
        const newState = {
          loading: false,
          error: null,
          emailVerificationRequired: true,
        };
        set(newState);
        await get().saveToStorage(get());
        return { 
          success: true, 
          message: response.data.message,
          emailVerificationRequired: true,
          user: response.data.user
        };
      }

      const { user, tokens } = response.data;
      
      const newState = {
        user,
        token: tokens.access,
        refreshToken: tokens.refresh,
        isAuthenticated: true,
        loading: false,
        error: null,
        emailVerificationRequired: false,
      };
      
      set(newState);
      get().setAuthHeaders(tokens.access);
      await get().saveToStorage(newState);
      
      return { success: true, message: "Registration successful" };
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('📍 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      let errorMessage = "Registration failed";
      
      if (error.response?.data?.error) {
        // Handle array of errors (like password validation)
        if (Array.isArray(error.response.data.error)) {
          errorMessage = error.response.data.error.join('. ');
        } else {
          errorMessage = error.response.data.error;
        }
      } else if (error.message.includes('Network Error') || error.code === 'NETWORK_ERROR') {
        errorMessage = "Cannot connect to server. Please check your connection.";
      } else {
        errorMessage = error.response?.data?.error || error.message || "Registration failed";
      }
      
      const newState = { loading: false, error: errorMessage };
      set(newState);
      await get().saveToStorage(get());
      return { success: false, message: errorMessage };
    }
  },

  // Resend verification email
  resendVerificationEmail: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/auth/resend-verification/", { email });
      
      const newState = { loading: false, error: null };
      set(newState);
      await get().saveToStorage(get());
      
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to resend verification email";
      const newState = { loading: false, error: errorMessage };
      set(newState);
      await get().saveToStorage(get());
      return { success: false, message: errorMessage };
    }
  },

  // Logout
  logout: async () => {
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      emailVerificationRequired: false,
    });
    
    get().setAuthHeaders(null);
    await get().clearStorage();
  },

  // Refresh token
  refreshAccessToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return false;

    try {
      const response = await axios.post("/api/auth/token/refresh/", {
        refresh: refreshToken,
      });
      
      const { access } = response.data;
      const newState = { ...get(), token: access };
      
      set({ token: access });
      get().setAuthHeaders(access);
      await get().saveToStorage(newState);
      
      return true;
    } catch (error) {
      // Refresh token is invalid, logout user
      await get().logout();
      return false;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await axios.get("/api/auth/profile/");
      const newState = { ...get(), user: response.data.user };
      set({ user: response.data.user });
      await get().saveToStorage(newState);
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to get profile";
      return { success: false, message: errorMessage };
    }
  },

  // Initialize auth (check if user is logged in on app start)
  initializeAuth: async () => {
    const loaded = await get().loadFromStorage();
    if (!loaded) {
      set({ isAuthenticated: false });
    }
  },

  // Clear email verification state
  clearEmailVerificationState: async () => {
    const newState = { ...get(), emailVerificationRequired: false, error: null };
    set({ emailVerificationRequired: false, error: null });
    await get().saveToStorage(newState);
  },
}));

// Add axios interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const store = useAuthStore.getState();
      const success = await store.refreshAccessToken();
      
      if (success) {
        // Retry the original request with new token
        return axios(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

export default useAuthStore;