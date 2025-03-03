import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50 border-b border-red-700">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold flex items-center">
              <span className="mr-2 text-red-500">SANAA</span>
              <span className="text-white">360</span>
              <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">BETA</span>
            </a>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-red-400 py-2 transition-colors duration-200">Home</a>
            <div className="relative group" ref={dropdownRef}>
              <button 
                className="flex items-center hover:text-red-400 py-2 transition-colors duration-200"
                onClick={toggleDropdown}
              >
                Challenges
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-black text-white border border-red-700 ${isDropdownOpen ? 'block' : 'hidden'} md:group-hover:block transition-all duration-200`}>
                <div className="py-1">
                  <a href="/challenges/dance" className="block px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                    Dance Challenges
                  </a>
                  <a href="/challenges/comedy" className="block px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                    Comedy Challenges
                  </a>
                  <a href="/challenges/music" className="block px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                    Music Challenges
                  </a>
                  <a href="/challenges/all" className="block px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                    All Challenges
                  </a>
                </div>
              </div>
            </div>
            <a href="/leaderboard" className="hover:text-red-400 py-2 transition-colors duration-200">Leaderboard</a>
            <a href="/merch" className="hover:text-red-400 py-2 transition-colors duration-200">Merch</a>
            <a href="/about" className="hover:text-red-400 py-2 transition-colors duration-200">About</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <a href="/login" className="hover:text-red-400 transition-colors duration-200">Login</a>
            <a href="/signup" className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors duration-200">
              Sign Up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="text-white focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-red-500" />
              ) : (
                <Menu className="h-6 w-6 text-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-red-800" ref={menuRef}>
            <a href="/" className="block py-2 hover:text-red-400 transition-colors duration-200">Home</a>
            <button 
              className="flex items-center justify-between w-full py-2 hover:text-red-400 transition-colors duration-200"
              onClick={toggleDropdown}
            >
              <span>Challenges</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="pl-4 mt-1 mb-2 border-l-2 border-red-700 bg-black bg-opacity-70">
                <a href="/challenges/dance" className="block py-2 hover:text-red-400 transition-colors duration-200">
                  Dance Challenges
                </a>
                <a href="/challenges/comedy" className="block py-2 hover:text-red-400 transition-colors duration-200">
                  Comedy Challenges
                </a>
                <a href="/challenges/music" className="block py-2 hover:text-red-400 transition-colors duration-200">
                  Music Challenges
                </a>
                <a href="/challenges/all" className="block py-2 hover:text-red-400 transition-colors duration-200">
                  All Challenges
                </a>
              </div>
            )}
            
            <a href="/leaderboard" className="block py-2 hover:text-red-400 transition-colors duration-200">Leaderboard</a>
            <a href="/merch" className="block py-2 hover:text-red-400 transition-colors duration-200">Merch</a>
            <a href="/about" className="block py-2 hover:text-red-400 transition-colors duration-200">About</a>
            
            <div className="mt-4 flex flex-col space-y-2">
              <a href="/login" className="text-center py-2 border border-red-700 rounded-lg hover:bg-red-900 transition-colors duration-200">
                Login
              </a>
              <a href="/signup" className="text-center bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
                Sign Up
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;