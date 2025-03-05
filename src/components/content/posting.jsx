import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore'; // Adjust path as needed

// API endpoint for TikTok content posting
const API_URL = 'https://sanaa-360-backend.onrender.com/api/v1/content';

const TikTokUploader = () => {
  // Get auth state and functions from the auth store
  const { 
    user, 
    isAuthenticated, 
    checkAuthStatus, 
    checkAndRefreshTokenIfNeeded,
    error: authError
  } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadType, setUploadType] = useState('video'); // 'video' or 'photo'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [publishId, setPublishId] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check auth status when component mounts
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthStatus();
    };
    
    verifyAuth();
  }, [checkAuthStatus]);

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Update error state if auth error occurs
  useEffect(() => {
    if (authError) {
      setError(`Authentication error: ${authError}`);
    }
  }, [authError]);

  // Handle video file selection
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.includes('video/')) {
        setError('Please select a valid video file');
        return;
      }
      
      // Check file size (50MB limit as an example)
      if (file.size > 50 * 1024 * 1024) {
        setError('Video file is too large. Maximum size is 50MB.');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  // Handle photo files selection
  const handlePhotoFilesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types and sizes
    const invalidFiles = files.filter(file => !file.type.includes('image/'));
    
    if (invalidFiles.length > 0) {
      setError('One or more selected files are not valid images');
      return;
    }
    
    // Check file sizes (5MB per photo as an example)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      setError('One or more photos exceed the 5MB size limit');
      return;
    }
    
    setSelectedPhotos(files);
    setError(null);
  };

  // Handle direct upload of video file to TikTok
  const uploadVideoDirectly = async (file, uploadUrl) => {
    try {
      // Upload the file directly to TikTok's server
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      // Create a Promise to handle the XHR response
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error occurred during upload'));
        xhr.onabort = () => reject(new Error('Upload was aborted'));
      });
      
      // Set up the request
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', 'video/mp4');
      xhr.setRequestHeader('Content-Range', `bytes 0-${file.size - 1}/${file.size}`);
      
      // Send the file
      xhr.send(file);
      
      // Wait for the upload to complete
      await uploadPromise;
      
      return true;
    } catch (error) {
      console.error('Direct upload failed:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure the user is authenticated
    if (!isAuthenticated || !user) {
      setError('You must be logged in with TikTok to upload content');
      return;
    }
    
    // Check and refresh token if needed before upload
    const tokenValid = await checkAndRefreshTokenIfNeeded();
    if (!tokenValid) {
      setError('Authentication session expired. Please log in again.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    setPublishId(null);
    setUploadStatus(null);
    setUploadProgress(0);

    try {
      if (uploadType === 'video') {
        // Validate video file
        if (!selectedFile) {
          throw new Error('Please select a video file');
        }

        // First initialize the upload with TikTok
        const initResponse = await axios.post(`${API_URL}/tiktok/post-video`, {
          userId: user.id, // From the auth store
          fileSize: selectedFile.size,
          title,
          description
        }, { withCredentials: true });

        const { publishId, uploadUrl } = initResponse.data;
        setPublishId(publishId);
        
        // Now upload the file directly to TikTok's servers
        try {
          await uploadVideoDirectly(selectedFile, uploadUrl);
          setSuccess('Video uploaded successfully to TikTok!');
        } catch (uploadError) {
          throw new Error(`Failed to upload video: ${uploadError.message}`);
        }
        
      } else {
        // Photo upload
        if (!selectedPhotos || selectedPhotos.length === 0) {
          throw new Error('Please select at least one photo');
        }

        // For photos, we need to upload through our server since TikTok requires URLs
        const formData = new FormData();
        formData.append('userId', user.id);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('coverIndex', 0); // First photo as cover
        
        // Append all photo files
        selectedPhotos.forEach(photo => {
          formData.append('photos', photo);
        });
        
        const response = await axios.post(
          `${API_URL}/tiktok/post-photos`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setUploadProgress(progress);
            }
          }
        );
        
        setPublishId(response.data.publishId);
        setSuccess('Photos uploaded successfully to TikTok!');
      }

      // Set up an interval to check the upload status
      if (publishId) {
        const interval = setInterval(async () => {
          try {
            // Check and refresh token if needed before status check
            await checkAndRefreshTokenIfNeeded();
            
            const statusResponse = await axios.get(
              `${API_URL}/tiktok/check-upload-status/${user.id}/${publishId}`,
              { withCredentials: true }
            );
            
            setUploadStatus(statusResponse.data.status);
            
            // If the upload is complete or failed, stop checking
            if (
              statusResponse.data.status === 'PUBLISHED' ||
              statusResponse.data.status === 'FAILED'
            ) {
              clearInterval(interval);
            }
          } catch (statusError) {
            console.error('Error checking upload status:', statusError);
            // If we get an auth error during status check, attempt to refresh token
            if (statusError.response?.status === 401) {
              const refreshed = await checkAndRefreshTokenIfNeeded();
              if (!refreshed) {
                clearInterval(interval);
                setError('Authentication expired during upload monitoring');
              }
            }
          }
        }, 5000); // Check every 5 seconds

        setStatusCheckInterval(interval);
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Handle different types of errors
      if (err.response?.status === 401) {
        setError('Your TikTok session has expired. Please log in again.');
      } else {
        setError(err.response?.data?.error || err.message || 'Upload failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, show login message
  if (!isAuthenticated || !user) {
    return (
      <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload to TikTok</h2>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          You need to log in with TikTok before you can upload content.
        </div>
        <p className="text-center">
          Please log in with your TikTok account to continue.
        </p>
      </div>
    );
  }

  // Check if user has necessary scopes for content posting
  const hasContentScope = user.scope && (
    user.scope.includes('video.upload') || 
    user.scope.includes('video.publish')
  );

  if (!hasContentScope) {
    return (
      <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload to TikTok</h2>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Your TikTok account doesn't have the necessary permissions.
        </div>
        <p className="text-center mb-4">
          You need to grant video upload permissions to this app to continue.
        </p>
        <div className="text-center">
          <button 
            onClick={() => window.location.href = '/auth/tiktok'} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Reconnect with TikTok
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload to TikTok</h2>
      
      <div className="mb-4 bg-blue-50 p-3 rounded">
        <p className="text-sm">
          Connected as: <span className="font-medium">{user.displayName || user.username}</span>
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {publishId && (
        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="font-medium">Publish ID: {publishId}</p>
          {uploadStatus && <p>Status: {uploadStatus}</p>}
          
          {uploadStatus === 'PUBLISHED' && (
            <p className="text-green-600 font-medium mt-2">
              🎉 Your content has been uploaded to TikTok! Check your TikTok notifications
              to review and post it.
            </p>
          )}
          
          {uploadStatus === 'FAILED' && (
            <p className="text-red-600 font-medium mt-2">
              Upload failed. Please try again or contact support.
            </p>
          )}
        </div>
      )}
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Uploading: {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Upload Type:</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                value="video"
                checked={uploadType === 'video'}
                onChange={() => setUploadType('video')}
              />
              <span className="ml-2">Video</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                value="photo"
                checked={uploadType === 'photo'}
                onChange={() => setUploadType('photo')}
              />
              <span className="ml-2">Photos</span>
            </label>
          </div>
        </div>
        
        {uploadType === 'video' && (
          <div className="mb-4">
            <label htmlFor="videoFile" className="block text-gray-700 font-medium mb-2">
              Select Video:
            </label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={handleVideoFileChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum file size: 50MB. Supported formats: MP4, MOV.
            </p>
          </div>
        )}
        
        {uploadType === 'photo' && (
          <div className="mb-4">
            <label htmlFor="photoFiles" className="block text-gray-700 font-medium mb-2">
              Select Photos:
            </label>
            <input
              type="file"
              id="photoFiles"
              accept="image/*"
              onChange={handlePhotoFilesChange}
              multiple
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Select up to 10 photos. Maximum size: 5MB per photo.
            </p>
            
            {selectedPhotos.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title (optional):
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description (optional):
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description with #hashtags and @mentions"
            rows={3}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload to TikTok"}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Note: After uploading, you'll receive a notification in your TikTok app to review and
          post your content.
        </p>
      </div>
    </div>
  );
};

export default TikTokUploader;