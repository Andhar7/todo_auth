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
      emailVerificationRequired: false,

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
          
          // Check if email verification is required
          if (response.data.email_verification_required) {
            set({
              loading: false,
              error: response.data.error,
              emailVerificationRequired: true,
            });
            return { 
              success: false, 
              message: response.data.error,
              emailVerificationRequired: true,
              userId: response.data.user_id
            };
          }

          const { user, tokens } = response.data;
          
          set({
            user,
            token: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
            loading: false,
            error: null,
            emailVerificationRequired: false,
          });
          
          // Set auth headers
          get().setAuthHeaders(tokens.access);
          
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
          
          set({ 
            loading: false, 
            error: errorMessage, 
            emailVerificationRequired 
          });
          
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
            set({
              loading: false,
              error: null,
              emailVerificationRequired: true,
            });
            return { 
              success: true, 
              message: response.data.message,
              emailVerificationRequired: true,
              user: response.data.user
            };
          }

          const { user, tokens } = response.data;
          
          set({
            user,
            token: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
            loading: false,
            error: null,
            emailVerificationRequired: false,
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

      // Verify email
      verifyEmail: async (token) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`/api/auth/verify-email/${token}/`);
          
          set({
            loading: false,
            error: null,
            emailVerificationRequired: false,
          });
          
          return { 
            success: true, 
            message: response.data.message,
            user: response.data.user 
          };
        } catch (error) {
          const errorMessage = error.response?.data?.error || "Email verification failed";
          set({ loading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      // Resend verification email
      resendVerificationEmail: async (email) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post("/api/auth/resend-verification/", { email });
          
          set({ loading: false, error: null });
          
          return { 
            success: true, 
            message: response.data.message 
          };
        } catch (error) {
          const errorMessage = error.response?.data?.error || "Failed to resend verification email";
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
          emailVerificationRequired: false,
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

      // Clear email verification state
      clearEmailVerificationState: () => {
        set({ emailVerificationRequired: false, error: null });
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage
    }
  )
);

export default useAuthStore;