import React, { useState, useEffect } from 'react';
import { Book, LogOut } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { authService } from '../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to store user information

  useEffect(() => {
    // Fetch user information when component mounts
    const currentUser = authService.getCurrentUser(); // Assuming this method exists
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null); // Clear user state on logout
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-green-light border-b-2 border-green-light pb-1"
      : "text-gray-300 hover:text-green-light transition-colors";

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-green-dark/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-dark to-green-medium flex items-center justify-center">
                <Book className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="ml-2">
              <span className="text-xl font-bold text-white">
                EbookCenter
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            {user && user.role === 'admin' && ( // Conditionally render Admin Dashboard link
              <NavLink to="/admin-dashboard" className={navLinkClass}>
                Admin Dashboard
              </NavLink>
            )}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-white font-semibold mr-4">
                Welcome, {user.username || 'User'}!
              </span>
            )}
            
            {/* Logout Button */}
            {user && ( // Only show logout if user is logged in
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-300 hover:bg-red-700/50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
