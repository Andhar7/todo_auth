import { create } from "zustand";
import axios from "axios";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:8000";

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

  // Save to localStorage
  saveToStorage: (state) => {
    localStorage.setItem('auth_token', state.token || '');
    localStorage.setItem('auth_refresh', state.refreshToken || '');
    localStorage.setItem('auth_user', JSON.stringify(state.user || {}));
    localStorage.setItem('auth_isAuthenticated', state.isAuthenticated.toString());
    localStorage.setItem('auth_emailVerificationRequired', state.emailVerificationRequired?.toString() || 'false');
  },

  // Load from localStorage
  loadFromStorage: () => {
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('auth_refresh');
    const userStr = localStorage.getItem('auth_user');
    const isAuthenticated = localStorage.getItem('auth_isAuthenticated') === 'true';
    const emailVerificationRequired = localStorage.getItem('auth_emailVerificationRequired') === 'true';

    if (token && refreshToken && userStr && isAuthenticated) {
      try {
        const user = JSON.parse(userStr);
        set({ token, refreshToken, user, isAuthenticated, emailVerificationRequired });
        get().setAuthHeaders(token);
        return true;
      } catch (e) {
        console.error('Failed to parse stored user data');
      }
    }
    return false;
  },

  // Clear storage
  clearStorage: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_isAuthenticated');
    localStorage.removeItem('auth_emailVerificationRequired');
  },

  // Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/auth/login/", credentials);
      
      // Check if email verification is required
      if (response.data.email_verification_required) {
        const newState = {
          loading: false,
          error: response.data.error,
          emailVerificationRequired: true,
        };
        set(newState);
        get().saveToStorage(get());
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
      get().saveToStorage(newState);
      
      return { success: true, message: "Login successful" };
    } catch (error) {
      let errorMessage = "Login failed";
      let emailVerificationRequired = false;
      
      if (error.response?.status === 403 && error.response?.data?.email_verification_required) {
        errorMessage = error.response.data.error;
        emailVerificationRequired = true;
      } else {
        errorMessage = error.response?.data?.error || "Login failed";
      }
      
      const newState = { 
        loading: false, 
        error: errorMessage, 
        emailVerificationRequired 
      };
      
      set(newState);
      get().saveToStorage(get());
      
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
      const response = await axios.post("/api/auth/register/", userData);
      
      // Check if email verification is required
      if (response.data.email_verification_required) {
        const newState = {
          loading: false,
          error: null,
          emailVerificationRequired: true,
        };
        set(newState);
        get().saveToStorage(get());
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
      get().saveToStorage(newState);
      
      return { success: true, message: "Registration successful" };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      const newState = { loading: false, error: errorMessage };
      set(newState);
      get().saveToStorage(get());
      return { success: false, message: errorMessage };
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/auth/verify-email/${token}/`);
      
      const newState = {
        loading: false,
        error: null,
        emailVerificationRequired: false,
      };
      
      set(newState);
      get().saveToStorage(get());
      
      return { 
        success: true, 
        message: response.data.message,
        user: response.data.user 
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Email verification failed";
      const newState = { loading: false, error: errorMessage };
      set(newState);
      get().saveToStorage(get());
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
      get().saveToStorage(get());
      
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to resend verification email";
      const newState = { loading: false, error: errorMessage };
      set(newState);
      get().saveToStorage(get());
      return { success: false, message: errorMessage };
    }
  },

  // Logout
  logout: () => {
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
    get().clearStorage();
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
      get().saveToStorage(newState);
      
      return true;
    } catch (error) {
      // Refresh token is invalid, logout user
      get().logout();
      return false;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await axios.get("/api/auth/profile/");
      const newState = { ...get(), user: response.data.user };
      set({ user: response.data.user });
      get().saveToStorage(newState);
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to get profile";
      return { success: false, message: errorMessage };
    }
  },

  // Initialize auth (check if user is logged in on app start)
  initializeAuth: () => {
    const loaded = get().loadFromStorage();
    if (!loaded) {
      set({ isAuthenticated: false });
    }
  },

  // Clear email verification state
  clearEmailVerificationState: () => {
    const newState = { ...get(), emailVerificationRequired: false, error: null };
    set({ emailVerificationRequired: false, error: null });
    get().saveToStorage(newState);
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