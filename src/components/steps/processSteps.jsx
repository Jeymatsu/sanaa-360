import React, { useState, useEffect } from 'react';
import { Camera, Share2, TrendingUp, Trophy, ArrowRight, ChevronRight } from 'lucide-react';

// Individual Process Card Component
const ProcessCard = ({ 
  icon, 
  title, 
  description, 
  stepNumber,
  isActive = false,
  onClick
}) => {
  return (
    <div 
      className={`relative group flex-1 min-w-0 ${isActive ? 'transform -translate-y-4' : ''} 
        transition-all duration-500 cursor-pointer`}
      onClick={onClick}
    >
      {/* Step Number Badge */}
      <div className={`absolute -top-4 -left-4 w-10 h-10 
        ${isActive ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gray-200'} 
        text-${isActive ? 'white' : 'gray-900'} rounded-full flex items-center justify-center 
        font-bold text-base z-10 shadow-md transition-all duration-300
        ${isActive ? 'scale-110' : ''}`}>
        {stepNumber}
      </div>
      
      <div className={`bg-white rounded-2xl overflow-hidden border-2 
        ${isActive ? 'border-red-500 shadow-red-400/20 shadow-xl' : 'border-gray-200'} 
        group-hover:border-red-400/50 group-hover:shadow-md transition-all duration-300 h-full backdrop-blur-sm`}>
        <div className="p-6 relative overflow-hidden">
          {/* Background Gradient Effect */}
          <div className={`absolute inset-0 bg-gradient-to-br 
            ${isActive ? 'from-red-500/10 to-transparent' : 'from-gray-100/10 to-transparent'} 
            transition-opacity duration-300 group-hover:opacity-50 opacity-30`}></div>
          
          {/* Icon */}
          <div className={`mb-5 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
            ${isActive ? 'bg-red-500 scale-110' : 'bg-gray-100 group-hover:bg-red-500/10'}`}>
            {React.cloneElement(icon, {
              className: `h-7 w-7 ${isActive ? 'text-white' : 'text-red-500'} transition-colors duration-300`
            })}
          </div>
          
          {/* Content */}
          <h3 className="text-xl font-bold mb-3 text-gray-900 relative z-10 tracking-tight">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed relative z-10">{description}</p>
          
          {/* Read More Button (Only visible on active card) */}
          {isActive && (
            <button className="mt-4 text-red-500 text-sm font-semibold flex items-center group-hover:text-red-600 transition-colors duration-300">
              Learn more <ChevronRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
      
      {/* Connection Line */}
      {stepNumber < 4 && (
        <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent
          group-hover:from-red-400/50 transition-all duration-300">
          <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full 
            ${isActive ? 'bg-red-500 scale-125' : 'bg-gray-300'} group-hover:bg-red-400 transition-all duration-300`}></div>
        </div>
      )}
    </div>
  );
};

// Mobile Step Component
const MobileStep = ({ 
  icon, 
  title, 
  description, 
  stepNumber, 
  isActive, 
  isLast,
  onClick
}) => {
  return (
    <div className="flex group cursor-pointer" onClick={onClick}>
      <div className="relative flex flex-col items-center mr-5">
        <div className={`w-10 h-10 rounded-full 
          ${isActive ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gray-200'} 
          flex items-center justify-center font-bold text-${isActive ? 'white' : 'gray-900'} 
          z-10 shrink-0 transition-all duration-300 group-hover:scale-110`}>
          {stepNumber}
        </div>
        {!isLast && (
          <div className={`w-0.5 h-full bg-gradient-to-b 
            ${isActive ? 'from-red-500 to-red-200' : 'from-gray-200 to-gray-100'} 
            absolute top-10 left-1/2 transform -translate-x-1/2 z-0`}></div>
        )}
      </div>
      
      <div className={`bg-white rounded-xl p-5 border-2 
        ${isActive ? 'border-red-500 shadow-lg' : 'border-gray-200'} 
        flex-grow group-hover:border-red-400/30 transition-all duration-300 backdrop-blur-sm`}>
        <div className="flex items-center mb-3">
          <div className={`w-12 h-12 rounded-lg ${isActive ? 'bg-red-500' : 'bg-gray-100'} 
            flex items-center justify-center mr-4 group-hover:bg-red-500/10 transition-all duration-300`}>
            {React.cloneElement(icon, {
              className: `h-6 w-6 ${isActive ? 'text-white' : 'text-red-500'} transition-colors duration-300`
            })}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        
        {/* Read More Button (Only visible on active step) */}
        {isActive && (
          <button className="mt-3 text-red-500 text-sm font-semibold flex items-center group-hover:text-red-600 transition-colors duration-300">
            Learn more <ChevronRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
};

// Progress Indicator Component
const ProgressIndicator = ({ total, current }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto mt-12 mb-8">
      <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
        <span>Getting Started</span>
        <span>{current}/{total} Steps</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Main Process Steps Component
const ProcessSteps = ({ initialActiveStep = 1 }) => {
  const [activeStep, setActiveStep] = useState(initialActiveStep);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [autoplayIntervalId, setAutoplayIntervalId] = useState(null);

  const steps = [
    {
      id: 1,
      icon: <Camera />,
      title: "Create",
      description: "Create your video on TikTok using our challenge hashtag #SANAA360"
    },
    {
      id: 2,
      icon: <Share2 />,
      title: "Submit",
      description: "Submit your TikTok link to our platform and verify your profile"
    },
    {
      id: 3,
      icon: <TrendingUp />,
      title: "Engage",
      description: "Get likes, comments and shares from fans to increase your rankings"
    },
    {
      id: 4,
      icon: <Trophy />,
      title: "Win",
      description: "Win cash prizes, brand sponsorships, and gain exposure to our network"
    }
  ];

  // Function to handle step change
  const handleStepChange = (step) => {
    // Stop autoplay if user manually changes step
    if (isAutoPlaying) {
      stopAutoplay();
    }
    setActiveStep(step);
  };

  // Function to handle next step
  const handleNextStep = () => {
    setActiveStep(prev => prev < steps.length ? prev + 1 : 1);
  };

  // Toggle autoplay
  const toggleAutoplay = () => {
    if (isAutoPlaying) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  };

  // Start autoplay
  const startAutoplay = () => {
    setIsAutoPlaying(true);
    const intervalId = setInterval(() => {
      setActiveStep(prev => prev < steps.length ? prev + 1 : 1);
    }, 3000);
    setAutoplayIntervalId(intervalId);
  };

  // Stop autoplay
  const stopAutoplay = () => {
    setIsAutoPlaying(false);
    if (autoplayIntervalId) {
      clearInterval(autoplayIntervalId);
      setAutoplayIntervalId(null);
    }
  };

  // Start autoplay on component mount and clean up on unmount
  useEffect(() => {
    // Start autoplay when component mounts
    if (isAutoPlaying && !autoplayIntervalId) {
      const intervalId = setInterval(() => {
        setActiveStep(prev => prev < steps.length ? prev + 1 : 1);
      }, 3000);
      setAutoplayIntervalId(intervalId);
    }
    
    // Clean up on component unmount
    return () => {
      if (autoplayIntervalId) {
        clearInterval(autoplayIntervalId);
      }
    };
  }, [autoplayIntervalId, isAutoPlaying, steps.length]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff0000_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block mb-2 px-4 py-1 bg-red-50 rounded-full">
            <span className="text-red-600 text-sm font-semibold">Simple 4-Step Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">
            How <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">SANAA360</span> Works
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Join our challenges in four simple steps and showcase your talent to Kenya and beyond
          </p>
        </div>
        
    
        {/* Progress Indicator */}
        <ProgressIndicator total={steps.length} current={activeStep} />
        
        {/* Mobile Steps */}
        <div className="md:hidden space-y-8 relative max-w-md mx-auto mb-10">
          {steps.map((step, index) => (
            <MobileStep
              key={step.id}
              icon={step.icon}
              title={step.title}
              description={step.description}
              stepNumber={step.id}
              isActive={step.id === activeStep}
              isLast={index === steps.length - 1}
              onClick={() => handleStepChange(step.id)}
            />
          ))}
        </div>
        
        {/* Desktop Steps */}
        <div className="hidden md:flex md:gap-10 relative max-w-6xl mx-auto">
          {steps.map((step) => (
            <ProcessCard
              key={step.id}
              icon={step.icon}
              title={step.title}
              description={step.description}
              stepNumber={step.id}
              isActive={step.id === activeStep}
              onClick={() => handleStepChange(step.id)}
            />
          ))}
        </div>
        
        {/* Navigation Controls */}
        <div className="flex justify-center gap-2 mt-12">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepChange(step.id)}
              className={`w-3 h-3 rounded-full transition-all duration-300 
                ${step.id === activeStep ? 'bg-red-500 w-10' : 'bg-gray-300 hover:bg-red-300'}`}
              aria-label={`Go to step ${step.id}`}
            />
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-red-500 to-red-700 text-white px-10 py-4 rounded-full font-bold 
            hover:from-red-600 hover:to-red-800 transition-all duration-300 inline-flex items-center shadow-lg
            hover:shadow-red-400/30 group">
            <Camera className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            Start Creating Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <p className="mt-4 text-gray-500 text-sm">No registration fees. Join 10,000+ creators.</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessSteps;