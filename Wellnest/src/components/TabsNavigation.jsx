import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

const TabsNavigation = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  // Use your custom auth hook
  const { authUser, setAuthUser } = useAuth();
  
  const tabs = [
    {name: "Home", icon: <img src="/assets/home.png" alt="Home" className="w-6 h-6" />},
    {name: "Self Assessment", icon: <img src="/assets/assessment.png" alt="Self Assessment" className="w-6 h-6" />},
    {name: "Create", icon: <img src="/assets/create.png" alt="Create" className="w-6 h-6" />},
    {name: "Community Discussion", icon: <img src="/assets/disscussion.png" alt="Community Discussion" className="w-6 h-6" />},
    {name: "Exercise & Diet", icon: <img src="/assets/meditation.png" alt="Exercise & Diet" className="w-6 h-6" />},
  ];
  
  // Handle clicking outside of profile menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  
  // Updated Logout handler function with the correct port
  const handleLogout = async () => {
    try {
      // Update the port to 4000 to match your server configuration
      await axios.post('http://localhost:4001/User/Logout', {}, {
        headers: {
          Authorization: `Bearer ${authUser?.token}` // If you're using JWT
        }
      });
      
      // Clear auth state
      setAuthUser(undefined);
      
      // Remove user data from localStorage
      localStorage.removeItem("user");
      
      // Close the profile menu
      setProfileMenuOpen(false);
      
      // Redirect to login page
      navigate('/SignIn');
      
      console.log('Logout successful');
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, still log out on the client side
      setAuthUser(undefined);
      localStorage.removeItem("user");
      setProfileMenuOpen(false);
      navigate('/SignIn');
    }
  };
  
  // Handle profile navigation
  const handleViewProfile = () => {
    setProfileMenuOpen(false);
    navigate('/profile');
  };
  
  // Handle settings navigation
  const handleSettings = () => {
    setProfileMenuOpen(false);
    navigate('/settings');
  };
  
  // Handle account navigation
  const handleAccount = () => {
    setProfileMenuOpen(false);
    navigate('/account');
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!authUser || !authUser.name) return "U";
    return authUser.name
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex flex-col md:flex-row bg-gray-50">
      
      <div className="w-full md:w-20 bg-white shadow-lg flex flex-col fixed left-0 top-0 bottom-0 z-10">
        
        <div className="p-4 border-b border-gray-200 flex justify-center">
          <img src="/assets/logo.png" alt="Logo" className="w-10 h-10" />
        </div>
        
        <div className="flex-grow py-6">
          <div className="flex flex-col items-center space-y-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  onSelect(tab.name);
                }}
                className={`relative flex justify-center items-center p-3 rounded-lg ${
                  activeTab === tab.name
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
                title={tab.name}
              >
                {tab.icon}
                {activeTab === tab.name && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Enhanced Profile section */}
        <div className="mt-auto mb-6 flex justify-center relative" ref={menuRef}>
          <button 
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex justify-center items-center p-3 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Open profile menu"
            aria-expanded={profileMenuOpen}
          >
            {authUser?.profilePicture ? (
              <img 
                src={authUser.profilePicture} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {getUserInitials()}
              </div>
            )}
            {authUser?.status === "online" && (
              <span className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {profileMenuOpen && (
            <div className="absolute bottom-16 md:left-20 bg-white rounded-lg shadow-lg py-2 w-64 z-20">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{authUser?.name || "User"}</p>
                <p className="text-xs text-gray-500">{authUser?.email || "user@example.com"}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                    authUser?.membershipType === "premium" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {authUser?.membershipType === "premium" ? "Premium Member" : "Basic Account"}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleViewProfile}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                View Profile
              </button>
              
              <button 
                onClick={handleAccount}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                Account Details
              </button>
              
              <button 
                onClick={handleSettings}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Settings
              </button>
              
              {authUser?.membershipType !== "premium" && (
                <button 
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/upgrade');
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                  Upgrade to Premium
                </button>
              )}
              
              <div className="border-t border-gray-100 mt-1"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 md:ml-20">
      </div>
    </div>
  );
};

export default TabsNavigation;