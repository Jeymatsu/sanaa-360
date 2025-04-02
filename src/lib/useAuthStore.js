import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

axios.defaults.withCredentials = true;

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
      
      setUser: (userData) => set({
        user: userData,
        isAuthenticated: true,
        error: null,
        errorDetails: null
      }),
      
      logout: async () => {
        try {
          console.log('Attempting logout...');
          
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
      
      processTikTokCallback: async (code, state) => {
        console.log('Starting TikTok callback processing...');
        console.log('Code received (first/last 5 chars):', 
          code ? `${code.substring(0, 5)}...${code.substring(code.length - 5)}` : 'None');
        console.log('Code length:', code ? code.length : 0);
        
        const hasSpecialChars = code ? /[*!]/.test(code) : false;
        console.log('Code contains special chars:', hasSpecialChars);
        console.log('State received:', state);
        
        set({ isLoading: true });
        
        try {
          console.log('Making API request to process callback...');
          
          const response = await axios.post(
            'https://sanaa-360-backend.onrender.com/api/v1/auth/tiktok/process-callback',
            { code },
            { withCredentials: true }
          );
          
          console.log('API response received:', {
            status: response.status,
            hasUser: !!response.data.user,
            userId: response.data.user?.id,
            scope: response.data.user?.scope
          });
          
          const tokenExpiry = response.data.tokenExpiry 
            ? new Date(response.data.tokenExpiry) 
            : null;
          
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
      
      checkSessionIntegrity: async () => {
        console.log('Checking session integrity...');
        
        try {
          const { isAuthenticated } = get();
          
          const response = await axios.get(
            `${API_BASE_URL.replace('/auth', '')}/session-check`, 
            { withCredentials: true }
          );
          
          const serverHasSession = response.data.hasUserId;
          
          if (isAuthenticated && !serverHasSession) {
            console.log('Session integrity issue: client authenticated but server session missing');
            
            const refreshed = await get().refreshToken();
            if (!refreshed) {
              set({
                user: null,
                isAuthenticated: false,
                error: 'Session expired on server',
                tokenExpiry: null
              });
              return false;
            }
          }
          
          return true;
        } catch (error) {
          console.error('Session integrity check error:', error);
          return get().isAuthenticated;
        }
      },
      
      checkAuthStatus: async () => {
        console.log('Checking authentication status...');
        
        const { tokenExpiry, isAuthenticated } = get();
        
        if (isAuthenticated && tokenExpiry) {
          const now = new Date();
          const expiryTime = new Date(tokenExpiry);
          if (now < expiryTime) {
            console.log('Using cached authentication state - token still valid');
            return true;
          }
        }
        
        set({ isLoading: true });
        
        try {
          const response = await axios.get(
            `${API_BASE_URL}/tiktok/status`,
            { withCredentials: true }
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
              errorDetails: null,
              tokenExpiry: response.data.tokenExpiry ? new Date(response.data.tokenExpiry) : get().tokenExpiry
            });
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
          if (error.response?.status === 401) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Session expired',
              tokenExpiry: null
            });
          } else {
            set({ isLoading: false });
          }
          return false;
        }
      },
      
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
            success: response.data.success
          });
          
          if (response.data.success) {
            let tokenExpiry = null;
            if (response.data.expiresIn) {
              tokenExpiry = new Date();
              tokenExpiry.setSeconds(tokenExpiry.getSeconds() + response.data.expiresIn);
              tokenExpiry.setMinutes(tokenExpiry.getMinutes() - 5);
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
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          
          if (error.response?.data?.reauth) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Authentication required',
              tokenExpiry: null
            });
          } else {
            set({ isLoading: false });
          }
          
          return false;
        }
      },

      checkAndRefreshTokenIfNeeded: async () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return false;
        
        const now = new Date();
        const expiryTime = new Date(tokenExpiry);
        
        const fifteenMinutesInMs = 15 * 60 * 1000;
        if ((expiryTime - now) < fifteenMinutesInMs) {
          console.log('Token expires soon, refreshing...');
          return await get().refreshToken();
        }
        
        return true;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        tokenExpiry: state.tokenExpiry
      }),
    }
  )
);

export default useAuthStore;