import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HeartIcon, 
  UserCircleIcon, 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated, isDoctor, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Don't show nav links while loading
  const navLinks = loading ? [] : isAuthenticated ? (
    isDoctor ? [
      { name: 'Dashboard', href: '/doctor-dashboard', icon: HomeIcon },
    ] : [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Find Doctors', href: '/doctors', icon: UserGroupIcon },
    ]
  ) : [
    { name: 'Login', href: '/login' },
    { name: 'Register', href: '/register' },
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.relative')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-full">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                PawCare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer relative z-10"
                onClick={() => console.log('Clicked:', link.name, link.href)}
                style={{ pointerEvents: 'auto' }}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-full">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold">{user?.fullName}</div>
                    <div className="text-xs text-gray-500">{isDoctor ? 'Doctor' : 'Pet Owner'}</div>
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-scaleIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-full">
                          <UserCircleIcon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user?.fullName}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 hover:text-primary-600 transition-all duration-200"
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      <span>View Profile</span>
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-primary-600 block px-3 py-2 text-base font-medium"
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center px-3 py-2">
                    <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-full">
                      <UserCircleIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user?.fullName}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 px-3 py-2 text-base font-medium"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    <span>View Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left text-red-600 hover:text-red-700 px-3 py-2 text-base font-medium"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
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