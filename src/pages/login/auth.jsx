import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTiktok } from 'react-icons/fa';

const TikTokAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL =  'http://localhost:5001/api/v1/auth';

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/tiktok/status`, { 
          withCredentials: true 
        });
        
        if (response.data.authenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log('User not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [API_BASE_URL]);

  const handleTikTokLogin = () => {
    window.location.href = `${API_BASE_URL}/tiktok/login`;
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/auth/tiktok/logout`, { withCredentials: true });
      setUser(null);
    } catch (error) {
      setError('Error logging out');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!user ? (
        <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connect with TikTok</h2>
          <p className="text-gray-600 mb-4">Login with your TikTok account to continue</p>
          <button
            onClick={handleTikTokLogin}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaTiktok size={20} />
            <span>Login with TikTok</span>
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.profilePicture && (
                <img 
                  src={user.profilePicture} 
                  alt={user.displayName} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{user.displayName || user.username}</h3>
                <p className="text-gray-500">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokAuth;