import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Award, Users, FileText, Check, AlertTriangle } from 'lucide-react';

const ChallengeDetails = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        // Get the challenge ID from the URL parameters
        let challengeId = window.location.pathname.split('/').pop();
        
        // Decode the URL-encoded ID
        challengeId = decodeURIComponent(challengeId);
        
        // Make the API request with the original ID (server should handle any needed encoding)
        const response = await fetch(`http://localhost:5001/api/v1/challenges/challenges/${challengeId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch challenge');
        }
        
        const data = await response.json();
        setChallenge(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Mock data for display purposes
  const mockChallenge = challenge || {
    id: "tiktokdancechallenge-12345678",
    title: "TikTok Dance Challenge",
    description: "Create an original dance routine to our sponsor's latest track and share it on TikTok.",
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 3, 1),
    durationInDays: 30,
    daysLeft: 26,
    prize: "KSH 100,000",
    isExpired: false,
    isActive: true,
    isHot: true,
    hashtag: "#tiktokdancechallenge",
    participants: 253,
    submissions: 187,
    viewCount: 1256,
    category: "Entertainment",
    image: "/api/placeholder/800/400",
    sponsor: {
      name: "Beats Music Kenya",
      logo: "/api/placeholder/200/200",
      banner: "/api/placeholder/800/200",
      id: "beats-music-kenya-1234"
    },
    rules: [
      "One submission per participant",
      "Video must be between 15-60 seconds",
      "Must use original audio provided by sponsor",
      "Must include required hashtags in description"
    ],
    eligibility: "Open to all Kenyan residents aged 18 and above",
    submissionInstructions: "Submit your TikTok video link through the submission form on this page",
    judging: "Based on creativity, audience engagement, and adherence to challenge theme"
  };

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
    viewCount,
    category,
    image,
    sponsor,
    rules,
    eligibility,
    submissionInstructions,
    judging
  } = mockChallenge;

  const formatDate = (dateObj) => {
    // Handle different date formats
    let date;
    
    // Case 1: It's a Firestore timestamp (has toDate method)
    if (dateObj && typeof dateObj.toDate === 'function') {
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
    
    // Format the date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Challenge Banner */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            {isHot && (
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                HOT 🔥
              </span>
            )}
            <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded">
              {category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-lg opacity-90">{hashtag}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Challenge Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-red-600">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-red-600 font-bold text-2xl">{daysLeft}</div>
                  <div className="text-gray-600 text-sm">Days Left</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold text-2xl">{participants}</div>
                  <div className="text-gray-600 text-sm">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold text-2xl">{submissions}</div>
                  <div className="text-gray-600 text-sm">Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold text-2xl">{viewCount}</div>
                  <div className="text-gray-600 text-sm">Views</div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">About This Challenge</h2>
              <p className="text-gray-700 mb-6">{description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="text-red-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="text-red-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-500">Prize</div>
                    <div className="font-medium">{prize}</div>
                  </div>
                </div>
              </div>
              
              {/* Challenge Status */}
              {isExpired ? (
                <div className="bg-gray-100 text-gray-700 p-4 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={20} />
                  <span>This challenge has ended</span>
                </div>
              ) : isActive ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
                  <Check size={20} />
                  <span>This challenge is currently active</span>
                </div>
              ) : (
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg flex items-center gap-2">
                  <Clock size={20} />
                  <span>This challenge has not started yet</span>
                </div>
              )}
            </div>

           
            {/* Eligibility */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Eligibility</h2>
              <p className="text-gray-700">{eligibility}</p>
            </div>

            {/* Submission & Judging */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-red-600" size={20} />
                  <h2 className="text-xl font-bold text-gray-800">How to Submit</h2>
                </div>
                <p className="text-gray-700">{submissionInstructions}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="text-red-600" size={20} />
                  <h2 className="text-xl font-bold text-gray-800">Judging Criteria</h2>
                </div>
                <p className="text-gray-700">{judging}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* CTA Button */}
            {!isExpired && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition">
                  Submit Your Entry
                </button>
                {isActive ? (
                  <p className="text-sm text-gray-600 mt-2">Challenge is active. Submit now!</p>
                ) : (
                  <p className="text-sm text-gray-600 mt-2">Challenge starts on {formatDate(startDate)}</p>
                )}
              </div>
            )}

            {/* Sponsor Card */}
            {/* <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div 
                className="h-32 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${sponsor.banner})` }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover bg-white -mt-12"
                  />
                  <h3 className="text-lg font-bold">{sponsor.name}</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Sponsored by {sponsor.name}, bringing you this exciting challenge with amazing prizes!
                </p>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition text-sm">
                  View Sponsor Profile
                </button>
              </div>
            </div> */}

            {/* Share Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Share This Challenge</h3>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition">
                  Facebook
                </button>
                <button className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg text-sm transition">
                  Twitter
                </button>
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm transition">
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Report Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-gray-700 text-sm mb-4">
                If you encounter any issues or have questions about this challenge, please contact our support team.
              </p>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition text-sm">
                Report an Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;