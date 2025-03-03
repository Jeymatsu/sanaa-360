import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../lib/useAuthStore';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const processTikTokCallback = useAuthStore(state => state.processTikTokCallback);
  const storeError = useAuthStore(state => state.error);
  const storeErrorDetails = useAuthStore(state => state.errorDetails);
  
  useEffect(() => {
    const processAuth = async () => {
      try {
        console.log('Callback page loaded, processing authentication...');
        console.log('Current URL:', window.location.href);
        
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
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        // Process the authentication with your Zustand store
        setStatus('Communicating with server...');
        const success = await processTikTokCallback(code, state);
        
        if (success) {
          console.log('Authentication successful');
          setStatus('Authentication successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          console.error('Authentication failed', {
            storeError,
            storeErrorDetails
          });
          
          setStatus('Authentication failed. Please try again.');
          setError(`${storeError}${storeErrorDetails ? `: ${JSON.stringify(storeErrorDetails)}` : ''}`);
          
          // Check if we should retry
          if (retryCount < 2 && !isRetrying) {
            setIsRetrying(true);
            setStatus('Retrying authentication...');
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              setIsRetrying(false);
              processAuth();
            }, 2000);
          } else {
            setTimeout(() => navigate('/login'), 3000);
          }
        }
      } catch (error) {
        console.error('Unexpected error processing callback:', error);
        setStatus('An unexpected error occurred. Please try again.');
        setError(error.message || 'Unknown error');
        setTimeout(() => navigate('/login'), 3000);
      }
    };
    
    if (!isRetrying) {
      processAuth();
    }
  }, [location, navigate, processTikTokCallback, isRetrying, retryCount, storeError, storeErrorDetails]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          TikTok Authentication
        </h1>
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isRetrying || status === 'Processing...' || status.includes('successful') ? (
            <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          ) : null}
          
          <p className="text-center text-gray-600">{status}</p>
          
          {error && !status.includes('successful') && (
            <div className="p-3 mt-2 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          {status.includes('failed') && !isRetrying && retryCount >= 2 && (
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Return to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Callback;