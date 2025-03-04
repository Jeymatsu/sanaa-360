import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../lib/useAuthStore';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [retryDelay, setRetryDelay] = useState(2000); // Start with 2s delay
  const [maxRetries] = useState(5); // Set maximum retry attempts
  
  const processTikTokCallback = useAuthStore(state => state.processTikTokCallback);
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
        
        // Process the authentication with your Zustand store
        setStatus(`Communicating with server... (Attempt ${attemptCount + 1})`);
        const success = await processTikTokCallback(code, state);
        
        if (success) {
          console.log('Authentication successful');
          setStatus('Authentication successful! Redirecting...');
          navigate('/');
        } else {
          console.error('Authentication failed', {
            storeError,
            storeErrorDetails
          });
          
          // Check if we've reached max retry attempts
          if (attemptCount >= maxRetries) {
            console.error(`Max retry attempts (${maxRetries}) reached. Giving up.`);
            setStatus(`Authentication failed after ${maxRetries} attempts. Please try again.`);
            setError(storeError || 'Failed to authenticate after multiple attempts');
            return;
          }
          
          // Network errors might need a longer delay
          const isNetworkError = storeErrorDetails?.code === 'ERR_NETWORK' || 
                                storeErrorDetails?.isNetworkError;
          
          // Calculate backoff delay - start with base delay, increase with each network error
          // but cap at 10 seconds to prevent extremely long waits
          let nextDelay = isNetworkError ? 
            Math.min(retryDelay * 1.5, 10000) : // Increase delay for network errors
            2000; // Reset to base delay for other errors
          
          console.log(`Retry scheduled in ${nextDelay/1000} seconds (${isNetworkError ? 'network error' : 'other error'})`);
          setRetryDelay(nextDelay);
          setAttemptCount(prev => prev + 1);
          
          // Show more informative status for network errors
          setStatus(`${isNetworkError ? 'Network error - server unreachable. ' : ''}Retry attempt ${attemptCount + 1} scheduled in ${nextDelay/1000}s...`);
          
          setTimeout(() => {
            processAuth();
          }, nextDelay);
        }
      } catch (error) {
        console.error('Unexpected error processing callback:', error);
        
        // Check if we've reached max retry attempts
        if (attemptCount >= maxRetries) {
          console.error(`Max retry attempts (${maxRetries}) reached. Giving up.`);
          setStatus(`Authentication failed after ${maxRetries} attempts. Please try again.`);
          setError(`Unexpected error: ${error.message}`);
          return;
        }
        
        // For unexpected errors, use the same backoff strategy
        const nextDelay = Math.min(retryDelay * 1.5, 10000);
        console.log(`Retry scheduled in ${nextDelay/1000} seconds (unexpected error)`);
        setRetryDelay(nextDelay);
        setAttemptCount(prev => prev + 1);
        
        setStatus(`Unexpected error occurred. Retry attempt ${attemptCount + 1} scheduled in ${nextDelay/1000}s...`);
        
        setTimeout(() => {
          processAuth();
        }, nextDelay);
      }
    };
    
    // Only start the process on the first render or when the URL changes
    if (attemptCount === 0) {
      processAuth();
    }
  }, [location, navigate, processTikTokCallback, attemptCount, storeError, storeErrorDetails, retryDelay, maxRetries]);
  
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
          {/* Always show loading spinner when not successful */}
          {!status.includes('successful') && !status.includes('failed after') && (
            <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          )}
          
          <p className="text-center text-gray-600">{status}</p>
          
          {/* Show connection status indicator */}
          {storeErrorDetails?.code === 'ERR_NETWORK' && (
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
          
          {/* Show authentication error details */}
          {storeError && !storeErrorDetails?.isNetworkError && (
            <div className="p-3 mt-2 text-sm text-red-700 bg-red-100 rounded-md overflow-auto max-h-48">
              <p className="font-bold">Authentication Error:</p>
              <p>{storeError}</p>
              {storeErrorDetails?.data?.details && (
                <p className="mt-1 text-xs">Details: {storeErrorDetails.data.details}</p>
              )}
            </div>
          )}
          
          {/* Show manual retry button if we've reached max retries */}
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