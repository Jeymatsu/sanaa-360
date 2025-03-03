import React, { useState, useRef } from 'react';
import { Play, TrendingUp, ChevronRight, X } from 'lucide-react';

const Hero = ({ 
  title = "#DundaBanjuChallenge",
  description = "Show your dance talent, win Ksh 100,000, and get discovered by top brands in Kenya!",
  sponsor = "COCA-COLA",
  prize = "Ksh 100,000",
  daysLeft = 3,
  participants = 5243,
  category = "Dance",
  videoUrl = "/video.mp4"
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };
  return (
    <div className="bg-black text-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Abstract geometric shapes for visual interest */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-900 via-black to-red-900 opacity-30"></div>
        
        {/* Animated circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-red-700 rounded-full blur-3xl opacity-15"></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-yellow-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="absolute h-1 bg-red-500 opacity-30"
              style={{
                width: '150%',
                top: `${i * 15}%`,
                left: '-25%',
                transform: 'rotate(-15deg)',
              }}
            ></div>
          ))}
        </div>
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black to-black opacity-70"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="mb-4 inline-flex items-center space-x-2">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                SPONSORED BY {sponsor}
              </span>
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                LIVE NOW
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-red-500">Join the</span> {title}
            </h1>
            
            <p className="text-xl mb-8 text-gray-300 max-w-lg">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-gray-300">Prize: <span className="text-white font-bold">{prize}</span></span>
              </div>
              
              <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center">
                <Clock className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-300"><span className="text-white font-bold">{daysLeft}</span> days left</span>
              </div>
              
              <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-gray-300"><span className="text-white font-bold">{participants.toLocaleString()}</span> participants</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition flex items-center justify-center group">
                <Play className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Join Challenge
              </button>
              <button className="bg-transparent border-2 border-gray-700 hover:border-red-500 hover:text-red-500 px-8 py-4 rounded-full font-bold text-lg transition flex items-center">
                Learn More
                <ChevronRight className="ml-1 h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Right Content - Video Preview */}
          <div className="md:w-1/2 md:pl-12">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gray-800 group shadow-lg shadow-red-900/20">
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-20 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {category}
              </div>
              
              {/* Days Left Badge */}
              <div className="absolute top-4 right-4 z-20 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {daysLeft} days left
              </div>
              
              {/* Video Background */}
              <div className="relative aspect-video">
                {/* Background Video (Muted and Autoplaying) */}
                <video 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={videoUrl} type="video/mp4" />
                  {/* Fallback image if video fails to load */}
                  <img 
                    src="/banner.jpg" 
                    alt={`${title} preview`} 
                    className="w-full h-full object-cover"
                  />
                </video>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                
                {/* Play Button - Opens full player when clicked */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="bg-red-600 rounded-full p-5 shadow-lg transform transition-transform duration-300 group-hover:scale-110"
                    onClick={openVideoModal}
                    aria-label="Play video with sound"
                  >
                    <Play className="h-10 w-10 text-white" />
                  </button>
                </div>
                
                {/* Challenge Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">{title}</h3>
                      <div className="flex items-center text-sm text-gray-300 mt-1">
                        <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
                        <span>Trending Challenge</span>
                      </div>
                    </div>
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
                      {prize}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-1 bg-gray-800">
                <div className="h-full bg-red-600" style={{ width: '70%' }}></div>
              </div>
              
              {/* Stats */}
              <div className="bg-gray-900 p-4 flex justify-between text-sm">
                <span className="text-gray-300">{participants.toLocaleString()} participants</span>
                <span className="text-red-500">Sponsored by {sponsor}</span>
              </div>
            </div>
            
           
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">
            <button 
              className="absolute top-4 right-4 bg-red-600 rounded-full p-2 text-white z-10 hover:bg-red-700 transition"
              onClick={closeVideoModal}
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="aspect-video w-full">
              <video 
                className="w-full h-full object-cover"
                controls
                autoPlay
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="p-4 bg-gray-900">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-gray-300 text-sm mt-1">Sponsored by {sponsor} • {participants.toLocaleString()} participants</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Import these icons at the top of your file
const Trophy = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 22V8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14" />
    <path d="M4 9v3c0 2.5 3.5 4 7 4s7-1.5 7-4V9" />
  </svg>
);

const Clock = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Users = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default Hero;