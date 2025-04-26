import React, { useState, useRef, useEffect } from 'react';

const TabsNavigation = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
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
        
        {/* Profile section */}
        <div className="mt-auto mb-6 flex justify-center relative" ref={menuRef}>
          <button 
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex justify-center items-center p-3 rounded-full hover:bg-gray-100"
          >
            <img src="/assets/user.png" alt="Profile" className="w-8 h-8 rounded-full" />
          </button>
          
          
          {profileMenuOpen && (
            <div className="absolute bottom-16 md:left-20 bg-white rounded-lg shadow-lg py-2 w-48 z-20">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Ayush Tiwari</p>
                <p className="text-xs text-gray-500">ayush@gmail.com</p>
              </div>
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</a>
              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <a href="#logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</a>
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