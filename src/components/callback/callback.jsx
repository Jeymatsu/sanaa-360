// src/pages/Callback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../lib/useAuthStore';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing...');
  const processTikTokCallback = useAuthStore(state => state.processTikTokCallback);
  
  useEffect(() => {
    const processAuth = async () => {
      try {
        // Parse query parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code) {
          setStatus('Error: Authorization code missing');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        // Process the authentication with your Zustand store
        const success = await processTikTokCallback(code, state);
        
        if (success) {
          setStatus('Authentication successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          setStatus('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('Error processing callback:', error);
        setStatus('An error occurred. Please try again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    
    processAuth();
  }, [location, navigate, processTikTokCallback]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          TikTok Authentication
        </h1>
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          <p className="text-center text-gray-600">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default Callback;