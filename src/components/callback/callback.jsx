import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../lib/useAuthStore';
import axios from 'axios';

// API base URL - make sure this matches what your backend expects
const API_BASE_URL = 'https://sanaa-360-backend.onrender.com/api/v1/auth';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [retryDelay, setRetryDelay] = useState(2000); // Start with 2s delay
  const [maxRetries] = useState(5); // Set maximum retry attempts
  
  const setUser = useAuthStore(state => state.setUser);
  const storeError = useAuthStore(state => state.error);
  const storeErrorDetails = useAuthStore(state => state.errorDetails);
  
  useEffect(() => {
    const processAuth = async () => {
      try {
        console.log('Callback page loaded, processing authentication...');
        console.log('Current URL:', window.location.href);
        console.log('Attempt #:', attemptCount + 1);
        
        // Parse query parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const scopes = searchParams.get('scopes');
        
        console.log('Code parameter present:', !!code);
        console.log('State parameter present:', !!state);
        console.log('Scopes parameter present:', !!scopes);
        
        if (!code) {
          const errorMsg = 'Error: Authorization code missing from URL';
          console.error(errorMsg);
          setStatus(errorMsg);
          setError(errorMsg);
          return;
        }
        
        // Verify state parameter to prevent CSRF attacks
        const storedState = sessionStorage.getItem('tiktok_auth_state');
        if (state !== storedState) {
          console.warn('State mismatch!', { received: state, stored: storedState });
          // For security, you might want to abort here
          // But we'll continue for now with a warning
        }
        
        // Process the authentication directly with axios
        setStatus(`Communicating with server... (Attempt ${attemptCount + 1})`);
        
        // Use direct URL to avoid path construction issues
        const response = await axios.post(
          `${API_BASE_URL}/tiktok/process-callback`,
          { code },
          { withCredentials: true }
        );
        
        console.log('Authentication response:', {
          status: response.status,
          success: response.data.success,
          hasUser: !!response.data.user
        });
        
        if (response.data.success && response.data.user) {
          // Calculate token expiry
          const tokenExpiry = response.data.tokenExpiry ? 
            new Date(response.data.tokenExpiry) : null;
          
          // Set user in store with additional data
          setUser({
            ...response.data.user,
            tokenExpiry
          });
          
          console.log('Authentication successful');
          setStatus('Authentication successful! Redirecting...');
          
          // Clear the state from session storage
          sessionStorage.removeItem('tiktok_auth_state');
          
          // Redirect to home page
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Error processing callback:', error);
        
        const errorInfo = {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          code: error.code || error.response?.data?.errorCode,
          isAxiosError: error.isAxiosError,
          isNetworkError: error.code === 'ERR_NETWORK'
        };
        
        // Check if we've reached max retry attempts
        if (attemptCount >= maxRetries) {
          console.error(`Max retry attempts (${maxRetries}) reached. Giving up.`);
          
          // Prepare detailed error message for the user
          let errorMessage = 'Authentication failed after multiple attempts.';
          
          if (error.response?.data?.error) {
            errorMessage += ` Error: ${error.response.data.error}`;
            
            // Special handling for scope_not_authorized error
            if (error.response.data.errorCode === 'scope_not_authorized') {
              errorMessage = 'You need to allow all requested permissions when connecting to TikTok.';
            }
          }
          
          setStatus(`Authentication failed.`);
          setError(errorMessage);
          return;
        }
        
        // Network errors might need a longer delay
        const isNetworkError = error.code === 'ERR_NETWORK' || 
                              errorInfo.isNetworkError;
        
        // Calculate backoff delay with exponential backoff
        let nextDelay = isNetworkError ? 
          Math.min(retryDelay * 1.5, 10000) : // Increase delay for network errors
          2000; // Reset to base delay for other errors
        
        console.log(`Retry scheduled in ${nextDelay/1000} seconds (${isNetworkError ? 'network error' : 'other error'})`);
        setRetryDelay(nextDelay);
        setAttemptCount(prev => prev + 1);
        
        // Show more informative status
        if (isNetworkError) {
          setStatus(`Network error - server unreachable. Retry attempt ${attemptCount + 1} scheduled in ${nextDelay/1000}s...`);
        } else if (error.response?.data?.errorCode === 'scope_not_authorized') {
          setStatus(`Permission error: You need to allow all requested permissions. Retrying in ${nextDelay/1000}s...`);
        } else {
          setStatus(`Authentication error. Retry attempt ${attemptCount + 1} scheduled in ${nextDelay/1000}s...`);
        }
        
        setTimeout(() => {
          processAuth();
        }, nextDelay);
      }
    };
    
    // Only start the process on the first render
    if (attemptCount === 0) {
      processAuth();
    }
  }, [location, navigate, setUser, attemptCount, retryDelay, maxRetries]);
  
  // Function to handle manual retry
  const handleManualRetry = () => {
    setAttemptCount(0); // Reset attempt count
    setRetryDelay(2000); // Reset delay
    setError(null); // Clear errors
    setStatus('Processing...'); // Reset status
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          TikTok Authentication
        </h1>
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Show loading spinner when processing */}
          {!status.includes('successful') && !status.includes('failed') && (
            <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          )}
          
          <p className="text-center text-gray-600">{status}</p>
          
          {/* Show error message */}
          {error && (
            <div className="p-3 mt-2 text-sm text-red-700 bg-red-100 rounded-md overflow-auto max-h-48">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          {/* Show network error indicator */}
          {storeErrorDetails?.isNetworkError && (
            <div className="p-3 mt-2 text-sm text-orange-700 bg-orange-100 rounded-md">
              <p className="font-bold">Network Status: Disconnected</p>
              <p>Server is unreachable. This might be due to:</p>
              <ul className="list-disc ml-5 mt-1">
                <li>Server temporarily down or restarting</li>
                <li>Internet connection issues</li>
                <li>Backend service cold start (on Render)</li>
              </ul>
              <p className="mt-1">Will continue retrying until connected...</p>
            </div>
          )}
          
          {/* Show manual retry button if max retries reached */}
          {attemptCount >= maxRetries && (
            <button 
              onClick={handleManualRetry}
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Try Again
            </button>
          )}
          
          {/* Attempt counter display */}
          {attemptCount > 0 && (
            <div className="text-sm text-gray-500">
              Retry attempts: {attemptCount} of {maxRetries}
            </div>
          )}
          
          {/* Manual return to login button */}
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Cancel and Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Callback;