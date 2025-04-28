import React, { useState } from "react";

const AnalysisResult = ({ 
  result, 
  onNewTest, 
  score, 
  category, 
  recommendations,
  conditionScores = {}, 
  conditionAnalysis = {},
  disclaimer = "" 
}) => {
  const [activeTab, setActiveTab] = useState("summary"); // "summary", "details", "recommendations"
  
  // Determine which condition has the highest score for highlighting
  const primaryCondition = Object.entries(conditionScores)
    .sort((a, b) => {
      // Handle potential undefined score values
      const scoreA = a[1]?.score || 0;
      const scoreB = b[1]?.score || 0;
      return scoreB - scoreA;
    })[0]?.[0] || "";
  
  const getSeverityColor = (severity) => {
    if (!severity) return "bg-gray-100 text-gray-800";
    
    const colors = {
      "minimal": "bg-green-100 text-green-800",
      "mild": "bg-yellow-100 text-yellow-800",
      "moderate": "bg-orange-100 text-orange-800",
      "moderately severe": "bg-red-100 text-red-800",
      "severe": "bg-red-200 text-red-900",
      "low": "bg-green-100 text-green-800",
      "high": "bg-red-100 text-red-800"
    };
    return colors[severity.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (cat) => {
    const colors = {
      "Minimal": "bg-green-100 text-green-800 border-green-200",
      "Mild": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Moderate": "bg-orange-100 text-orange-800 border-orange-200",
      "Severe": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[cat] || "bg-indigo-100 text-indigo-800 border-indigo-200";
  };
  
  const getScoreBarColor = (severity) => {
    if (!severity) {
      // Default colors based on category if severity is not provided
      return category === "Severe" ? "bg-red-500" :
             category === "Moderate" ? "bg-orange-500" :
             category === "Mild" ? "bg-yellow-500" : "bg-green-500";
    }
    
    // Colors based on severity
    return severity.toLowerCase() === "severe" || severity.toLowerCase() === "high" ? "bg-red-500" :
           severity.toLowerCase() === "moderate" ? "bg-orange-500" :
           severity.toLowerCase() === "mild" ? "bg-yellow-500" : "bg-green-500";
  };
  
  // Format the timestamp if present in the result
  const getTimestamp = () => {
    const timestampMatch = result.match(/Assessment date: ([^\\n]+)/i);
    return timestampMatch ? timestampMatch[1] : new Date().toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Mental Health Assessment Results</h2>
          <div className={`px-4 py-1 mt-2 sm:mt-0 rounded-full ${getCategoryColor(category)} font-medium border-2`}>
            {category}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-24 h-24 stroke-current">
              <path
                className="stroke-gray-300"
                fill="none"
                strokeWidth="3"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${
                  score >= 80 
                    ? "stroke-red-500" 
                    : score >= 60 
                    ? "stroke-orange-500" 
                    : score >= 40 
                    ? "stroke-yellow-500" 
                    : "stroke-green-500"
                }`}
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
              {score}%
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-700">Overall Assessment</h3>
            <p className="text-gray-600 mt-1">
              {category === "Severe" ? 
                "Your responses indicate severe levels of distress that should be addressed promptly." :
               category === "Moderate" ? 
                "Your responses show moderate levels of distress. Consider implementing self-care strategies and professional support." :
               category === "Mild" ? 
                "Your responses indicate mild levels of distress. Self-care strategies may help improve your well-being." :
                "Your responses indicate minimal distress. Continue practicing good mental health habits."
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "summary" 
                ? "bg-indigo-100 text-indigo-700 font-medium" 
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "details" 
                ? "bg-indigo-100 text-indigo-700 font-medium" 
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            Detailed Analysis
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "recommendations" 
                ? "bg-indigo-100 text-indigo-700 font-medium" 
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            Recommendations
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Summary Tab */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            {/* Condition Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(conditionScores).length > 0 ? (
                Object.entries(conditionScores).map(([condition, data]) => (
                  <div 
                    key={condition}
                    className={`p-4 rounded-xl border ${
                      condition === primaryCondition 
                        ? "border-indigo-300 bg-indigo-50" 
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800 capitalize">{condition}</h3>
                      {data && data.severity && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(data.severity)}`}>
                          {data.severity}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getScoreBarColor(data?.severity)}`}
                        style={{ width: data && data.maxScore ? `${(data.score / data.maxScore) * 100}%` : `${(data?.score / 20) * 100 || 50}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Score: {data?.score || 0} {data?.maxScore ? `/ ${data.maxScore}` : ''}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-4 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Depression</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          category === "Severe" ? "bg-red-500" :
                          category === "Moderate" ? "bg-orange-500" :
                          category === "Mild" ? "bg-yellow-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Anxiety</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          category === "Severe" ? "bg-red-500" :
                          category === "Moderate" ? "bg-orange-500" :
                          category === "Mild" ? "bg-yellow-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Stress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          category === "Severe" ? "bg-red-500" :
                          category === "Moderate" ? "bg-orange-500" :
                          category === "Mild" ? "bg-yellow-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Brief Analysis */}
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Analysis Summary</h3>
              <p className="text-gray-700">
                {Object.values(conditionAnalysis).length > 0 
                  ? Object.values(conditionAnalysis)[0] // Show the first analysis
                  : result.split('\n\n')[0] // Fallback to the first paragraph
                }
              </p>
            </div>
            
            {/* Timestamp if available */}
            <div className="text-right text-sm text-gray-500">
              Assessment date: {getTimestamp()}
            </div>
           
          </div>
        )}
        
        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="space-y-6">
            {Object.keys(conditionAnalysis).length > 0 ? (
              Object.entries(conditionAnalysis).map(([condition, analysis]) => (
                <div key={condition} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">{condition} Analysis</h3>
                  <p className="text-gray-700">{analysis}</p>
                </div>
              ))
            ) : (
              <div className="prose max-w-none">
                {result.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-gray-700">{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Recommendations Tab */}
        {activeTab === "recommendations" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
            {recommendations && recommendations.length > 0 ? (
              <ul className="space-y-4">
                {recommendations.map((recommendation, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-semibold">{idx + 1}</span>
                    </div>
                    <p className="text-gray-700">{recommendation}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No specific recommendations are available for this assessment.</p>
            )}
            
            <div className="mt-8 p-5 bg-green-50 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Next Steps</h4>
              <p className="text-gray-700">
                Consider implementing these recommendations gradually. Track your progress over time using this assessment tool, and remember that seeking professional help is always a positive step.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onNewTest}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;