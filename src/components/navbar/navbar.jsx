import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../../lib/useAuthStore';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Get auth state from store
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);

  // Handle clicks outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
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

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50 border-b border-red-700">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span className="mr-2 text-red-500">SANAA</span>
              <span className="text-white">360</span>
              <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">BETA</span>
            </Link>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-red-400 py-2 transition-colors duration-200">Home</Link>
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
                  <Link to="/challenges/dance" className="block px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                    Dance Challenges
                  </Link>
                  <Link to="/challenges/comedy" className="block px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                    Comedy Challenges
                  </Link>
                  <Link to="/challenges/music" className="block px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                    Music Challenges
                  </Link>
                  <Link to="/challenges/all" className="block px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                    All Challenges
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/leaderboard" className="hover:text-red-400 py-2 transition-colors duration-200">Leaderboard</Link>
            <Link to="/merch" className="hover:text-red-400 py-2 transition-colors duration-200">Merch</Link>
            <Link to="/about" className="hover:text-red-400 py-2 transition-colors duration-200">About</Link>
          </div>

          {/* Auth Buttons or User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              // User profile with dropdown
              <div className="relative" ref={userDropdownRef}>
                <button 
                  className="flex items-center space-x-2 hover:text-red-400 transition-colors duration-200"
                  onClick={toggleUserDropdown}
                >
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.displayName} 
                      className="w-8 h-8 rounded-full object-cover border border-red-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user.displayName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {/* User dropdown menu */}
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black text-white border border-red-700 ${isUserDropdownOpen ? 'block' : 'hidden'} transition-all duration-200`}>
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-red-900 transition-colors duration-200">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 hover:bg-red-900 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Login/Signup buttons for non-authenticated users
              <>
                <Link to="/login" className="hover:text-red-400 transition-colors duration-200">Login</Link>
                <Link to="/signup" className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors duration-200">
                  Sign Up
                </Link>
              </>
            )}
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
            <Link to="/" className="block py-2 hover:text-red-400 transition-colors duration-200">Home</Link>
            <button 
              className="flex items-center justify-between w-full py-2 hover:text-red-400 transition-colors duration-200"
              onClick={toggleDropdown}
            >
              <span>Challenges</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="pl-4 mt-1 mb-2 border-l-2 border-red-700 bg-black bg-opacity-70">
                <Link to="/challenges/dance" className="block py-2 hover:text-red-400 transition-colors duration-200">
                  Dance Challenges
                </Link>
                <Link to="/challenges/comedy" className="block py-2 hover:text-red-400 transition-colors duration-200">
                  Comedy Challenges
                </Link>
                <Link to="/challenges/music" className="block py-2 hover:text-red-400 transition-colors duration-200">
                  Music Challenges
                </Link>
                <Link to="/challenges/all" className="block py-2 hover:text-red-400 transition-colors duration-200">
                  All Challenges
                </Link>
              </div>
            )}
            
            <Link to="/leaderboard" className="block py-2 hover:text-red-400 transition-colors duration-200">Leaderboard</Link>
            <Link to="/merch" className="block py-2 hover:text-red-400 transition-colors duration-200">Merch</Link>
            <Link to="/about" className="block py-2 hover:text-red-400 transition-colors duration-200">About</Link>
            
            {/* Mobile Auth Buttons or User Profile */}
            <div className="mt-4">
              {isAuthenticated && user ? (
                // User profile section in mobile menu
                <div className="border-t border-red-800 pt-4">
                  <div className="flex items-center space-x-3 mb-3">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.displayName} 
                        className="w-10 h-10 rounded-full object-cover border border-red-500"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">@{user.username || user.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link to="/profile" className="flex items-center py-2 hover:text-red-400 transition-colors duration-200">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link to="/settings" className="flex items-center py-2 hover:text-red-400 transition-colors duration-200">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center py-2 text-left hover:text-red-400 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                // Login/Signup buttons for non-authenticated users
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="text-center py-2 border border-red-700 rounded-lg hover:bg-red-900 transition-colors duration-200">
                    Login
                  </Link>
                  <Link to="/signup" className="text-center bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;