import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Set the user data after successful authentication
      setUser: (userData) => set({ 
        user: userData, 
        isAuthenticated: true,
        error: null 
      }),
      
      // Clear user data on logout
      logout: async () => {
        try {
          await axios.get('https://sanaa-360-backend.onrender.com/api/v1/auth/tiktok/logout');
          set({ 
            user: null, 
            isAuthenticated: false,
            error: null 
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ error: 'Failed to logout' });
        }
      },
      
      // Process TikTok callback data
      processTikTokCallback: async (code, state) => {
        set({ isLoading: true });
        try {
          // Make an API call to your backend to verify and process the code
          // Your backend will exchange the code for an access token
          const response = await axios.post('https://sanaa-360-backend.onrender.com/api/v1/auth/tiktok/process-callback', {
            code,
            state
          });
          
          // Set user in store
          set({ 
            user: response.data.user, 
            isAuthenticated: true,
            isLoading: false,
            error: null 
          });
          
          return true;
        } catch (error) {
          console.error('TikTok auth error:', error);
          set({ 
            isLoading: false, 
            error: error.response?.data?.error || 'Authentication failed' 
          });
          return false;
        }
      },
      
      // Check authentication status
      checkAuthStatus: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get('https://sanaa-360-backend.onrender.com/api/v1/auth/tiktok/status');
          
          if (response.data.authenticated) {
            set({ 
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null 
            });
          } else {
            set({ 
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null 
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Failed to check authentication status' 
          });
        }
      }
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // only persist these fields
    }
  )
);

export default useAuthStore;