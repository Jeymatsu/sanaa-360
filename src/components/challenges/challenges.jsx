import React, { useState } from 'react';
import { Calendar, Clock, Play, ChevronRight, Flame, Award, Users, Filter, Search, ArrowUpRight, Star } from 'lucide-react';

// Challenge Badge Component - Improved for better contrast and accessibility
const ChallengeBadge = ({ category }) => {
  const categoryStyles = {
    dance: 'bg-blue-200 text-blue-800 border border-blue-300',
    comedy: 'bg-purple-200 text-purple-800 border border-purple-300',
    music: 'bg-green-200 text-green-800 border border-green-300',
    art: 'bg-pink-200 text-pink-800 border border-pink-300',
    fashion: 'bg-amber-200 text-amber-800 border border-amber-300',
    default: 'bg-gray-200 text-gray-800 border border-gray-300',
  };

  const style = categoryStyles[category.toLowerCase()] || categoryStyles.default;

  return (
    <div 
      className={`px-3 py-1 rounded-full text-xs font-semibold ${style} shadow-sm inline-flex items-center gap-1`}
      role="status"
    >
      {category}
    </div>
  );
};

// Time Remaining Component - Improved to include a progress bar
const TimeRemaining = ({ days, totalDays = 14, isUpcoming = false }) => {
  const Icon = isUpcoming ? Calendar : Clock;
  const style = isUpcoming ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-red-50 text-red-600 border border-red-200';
  
  // Calculate progress percentage for the visual indicator
  const progressPercent = isUpcoming ? 0 : Math.max(0, Math.min(100, ((totalDays - days) / totalDays) * 100));
  
  return (
    <div className={`group relative`}>
      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${style} shadow-sm`}>
        <Icon className="h-3.5 w-3.5 mr-1.5" />
        {isUpcoming ? `Starts in ${days}d` : `${days}d left`}
      </div>
      
      {/* Tooltip with more detailed info */}
      <div className="absolute z-10 w-48 p-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 top-full right-0 mt-1 text-xs">
        <div className="mb-1 font-medium text-gray-700">
          {isUpcoming ? "Challenge starts soon" : "Challenge ending soon"}
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Progress:</span>
          <span className="font-medium">{isUpcoming ? "Upcoming" : `${Math.round(progressPercent)}%`}</span>
        </div>
        {!isUpcoming && (
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-red-600 h-1.5 rounded-full" 
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Prize Tag Component - Enhanced with animation
const PrizeTag = ({ amount }) => (
  <div className="bg-gradient-to-r from-yellow-300 to-amber-300 text-amber-900 px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center shadow-md hover:shadow transition-all duration-300 transform hover:-translate-y-0.5">
    <Award className="h-4 w-4 mr-1.5 text-amber-700" />
    {amount}
  </div>
);

// Participant Badge Component - New component
const ParticipantsBadge = ({ count }) => (
  <div className="flex items-center text-gray-600 text-sm font-medium">
    <Users className="h-4 w-4 mr-1.5 text-gray-500" />
    <span>{count.toLocaleString()}</span>
    <span className="sr-only">participants</span>
  </div>
);

// Saved/Bookmark Feature - New Component
const SaveButton = ({ isSaved, onToggleSave }) => (
  <button 
    onClick={onToggleSave}
    className={`absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md transition-all duration-200 ${
      isSaved ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-600 hover:text-gray-700'
    }`}
    aria-label={isSaved ? "Remove from saved" : "Save challenge"}
  >
    <Star className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
  </button>
);

// Challenge Card Component - Completely redesigned
const ChallengeCard = ({ challenge }) => {
  if (!challenge) return null;

  const { id, title, category, description, image, daysLeft, participants, prize, sponsor, isHot } = challenge;
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <div className="relative group flex flex-col bg-white rounded-xl border border-gray-200 hover:border-red-400 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden h-full">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>

        {/* Save Button */}
        <SaveButton isSaved={isSaved} onToggleSave={handleToggleSave} />

        {/* Badges Container */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <ChallengeBadge category={category} />
          {isHot && (
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-md">
              <Flame className="h-3.5 w-3.5 mr-1.5" />
              TRENDING
            </div>
          )}
        </div>

        {/* Time Status */}
        <div className="absolute top-4 right-16">
          <TimeRemaining days={daysLeft} totalDays={14} />
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 rounded-full p-4 shadow-lg transform transition-transform duration-300 group-hover:scale-110 hover:bg-red-700">
            <Play className="h-6 w-6 text-white" fill="currentColor" />
          </div>
        </div>

        {/* Title on image for better visibility */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 drop-shadow-sm">
            {title}
          </h3>
          <div className="text-sm text-white/80 uppercase tracking-wide drop-shadow-sm flex items-center">
            Sponsored by <span className="font-medium ml-1">{sponsor}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-700 text-sm mb-5 line-clamp-2 flex-grow">{description}</p>

        {/* Stats and CTA Row */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <ParticipantsBadge count={participants} />
            <PrizeTag amount={prize} />
          </div>

          {/* CTA Button */}
          <button 
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow group"
            aria-label={`Join ${title} challenge`}
          >
            <span>Join Challenge</span>
            <ArrowUpRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Search and Filter Component - New Component
const ChallengeFilters = ({ categories, activeCategory, onCategoryChange, onSearch }) => {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
          placeholder="Search challenges..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <div className="mr-2 flex items-center text-gray-700 font-medium">
          <Filter className="h-4 w-4 mr-1.5" />
          <span>Filter:</span>
        </div>
        {categories.map((category, index) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

// Empty State Component
const EmptyChallengesState = () => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
      <Filter className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">No challenges found</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      Try adjusting your search or filter criteria to find challenges
    </p>
    <button className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
      View all challenges
    </button>
  </div>
);

// Main Challenges Section Component
const ChallengesSection = () => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  
  const allChallenges = [
    {
      id: 1,
      title: "#DundaChekaChallenge",
      category: "Dance",
      description: "Show off your best dance moves and creativity to the latest hit songs. Winners will be featured on our homepage!",
      image: "/api/placeholder/400/300",
      daysLeft: 3,
      participants: 5243,
      prize: "Ksh 100,000",
      sponsor: "Coca-Cola",
      isHot: true,
    },
    {
      id: 2,
      title: "#TokelezaeComedy",
      category: "Comedy",
      description: "Make Kenya laugh with your best original comedy skits about everyday situations. Weekly winners announced!",
      image: "/api/placeholder/400/301",
      daysLeft: 5,
      participants: 3187,
      prize: "Ksh 50,000",
      sponsor: "Safaricom",
      isHot: false,
    },
    {
      id: 3,
      title: "#SanaaSounds",
      category: "Music",
      description: "Showcase your musical talent and perform your original songs. Top performers will get a chance to record in a professional studio.",
      image: "/api/placeholder/400/302",
      daysLeft: 7,
      participants: 4721,
      prize: "Ksh 75,000",
      sponsor: "EABL",
      isHot: true,
    },
    {
      id: 4,
      title: "#KreaArtChallenge",
      category: "Art",
      description: "Express your creativity through digital or traditional art. Your artwork could be featured in our next exhibition.",
      image: "/api/placeholder/400/303",
      daysLeft: 10,
      participants: 2198,
      prize: "Ksh 60,000",
      sponsor: "Samsung",
      isHot: false,
    },
  ];

  const categories = ['All Categories', 'Dance', 'Comedy', 'Music', 'Art', 'Fashion'];

  // Filter challenges based on activeCategory and searchQuery
  const filteredChallenges = allChallenges.filter(challenge => {
    const matchesCategory = activeCategory === 'All Categories' || challenge.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Improved Design */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <div className="text-red-600 font-medium text-sm mb-2 tracking-wider uppercase">Explore challenges</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 group flex items-center">
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-red-600">
                Live Challenges
              </span>
              <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {filteredChallenges.length}
              </span>
            </h2>
          </div>
          <a
            href="/challenges"
            className="text-red-600 hover:text-red-700 flex items-center text-sm font-medium transition-colors duration-300 group mt-4 sm:mt-0"
            aria-label="View all challenges"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Search and Filters */}
        <ChallengeFilters 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onSearch={setSearchQuery}
        />

        {/* Current Challenges Grid with Conditional Rendering */}
        {filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <EmptyChallengesState />
        )}

        {/* Improved Call To Action Banner */}
        <div className="mt-16 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 rounded-xl shadow-lg p-6 sm:p-8 border border-red-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-red-600"></div>
            <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-orange-500"></div>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <span className="text-sm font-semibold text-red-600 tracking-wide uppercase mb-1 block">For Brands</span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Want to sponsor a challenge?</h3>
              <p className="text-gray-700">
                Reach thousands of Gen Z and Millennial Kenyans through branded challenges and grow your brand engagement.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-end">
              <button className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center group">
                <span>Partner With Us</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { 
  ChallengesSection, 
  ChallengeCard, 
  ChallengeBadge, 
  TimeRemaining, 
  PrizeTag, 
  ChallengeFilters,
  ParticipantsBadge,
  SaveButton
};

export default ChallengesSection;