import React, { useState } from 'react';
import { FaTiktok } from 'react-icons/fa';
import { LogOut, AlertCircle } from 'lucide-react';

const TikTokAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const API_BASE_URL = 'http://localhost:5001/api/v1/auth';

  const handleTikTokLogin = () => {
    window.location.href = `${API_BASE_URL}/tiktok/login`;
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const response = await fetch(`${API_BASE_URL}/auth/tiktok/logout`, { 
        credentials: 'include' 
      });
      if (!response.ok) throw new Error('Logout failed');
      setUser(null);
    } catch (error) {
      setError('Authentication error. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Enhanced Error Message */}
      {error && (
        <div className="flex items-center gap-3 bg-red-100 border border-red-200 text-red-800 p-4 rounded-xl mb-6 animate-fade-in">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Login State */}
      {!user ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all hover:shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">SANAA</span>
              <span className="text-2xl font-bold text-red-600">360</span>
              <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full">BETA</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 text-center">Creator Access</h2>
          <p className="text-gray-600 mb-8 text-center text-sm leading-relaxed">
            Connect your TikTok to join SANAA360's creative challenges
          </p>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl mb-8 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">Why Connect?</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'Submit to dance & comedy challenges',
                'Boost your visibility & followers',
                'Win cash prizes & sponsorships'
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Button */}
          <button
            onClick={handleTikTokLogin}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-900 to-black text-white font-semibold py-3.5 px-6 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaTiktok size={22} />
            <span>Connect with TikTok</span>
          </button>

          <p className="text-xs text-gray-500 mt-5 text-center leading-relaxed">
            By connecting, you agree to our{' '}
            <a href="/terms-of-service" className="text-red-600 hover:underline">Terms</a> and{' '}
            <a href="/privacy-policy" className="text-red-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      ) : (
        /* Connected State */
        <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:shadow-xl">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-900">Creator Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">TikTok account connected</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.displayName || user.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-gray-600">
                    {(user.displayName || user.username).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div>
                <h3 className="font-bold text-xl text-gray-900">{user.displayName || user.username}</h3>
                <p className="text-gray-500 text-sm">@{user.username}</p>
                <div className="flex items-center mt-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  <span className="text-xs font-medium text-green-700">Verified</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <LogOut className="h-4 w-4" />
              <span>{loggingOut ? 'Disconnecting...' : 'Disconnect'}</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed">
              Ready to shine? Visit the{' '}
              <a href="/challenges" className="text-blue-600 font-medium hover:underline transition-colors">
                Challenges
              </a>{' '}
              page to start creating!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokAuth;