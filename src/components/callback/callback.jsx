import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../lib/useAuthStore';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  
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
        
        console.log('Code parameter present:', !!code);
        console.log('State parameter present:', !!state);
        
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
          
          setStatus(`Authentication attempt ${attemptCount + 1} failed. Retrying...`);
          setError(`${storeError}${storeErrorDetails ? `: ${JSON.stringify(storeErrorDetails)}` : ''}`);
          
          // Retry after a short delay - keep trying indefinitely
          setAttemptCount(prev => prev + 1);
          setTimeout(() => {
            processAuth();
          }, 2000);
        }
      } catch (error) {
        console.error('Unexpected error processing callback:', error);
        setStatus(`An error occurred. Retrying... (Attempt ${attemptCount + 1})`);
        setError(error.message || 'Unknown error');
        
        // Retry after a short delay - keep trying indefinitely
        setAttemptCount(prev => prev + 1);
        setTimeout(() => {
          processAuth();
        }, 2000);
      }
    };
    
    // Only start the process on the first render
    if (attemptCount === 0) {
      processAuth();
    }
  }, [location, navigate, processTikTokCallback, attemptCount, storeError, storeErrorDetails]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          TikTok Authentication
        </h1>
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Always show loading spinner when not successful */}
          {!status.includes('successful') && (
            <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          )}
          
          <p className="text-center text-gray-600">{status}</p>
          
          {error && !status.includes('successful') && (
            <div className="p-3 mt-2 text-sm text-red-700 bg-red-100 rounded-md overflow-auto max-h-32">
              {error}
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