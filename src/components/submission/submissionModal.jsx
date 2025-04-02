import React, { useState } from 'react';
import { X, Upload, Link, Camera, Loader2, ExternalLink, AlertTriangle, Check } from 'lucide-react';

// TikTok Submission Modal Component
const TikTokSubmissionModal = ({ isOpen, onClose, challenge, user }) => {
  const [submissionType, setSubmissionType] = useState('url'); // 'url' or 'direct'
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  if (!isOpen) return null;
  
  // Handle closing the modal and resetting form
  const handleClose = () => {
    setTiktokUrl('');
    setVideoFile(null);
    setVideoTitle('');
    setError(null);
    setSuccess(null);
    setIsSubmitting(false);
    onClose();
  };
  
  // Handle TikTok URL submission
  const handleUrlSubmission = async (e) => {
    e.preventDefault();
    
    // Validate URL
    if (!tiktokUrl.trim() || !tiktokUrl.includes('tiktok.com')) {
      setError('Please enter a valid TikTok URL');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`https://sanaa-360-backend.onrender.com/api/v1/challenges/${challenge.id}/submit-tiktok`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tiktokUrl: tiktokUrl.trim(),
          userId: user?.id // Add user ID from auth store
        }),
        credentials: 'include' // Include session cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit entry');
      }
      
      setSuccess('Your TikTok video has been submitted successfully!');
      
      // Close the modal after 3 seconds
      setTimeout(() => {
        handleClose();
        // Optionally refresh challenge data
        window.location.reload();
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle direct video upload to TikTok
  const handleDirectSubmission = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }
    
    if (!videoTitle.trim()) {
      setError('Please enter a title for your video');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First, upload the video file to our server
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('userId', user?.id); // Add user ID to form data
      
      const uploadResponse = await fetch('https://sanaa-360-backend.onrender.com/api/v1/uploads/video', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      const uploadData = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || 'Failed to upload video');
      }
      
      // Now, post to TikTok using the uploaded video URL
      const tiktokResponse = await fetch('https://sanaa-360-backend.onrender.com/api/v1/tiktok/post-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoUrl: uploadData.videoUrl,
          title: `${videoTitle} ${challenge.hashtag}`,
          privacyLevel: "PUBLIC_TO_EVERYONE",
          disableComment: false,
          userId: user?.id // Add user ID from auth store
        }),
        credentials: 'include'
      });
      
      const tiktokData = await tiktokResponse.json();
      
      if (!tiktokResponse.ok) {
        throw new Error(tiktokData.message || 'Failed to post to TikTok');
      }
      
      // Finally, submit the TikTok post to the challenge
      const trackingId = tiktokData.trackingId;
      
      // Poll for status (simplified version)
      let statusChecks = 0;
      const maxChecks = 10;
      let tiktokUrl = null;
      
      const checkStatus = async () => {
        if (statusChecks >= maxChecks) {
          // If we've checked too many times, just continue with submission
          return;
        }
        
        try {
          const statusResponse = await fetch(`https://sanaa-360-backend.onrender.com/api/v1/tiktok/post-status/${trackingId}?userId=${user?.id}`, {
            credentials: 'include'
          });
          
          const statusData = await statusResponse.json();
          
          if (statusData.status === 'PUBLISHED' && statusData.shareUrl) {
            tiktokUrl = statusData.shareUrl;
            return;
          }
          
          if (statusData.status === 'FAILED') {
            throw new Error('TikTok upload failed: ' + (statusData.errorMessage || 'Unknown error'));
          }
          
          // If still processing, check again after delay
          statusChecks++;
          await new Promise(resolve => setTimeout(resolve, 2000));
          await checkStatus();
        } catch (err) {
          console.error("Error checking status:", err);
          // Continue with submission even if status check fails
        }
      };
      
      await checkStatus();
      
      // Submit to challenge (with or without URL)
      const submitResponse = await fetch(`https://sanaa-360-backend.onrender.com/api/v1/challenges/${challenge.id}/submit-tiktok`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tiktokUrl: tiktokUrl || tiktokData.publishId,
          publishId: tiktokData.publishId,
          userId: user?.id
        }),
        credentials: 'include'
      });
      
      const submitData = await submitResponse.json();
      
      if (!submitResponse.ok) {
        throw new Error(submitData.message || 'Failed to submit to challenge');
      }
      
      setSuccess('Your video has been posted to TikTok and submitted to the challenge!');
      
      // Close the modal after 3 seconds
      setTimeout(() => {
        handleClose();
        // Optionally refresh challenge data
        window.location.reload();
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('video/')) {
        setError('Please select a valid video file');
        return;
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('Video file size should be less than 50MB');
        return;
      }
      
      setVideoFile(file);
      setError(null);
      
      // Auto-generate title from filename if empty
      if (!videoTitle) {
        const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        setVideoTitle(nameWithoutExt);
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Join {challenge.title}</h3>
          <button 
            onClick={handleClose} 
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {/* Success message */}
          {success && (
            <div className="bg-green-50 text-green-800 p-3 rounded-md mb-4 flex items-start">
              <Check className="flex-shrink-0 mr-2 mt-0.5" size={18} />
              <p>{success}</p>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4 flex items-start">
              <AlertTriangle className="flex-shrink-0 mr-2 mt-0.5" size={18} />
              <p>{error}</p>
            </div>
          )}
          
          {/* Submission type selector */}
          <div className="mb-4">
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`flex-1 py-2 px-4 text-center ${
                  submissionType === 'url' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSubmissionType('url')}
                disabled={isSubmitting}
              >
                <Link size={16} className="inline-block mr-1 mb-0.5" />
                Submit URL
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center ${
                  submissionType === 'direct' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSubmissionType('direct')}
                disabled={isSubmitting}
              >
                <Camera size={16} className="inline-block mr-1 mb-0.5" />
                Direct Post
              </button>
            </div>
          </div>
          
          {/* URL Submission Form */}
          {submissionType === 'url' && (
            <form onSubmit={handleUrlSubmission}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  TikTok Video URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.tiktok.com/@username/video/1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the URL of your TikTok video that includes {challenge.hashtag}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <a 
                  href="https://www.tiktok.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 text-sm flex items-center"
                >
                  <ExternalLink size={16} className="mr-1" />
                  Open TikTok
                </a>
                
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="inline-block mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Entry'
                  )}
                </button>
              </div>
            </form>
          )}
          
          {/* Direct Posting Form */}
          {submissionType === 'direct' && (
            <form onSubmit={handleDirectSubmission}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a title for your TikTok video"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The hashtag {challenge.hashtag} will be added automatically
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Upload Video
                </label>
                <div className={`border-2 border-dashed rounded-md p-4 text-center ${
                  videoFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-red-500'
                }`}>
                  {videoFile ? (
                    <div className="text-green-600">
                      <Check size={24} className="mx-auto mb-2" />
                      <p className="font-medium">{videoFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(videoFile.size / 1024 / 1024 * 10) / 10}MB
                      </p>
                      <button 
                        type="button" 
                        className="text-xs text-red-600 mt-2"
                        onClick={() => setVideoFile(null)}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload size={24} className="mx-auto mb-2" />
                      <p className="font-medium">Click or drag to upload</p>
                      <p className="text-xs mt-1">MP4, MOV up to 50MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  disabled={isSubmitting || !videoFile}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="inline-block mr-2 animate-spin" />
                      Uploading to TikTok...
                    </>
                  ) : (
                    'Post to TikTok & Submit'
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  This will upload your video to TikTok and submit it to the challenge
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TikTokSubmissionModal;