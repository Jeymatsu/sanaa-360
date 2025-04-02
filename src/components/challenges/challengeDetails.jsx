import React, { useState, useEffect } from 'react';
import { Calendar, Award, Check, AlertTriangle, Clock, Share2, Info } from 'lucide-react';
import DefaultLayout from '../../pages/default/default';
import useAuthStore from '../../lib/useAuthStore';
import TikTokSubmissionModal from '../submission/submissionModal';


const ChallengeDetails = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get auth state from Zustand store
  const { 
    isAuthenticated, 
    user, 
    checkAuthStatus, 
    checkAndRefreshTokenIfNeeded 
  } = useAuthStore();

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      await checkAuthStatus();
    };
    
    checkAuth();
    
    // Fetch challenge data
    const fetchChallenge = async () => {
      try {
        // Get the challenge ID from the URL parameters
        let challengeId = window.location.pathname.split('/').pop();
        
        // Decode the URL-encoded ID
        challengeId = decodeURIComponent(challengeId);
        
        // Make the API request
        const response = await fetch(`https://sanaa-360-backend.onrender.com/api/v1/challenges/challenges/${challengeId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch challenge');
        }
        
        const responseData = await response.json();
        
        if (!responseData.data || !responseData.data.length) {
          throw new Error('No challenge data returned from API');
        }
        
        // Get the first item from the data array
        const challengeData = responseData.data[0];
        
        // Parse rules if it's a string representation of an array
        if (typeof challengeData.rules === 'string') {
          try {
            challengeData.rules = JSON.parse(challengeData.rules);
          } catch (e) {
            console.error('Error parsing rules:', e);
            challengeData.rules = [];
          }
        }
        
        // Calculate days left if not provided by API
        if (!challengeData.daysLeft && challengeData.endDate) {
          const now = new Date();
          const endDate = challengeData.endDate._seconds ? 
            new Date(challengeData.endDate._seconds * 1000) : 
            new Date(challengeData.endDate);
              
          const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          challengeData.daysLeft = daysLeft > 0 ? daysLeft : 0;
        }
        
        // Set expired flag if not provided
        if (challengeData.daysLeft === 0 && challengeData.isExpired === undefined) {
          challengeData.isExpired = true;
        }
        
        setChallenge(challengeData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [checkAuthStatus]);

  // Format date function
  const formatDate = (dateObj) => {
    // Handle different date formats
    let date;
    
    // Handle Firestore timestamp format {_seconds: number, _nanoseconds: number}
    if (dateObj && dateObj._seconds) {
      date = new Date(dateObj._seconds * 1000);
    }
    // Case 1: It's a Firestore timestamp (has toDate method)
    else if (dateObj && typeof dateObj.toDate === 'function') {
      date = dateObj.toDate();
    }
    // Case 2: It's a Date object already
    else if (dateObj instanceof Date) {
      date = dateObj;
    }
    // Case 3: It's a string (ISO format)
    else if (typeof dateObj === 'string') {
      date = new Date(dateObj);
    }
    // Case 4: It's a number (timestamp)
    else if (typeof dateObj === 'number') {
      date = new Date(dateObj);
    }
    // Case 5: Something else or undefined
    else {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Handle submit button click
  const handleSubmitClick = async () => {
    if (isAuthenticated) {
      // Refresh token if needed before opening modal
      await checkAndRefreshTokenIfNeeded();
      // Open the submission modal
      setIsModalOpen(true);
    } else {
      // Redirect to TikTok login
      window.location.href = 'https://sanaa-360-backend.onrender.com/api/v1/auth/tiktok/login';
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md">
            <h2 className="text-lg font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  // Use the actual challenge data from the API
  if (!challenge) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md">
            <h2 className="text-lg font-bold mb-2">Error</h2>
            <p>No challenge data available</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  const {
    title,
    description,
    startDate,
    endDate,
    daysLeft,
    prize,
    isExpired,
    isActive,
    isHot,
    hashtag,
    participants,
    submissions,
    category,
    image,
    sponsor,
    rules,
    eligibility,
    submissionInstructions,
    judging
  } = challenge;

  // Challenge status for badge display
  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <div className="flex items-center gap-1 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
          <AlertTriangle size={16} />
          <span>Ended</span>
        </div>
      );
    } else if (isActive) {
      return (
        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          <Check size={16} />
          <span>Active</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
          <Clock size={16} />
          <span>Coming Soon</span>
        </div>
      );
    }
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Challenge Banner */}
        <div 
          className="relative h-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 w-full p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              {isHot && (
                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  HOT 🔥
                </span>
              )}
              <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded">
                {category}
              </span>
              {getStatusBadge()}
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm opacity-90">{hashtag}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Key Stats Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-red-600 font-bold text-xl">{daysLeft}</div>
                <div className="text-gray-600 text-xs">Days Left</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-bold text-xl">{participants}</div>
                <div className="text-gray-600 text-xs">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-bold text-xl">{submissions}</div>
                <div className="text-gray-600 text-xs">Submissions</div>
              </div>
            </div>
          </div>

          {/* Prize & Date Overview */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-red-600 flex-shrink-0" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium text-sm">
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="text-red-600 flex-shrink-0" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Prize</div>
                  <div className="font-medium text-sm">{prize}</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          {!isExpired && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 text-center">
              <button 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
                onClick={handleSubmitClick}
              >
                {isActive 
                  ? (isAuthenticated ? "Submit Your TikTok Entry" : "Connect TikTok & Join") 
                  : "Remind Me When It Starts"}
              </button>
            </div>
          )}

          {/* Content Tabs */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="flex border-b">
              <button 
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'details' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
              >
                Details
              </button>
              <button 
                onClick={() => setActiveTab('rules')}
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'rules' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
              >
                Rules
              </button>
              <button 
                onClick={() => setActiveTab('howto')}
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'howto' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
              >
                How to Enter
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'details' && (
                <div>
                  <h2 className="text-lg font-bold mb-3 text-gray-800">About This Challenge</h2>
                  <p className="text-gray-700 mb-4">{description}</p>
                  
                  <div className="mb-4">
                    <h3 className="text-md font-semibold mb-2 text-gray-800">Eligibility</h3>
                    <p className="text-gray-700 text-sm">{eligibility}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-md font-semibold mb-2 text-gray-800">Judging Criteria</h3>
                    <p className="text-gray-700 text-sm">{judging}</p>
                  </div>
                  
                  {sponsor && (
                    <div className="flex items-center text-sm text-gray-600 mt-4">
                      <span className="mr-2">Sponsored by:</span>
                      {sponsor.logo && (
                        <img src={sponsor.logo} alt={sponsor.name} className="w-6 h-6 rounded-full mr-2" />
                      )}
                      <span>{sponsor.name}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'rules' && (
                <div>
                  <h2 className="text-lg font-bold mb-3 text-gray-800">Challenge Rules</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {Array.isArray(rules) ? (
                      rules.map((rule, index) => (
                        <li key={index} className="text-gray-700 text-sm">{rule}</li>
                      ))
                    ) : (
                      <li className="text-gray-700 text-sm">No specific rules provided</li>
                    )}
                  </ul>
                </div>
              )}

              {activeTab === 'howto' && (
                <div>
                  <h2 className="text-lg font-bold mb-3 text-gray-800">How to Submit Your Entry</h2>
                  <p className="text-gray-700 mb-4 text-sm">{submissionInstructions}</p>
                  
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <h3 className="font-semibold mb-2">Quick Steps:</h3>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Create your content following the rules</li>
                      <li>Post it to social media with {hashtag}</li>
                      <li>Submit the link using the button above</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="flex justify-between mb-6">
            <button className="flex items-center gap-1 text-gray-600 text-sm">
              <Share2 size={16} />
              <span>Share</span>
            </button>
            
            <button className="flex items-center gap-1 text-gray-600 text-sm">
              <Info size={16} />
              <span>Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* TikTok Submission Modal */}
      {isModalOpen && (
        <TikTokSubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          challenge={challenge}
          user={user}
        />
      )}
    </DefaultLayout>
  );
};

export default ChallengeDetails;