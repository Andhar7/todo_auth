import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:8000";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Set auth headers for axios
      setAuthHeaders: (token) => {
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          delete axios.defaults.headers.common["Authorization"];
        }
      },

      // Login
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post("/api/auth/login/", credentials);
          const { user, tokens } = response.data;
          
          set({
            user,
            token: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          
          // Set auth headers
          get().setAuthHeaders(tokens.access);
          
          return { success: true, message: "Login successful" };
        } catch (error) {
          const errorMessage = error.response?.data?.error || "Login failed";
          set({ loading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      // Register
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post("/api/auth/register/", userData);
          const { user, tokens } = response.data;
          
          set({
            user,
            token: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          
          // Set auth headers
          get().setAuthHeaders(tokens.access);
          
          return { success: true, message: "Registration successful" };
        } catch (error) {
          const errorMessage = error.response?.data?.error || "Registration failed";
          set({ loading: false, error: errorMessage });
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
        });
        
        // Remove auth headers
        get().setAuthHeaders(null);
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
          set({ token: access });
          get().setAuthHeaders(access);
          
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
          set({ user: response.data.user });
          return { success: true, user: response.data.user };
        } catch (error) {
          const errorMessage = error.response?.data?.error || "Failed to get profile";
          return { success: false, message: errorMessage };
        }
      },

      // Initialize auth (check if user is logged in on app start)
      initializeAuth: () => {
        const { token } = get();
        if (token) {
          get().setAuthHeaders(token);
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage
    }
  )
);

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