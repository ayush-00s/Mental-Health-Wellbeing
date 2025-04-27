import React, { useState } from "react";
import TabsNavigation from "../components/TabsNavigation";
import Blogs from "../components/Blogs";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
  
import MentalHealthForm from "../components/MentalHealthform";
import Create from "../components/Create";

const Home = () => {
  
  const location = useLocation();

  const [selectedTab, setSelectedTab] = useState(location.state?.tab || "Home");
 
   return (
    <div className="min-h-screen bg-gray-50 flex">
      <TabsNavigation onSelect={setSelectedTab} />

      <div className="flex-1 p-8">
        {/* Home Tab - Blog Section */}
        {selectedTab === "Home" && <Blogs />}

        {/* Self Assessment Tab */}
        {selectedTab === "Self Assessment" && <MentalHealthForm />}

        {/* Create Tab */}
        {selectedTab === "Create" && <Create/>}

        {/* Community Discussion Tab */}
        {selectedTab === "Community Discussion" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Community Discussion</h1>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-2">Join the Conversation</h2>
              <p>Connect with others who share similar experiences.</p>
              <div className="mt-4 flex gap-4">
                <button className="bg-blue-800 px-6 py-2 text-white rounded-full text-lg font-medium hover:bg-blue-900 transition-colors">
                  Browse Topics
                </button>
                <button className="bg-gray-200 px-6 py-2 text-gray-800 rounded-full text-lg font-medium hover:bg-gray-300 transition-colors">
                  Ask a Question
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exercise & Diet Tab */}
        {selectedTab === "Exercise & Diet" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Exercise & Diet</h1>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-2">Wellness Resources</h2>
              <p>Maintain a healthy lifestyle with our tips and guidance.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-800 px-6 py-3 text-white rounded-full text-lg font-medium hover:bg-blue-900 transition-colors">
                  Exercise Plans
                </button>
                <button className="bg-blue-800 px-6 py-3 text-white rounded-full text-lg font-medium hover:bg-blue-900 transition-colors">
                  Nutrition Tips
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;