import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Configure axios defaults for all requests
axios.defaults.withCredentials = true;

// Define base URL as a constant for easier maintenance
const API_BASE_URL = 'https://sanaa-360-backend.onrender.com/api/v1/auth';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      errorDetails: null,
      tokenExpiry: null,
      
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
          
          // Use the revoke-access endpoint instead of simple logout
          await axios.post(`${API_BASE_URL}/tiktok/revoke-access`, {}, 
            { withCredentials: true }
          );
          
          console.log('Logout successful');
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            errorDetails: null,
            tokenExpiry: null
          });
          return true;
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
          return false;
        }
      },
      
      // Process TikTok callback data with enhanced error handling
      processTikTokCallback: async (code, state) => {
        console.log('Starting TikTok callback processing...');
        console.log('Code received (first/last 5 chars):', 
          code ? `${code.substring(0, 5)}...${code.substring(code.length - 5)}` : 'None');
        console.log('Code length:', code ? code.length : 0);
        
        // Check for special characters that may cause issues
        const hasSpecialChars = code ? /[*!]/.test(code) : false;
        console.log('Code contains special chars:', hasSpecialChars);
        console.log('State received:', state);
        
        set({ isLoading: true });
        
        try {
          console.log('Making API request to process callback...');
          
          // Configure axios with credentials to properly send/receive cookies
          const instance = axios.create({
            baseURL: API_BASE_URL.split('/auth')[0], // Get base URL without '/auth'
            withCredentials: true
          });
          
          // IMPORTANT: We're passing the code exactly as received - no modifications
          // This is critical because the code contains special characters
          const response = await instance.post(
            '/api/v1/auth/tiktok/process-callback', 
            { code }  // Send the raw code without any processing
          );
          
          console.log('API response received:', {
            status: response.status,
            hasUser: !!response.data.user,
            userId: response.data.user?.id,
            scope: response.data.user?.scope
          });
          
          // Store token expiry if available
          const tokenExpiry = response.data.tokenExpiry 
            ? new Date(response.data.tokenExpiry) 
            : null;
          
          // Set user in store with additional data
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            errorDetails: null,
            tokenExpiry
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
          
          // Extract the most relevant error message
          const errorMessage = error.response?.data?.errorMessage || 
                              error.response?.data?.details ||
                              error.response?.data?.error_description || 
                              error.response?.data?.error ||
                              (error.code === 'ERR_NETWORK' ? 'Network Error - Server Unreachable' : 'Authentication failed');
          
          set({
            isLoading: false,
            error: errorMessage,
            errorDetails: errorInfo
          });
          
          return false;
        }
      },
      
      // Check authentication status with token validation
      checkAuthStatus: async () => {
        console.log('Checking authentication status...');
        set({ isLoading: true });
        
        // Check if token needs refresh based on local expiry time
        const { tokenExpiry } = get();
        const now = new Date();
        const needsRefresh = tokenExpiry && now >= new Date(tokenExpiry);
        
        if (needsRefresh) {
          console.log('Token appears expired, attempting refresh first...');
          const refreshed = await get().refreshToken();
          if (refreshed) {
            console.log('Token refreshed successfully');
            set({ isLoading: false });
            return true;
          }
        }
        
        try {
          const response = await axios.get(
            `${API_BASE_URL}/tiktok/status`,
            { withCredentials: true }
          );
          
          console.log('Auth status response:', {
            status: response.status,
            authenticated: response.data.authenticated,
            hasUser: !!response.data.user,
            scope: response.data.user?.scope,
            tokenExpired: response.data.tokenExpired
          });
          
          if (response.data.authenticated) {
            // If token is reported as expired, refresh it
            if (response.data.tokenExpired) {
              console.log('Server reports token expired, refreshing...');
              await get().refreshToken();
            } else {
              set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                errorDetails: null,
                tokenExpiry: response.data.tokenExpiry ? new Date(response.data.tokenExpiry) : get().tokenExpiry
              });
            }
            return true;
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              errorDetails: null,
              tokenExpiry: null
            });
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
          
          console.error('Auth check error:', errorInfo);
          
          // If unauthorized, clear user state
          if (error.response?.status === 401) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Session expired',
              errorDetails: errorInfo,
              tokenExpiry: null
            });
          } else {
            set({
              isLoading: false,
              error: 'Failed to check authentication status',
              errorDetails: errorInfo
            });
          }
          return false;
        }
      },
      
      // Improved token refresh function with better error handling
      refreshToken: async () => {
        console.log('Attempting to refresh token...');
        set({ isLoading: true });
        
        try {
          const response = await axios.get(
            `${API_BASE_URL}/tiktok/refresh-token`,
            { withCredentials: true }
          );
          
          console.log('Token refresh response:', {
            status: response.status,
            success: response.data.success,
            scope: response.data.user?.scope
          });
          
          if (response.data.success) {
            // Calculate token expiry from expires_in if available
            let tokenExpiry = null;
            if (response.data.expiresIn) {
              tokenExpiry = new Date();
              tokenExpiry.setSeconds(tokenExpiry.getSeconds() + response.data.expiresIn);
            } else if (response.data.tokenExpiry) {
              tokenExpiry = new Date(response.data.tokenExpiry);
            }
            
            set({
              user: response.data.user || get().user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              errorDetails: null,
              tokenExpiry
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
          
          // Check if we need to redirect for re-authentication
          if (error.response?.data?.reauth) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Authentication required',
              errorDetails: errorInfo,
              tokenExpiry: null
            });
          } else {
            set({
              isLoading: false,
              error: 'Failed to refresh authentication token',
              errorDetails: errorInfo
            });
          }
          return false;
        }
      },

      // Check if the token is expiring soon and refresh if needed
      checkAndRefreshTokenIfNeeded: async () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return false;
        
        const now = new Date();
        const expiryTime = new Date(tokenExpiry);
        
        // If token expires in less than 15 minutes, refresh it
        const fifteenMinutesInMs = 15 * 60 * 1000;
        if ((expiryTime - now) < fifteenMinutesInMs) {
          console.log('Token expires soon, refreshing...');
          return await get().refreshToken();
        }
        
        return true; // Token is still valid
      }
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        tokenExpiry: state.tokenExpiry
      }),
    }
  )
);

export default useAuthStore;