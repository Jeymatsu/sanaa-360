import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Configure axios defaults for all requests
axios.defaults.withCredentials = true;

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      errorDetails: null, // Added to store detailed error information
      
      // Set the user data after successful authentication
      setUser: (userData) => set({
        user: userData,
        isAuthenticated: true,
        error: null,
        errorDetails: null
      }),
      
      // Clear user data on logout
      logout: async () => {
        try {
          console.log('Attempting logout...');
          await axios.get('https://sanaa-360-backend.onrender.com/api/v1/auth/tiktok/logout', 
            { withCredentials: true } // Enable credentials for session cookies
          );
          console.log('Logout successful');
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            errorDetails: null
          });
        } catch (error) {
          console.error('Logout error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
          set({ 
            error: 'Failed to logout',
            errorDetails: {
              message: error.message,
              status: error.response?.status,
              data: error.response?.data
            }
          });
        }
      },
      
      // Process TikTok callback data with enhanced logging and network error handling
      processTikTokCallback: async (code, state) => {
        console.log('Starting TikTok callback processing...');
        console.log('Code received:', code ? `${code.substring(0, 5)}...` : 'None'); // Log partial code for security
        console.log('State received:', state);
        
        set({ isLoading: true });
        
        try {
          console.log('Making API request to process callback...');
          // Configure axios with credentials to properly send/receive cookies
          const instance = axios.create({
            baseURL: 'https://sanaa-360-backend.onrender.com',
            withCredentials: true // This is critical for session cookies to work
          });
          
          // IMPORTANT: Keep the payload simple - TikTok is complaining about extra parameters
          const response = await instance.post(
            '/api/v1/auth/tiktok/process-callback', 
            { code }  // Only send the code, omit state to avoid parameter errors
          );
          
          console.log('API response received:', {
            status: response.status,
            hasUser: !!response.data.user,
            userId: response.data.user?.id
          });
          
          // Set user in store
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            errorDetails: null
          });
          
          return true;
        } catch (error) {
          const errorInfo = {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            code: error.code,
            isAxiosError: error.isAxiosError,
            isNetworkError: error.code === 'ERR_NETWORK'
          };
          
          console.error('TikTok auth error:', errorInfo);
          
          // For network errors specifically, we might want to handle differently
          // but we'll still return false to let the UI handle the retry logic
          set({
            isLoading: false,
            error: error.response?.data?.error || (error.code === 'ERR_NETWORK' ? 'Network Error - Server Unreachable' : 'Authentication failed'),
            errorDetails: errorInfo
          });
          
          return false;
        }
      },
      
      // Check authentication status with enhanced logging
      checkAuthStatus: async () => {
        console.log('Checking authentication status...');
        set({ isLoading: true });
        
        try {
          const response = await axios.get(
            'https://sanaa-360-backend.onrender.com/api/v1/auth/tiktok/status',
            { withCredentials: true } // Enable credentials for session cookies
          );
          
          console.log('Auth status response:', {
            status: response.status,
            authenticated: response.data.authenticated,
            hasUser: !!response.data.user
          });
          
          if (response.data.authenticated) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              errorDetails: null
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              errorDetails: null
            });
          }
        } catch (error) {
          const errorInfo = {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            code: error.code,
            isAxiosError: error.isAxiosError,
            isNetworkError: error.code === 'ERR_NETWORK'
          };
          
          console.error('Auth check error:', errorInfo);
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Failed to check authentication status',
            errorDetails: errorInfo
          });
        }
      },
      
      // New function to refresh token
      refreshToken: async () => {
        console.log('Attempting to refresh token...');
        set({ isLoading: true });
        
        try {
          const response = await axios.get(
            'https://sanaa-360-backend.onrender.com/api/v1/auth/tiktok/refresh-token',
            { withCredentials: true } // Enable credentials for session cookies
          );
          
          console.log('Token refresh response:', {
            status: response.status,
            success: response.data.success
          });
          
          if (response.data.success) {
            set({
              user: response.data.user || get().user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              errorDetails: null
            });
            return true;
          } else {
            console.warn('Token refresh unsuccessful');
            return false;
          }
        } catch (error) {
          const errorInfo = {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            code: error.code,
            isAxiosError: error.isAxiosError,
            isNetworkError: error.code === 'ERR_NETWORK'
          };
          
          console.error('Token refresh error:', errorInfo);
          
          set({
            isLoading: false,
            error: 'Failed to refresh authentication token',
            errorDetails: errorInfo
          });
          return false;
        }
      }
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // only persist these fields
    }
  )
);

export default useAuthStore;