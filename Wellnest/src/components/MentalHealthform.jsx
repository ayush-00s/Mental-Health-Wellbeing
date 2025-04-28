import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import AnalysisResult from "../components/AnalysisResult";

const MentalHealthForm = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");
  const [score, setScore] = useState(null);
  const [category, setCategory] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [conditionScores, setConditionScores] = useState({});
  const [conditionAnalysis, setConditionAnalysis] = useState({});
  const [disclaimer, setDisclaimer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showReportsModal, setShowReportsModal] = useState(false);
  
  // Add userId state with a default test user ID
  const [userId, setUserId] = useState(localStorage.getItem('user') || "");
  const [fetchError, setFetchError] = useState(null);

  const questions = [
    { id: 1, text: "Little interest or pleasure in doing things" },
    { id: 2, text: "Feeling down, depressed, or hopeless" },
    { id: 3, text: "Feeling nervous, anxious, or on edge" },
    { id: 4, text: "Not being able to stop or control worrying" },
    { id: 5, text: "Feeling overwhelmed by difficulties" },
    { id: 6, text: "Feeling confident about handling problems" },
    { id: 7, text: "Trouble relaxing" },
    { id: 8, text: "Becoming easily annoyed or irritable" },
    { id: 9, text: "Feeling that difficulties are piling up" },
  ];

  // Load saved assessment data on initial render
  useEffect(() => {
    // Try to load the last assessment result from localStorage
    const savedAssessment = localStorage.getItem('lastAssessmentResult');
    if (savedAssessment) {
      try {
        const parsedAssessment = JSON.parse(savedAssessment);
        setResult(parsedAssessment.result || "");
        setScore(parsedAssessment.score || null);
        setCategory(parsedAssessment.category || "");
        setRecommendations(parsedAssessment.recommendations || []);
        setConditionScores(parsedAssessment.conditionScores || {});
        setConditionAnalysis(parsedAssessment.conditionAnalysis || {});
        setDisclaimer(parsedAssessment.disclaimer || "");
      } catch (error) {
        console.error("Error parsing saved assessment:", error);
        // Clear corrupted data
        localStorage.removeItem('lastAssessmentResult');
      }
    }

    if (userId) {
      fetchReports();
    }
  }, [userId]);

  const fetchReports = async () => {
    setFetchError(null);
    try {
      const response = await fetch(`http://localhost:4001/MentalHealth/getReports?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setFetchError(error.message);
      setHistory([]);
    }
  };

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Calculate score from answers
  const calculateScore = () => {
    // Check if we have answers for all questions
    if (Object.keys(answers).length !== questions.length) {
      return null;
    }
    
    // For question 6, which is positively phrased, we invert the score
    const adjustedAnswers = { ...answers };
    if (adjustedAnswers[6]) {
      adjustedAnswers[6] = (3 - parseInt(adjustedAnswers[6])).toString();
    }
    
    // Calculate total score
    const totalPoints = Object.values(adjustedAnswers)
      .reduce((sum, value) => sum + parseInt(value), 0);
    
    // Convert to percentage (max score would be 3 points × 9 questions = 27)
    return Math.round((totalPoints / 27) * 100);
  };

  // Determine category based on score
  const determineCategory = (calculatedScore) => {
    if (calculatedScore >= 80) return "Severe";
    if (calculatedScore >= 60) return "Moderate";
    if (calculatedScore >= 40) return "Mild";
    return "Minimal";
  };

  // Extract individual condition scores from the analysis text
  const extractConditionScores = (resultText) => {
    const scorePattern = /(depression|anxiety|stress)[^\d]*(\d+)[-\s]*(\d+|\w+)[^\d]*(minimal|mild|moderate|moderately severe|severe|low|high)/gi;
    const scores = {};
    let match;
    
    while ((match = scorePattern.exec(resultText)) !== null) {
      const condition = match[1].toLowerCase();
      const score = match[2];
      const maxScore = match[3];
      const severity = match[4].toLowerCase();
      
      scores[condition] = {
        score: parseInt(score),
        maxScore: isNaN(parseInt(maxScore)) ? undefined : parseInt(maxScore),
        severity: severity
      };
    }
    
    // If we couldn't find scores, look for another pattern
    if (Object.keys(scores).length === 0) {
      const alternatePattern = /(depression|anxiety|stress)[^:]*:\s*([a-z]+)\s+level/gi;
      while ((match = alternatePattern.exec(resultText)) !== null) {
        const condition = match[1].toLowerCase();
        const severity = match[2].toLowerCase();
        
        scores[condition] = {
          score: severity === "severe" ? 18 : 
                 severity === "moderate" ? 12 : 
                 severity === "mild" ? 6 : 3,
          severity: severity
        };
      }
    }
    
    // If still no scores found, create default scores based on overall score
    if (Object.keys(scores).length === 0) {
      const calculatedScore = calculateScore();
      const category = determineCategory(calculatedScore);
      const severity = category.toLowerCase();
      
      scores.depression = {
        score: calculatedScore * 27 / 100,
        maxScore: 27,
        severity: severity
      };
      
      scores.anxiety = {
        score: calculatedScore * 21 / 100,
        maxScore: 21,
        severity: severity
      };
      
      scores.stress = {
        score: calculatedScore * 40 / 100,
        maxScore: 40,
        severity: severity === "minimal" ? "low" : 
                 severity === "severe" ? "high" : "moderate"
      };
    }
    
    return scores;
  };

  // Extract more detailed analysis about each condition
  const extractConditionAnalysis = (resultText) => {
    const conditionAnalysis = {};
    
    // First try to find dedicated sections for each condition
    const depressionSection = resultText.match(/depression:([^#\n]*(?:\n(?!anxiety:|stress:)[^#\n]*)*)/i);
    if (depressionSection) {
      conditionAnalysis.depression = depressionSection[1].trim();
    }
    
    const anxietySection = resultText.match(/anxiety:([^#\n]*(?:\n(?!depression:|stress:)[^#\n]*)*)/i);
    if (anxietySection) {
      conditionAnalysis.anxiety = anxietySection[1].trim();
    }
    
    const stressSection = resultText.match(/stress:([^#\n]*(?:\n(?!depression:|anxiety:)[^#\n]*)*)/i);
    if (stressSection) {
      conditionAnalysis.stress = stressSection[1].trim();
    }
    
    // If no sections found, look for paragraphs discussing specific conditions
    if (Object.keys(conditionAnalysis).length === 0) {
      const depressionMatch = resultText.match(/depression[^.]*.[^.]*\./gi);
      if (depressionMatch) {
        conditionAnalysis.depression = depressionMatch[0].trim();
      }
      
      const anxietyMatch = resultText.match(/anxiety[^.]*.[^.]*\./gi);
      if (anxietyMatch) {
        conditionAnalysis.anxiety = anxietyMatch[0].trim();
      }
      
      const stressMatch = resultText.match(/stress[^.]*.[^.]*\./gi);
      if (stressMatch) {
        conditionAnalysis.stress = stressMatch[0].trim();
      }
    }
    
    // If still empty, create default analyses
    if (Object.keys(conditionAnalysis).length === 0) {
      const category = determineCategory(calculateScore());
      
      const getDefaultAnalysis = (condition, severity) => {
        if (severity === "Severe") {
          return `Your responses indicate severe levels of ${condition}. This suggests significant distress that may be impacting your daily functioning.`;
        } else if (severity === "Moderate") {
          return `Your responses show moderate levels of ${condition}. This suggests notable distress that may benefit from attention and care.`;
        } else if (severity === "Mild") {
          return `Your responses indicate mild levels of ${condition}. This suggests some distress that would benefit from self-care strategies.`;
        } else {
          return `Your responses indicate minimal levels of ${condition}. Continue practicing good mental health habits.`;
        }
      };
      
      conditionAnalysis.depression = getDefaultAnalysis("depression", category);
      conditionAnalysis.anxiety = getDefaultAnalysis("anxiety", category);
      conditionAnalysis.stress = getDefaultAnalysis("stress", category);
    }
    
    return conditionAnalysis;
  };

  // Improved recommendations extraction
  const extractRecommendations = (resultText) => {
    // First check for a "RECOMMENDATIONS:" section
    const recommendationSection = resultText.match(/recommendations:([^#\n]*(?:\n(?!disclaimer:)[^#\n]*)*)/i);
    
    if (recommendationSection && recommendationSection[1]) {
      // Extract bullet points or numbered items
      const recommendationText = recommendationSection[1].trim();
      
      // Look for numbered items or bullet points
      const items = recommendationText
        .split(/\n/)
        .map(item => item.replace(/^[-•*\d.\s]+/, '').trim())
        .filter(item => item.length > 0);
      
      if (items.length > 0) {
        return items;
      }
    }
    
    // If no dedicated section, look for sentences that contain advice language
    const suggestionPattern = /(?:should|could|consider|try|recommend|practice|maintain|connect|speak|consult|seek)[^.]*\./gi;
    const suggestions = [];
    let match;
    
    while ((match = suggestionPattern.exec(resultText)) !== null) {
      suggestions.push(match[0].trim());
    }
    
    // Limit to 5 suggestions
    if (suggestions.length > 0) {
      return suggestions.slice(0, 5);
    }
    
    // Default recommendations if none found
    const severity = determineCategory(calculateScore());
    
    if (severity === "Severe") {
      return [
        "Consider seeking professional help from a mental health provider",
        "Establish a consistent daily routine with adequate rest",
        "Practice mindfulness or relaxation techniques daily",
        "Connect with supportive friends or family members",
        "Limit exposure to stressful situations when possible"
      ];
    } else if (severity === "Moderate") {
      return [
        "Practice mindfulness meditation for 10 minutes daily",
        "Establish a regular exercise routine",
        "Maintain a consistent sleep schedule",
        "Consider speaking with a mental health professional",
        "Connect with supportive friends or family"
      ];
    } else {
      return [
        "Continue regular physical activity",
        "Practice mindfulness or relaxation techniques",
        "Maintain social connections",
        "Ensure adequate sleep and nutrition"
      ];
    }
  };

  // Extract disclaimer from the result
  const extractDisclaimer = (resultText) => {
    const disclaimerSection = resultText.match(/disclaimer:([^#\n]*(?:\n(?!assessment|analysis)[^#\n]*)*)/i);
    
    if (disclaimerSection) {
      return disclaimerSection[1].trim();
    }
    
    const disclaimerPattern = /disclaimer:?[^.]*.[^.]*\./i;
    const disclaimerMatch = resultText.match(disclaimerPattern);
    
    return disclaimerMatch ? 
      disclaimerMatch[0].trim() : 
      "This assessment is not a clinical diagnosis. Please consult with a mental health professional for proper evaluation.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user_responses = questions.map(q => `${q.text}: ${answers[q.id] || "No answer"}`).join("\n");
    const question_origins = "PHQ-9, GAD-7, PSS-10";

    try {
      // First call the analysis endpoint
      const analyzeResponse = await fetch('http://localhost:4001/MentalHealth/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_responses, question_origins }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || `Analysis failed with status: ${analyzeResponse.status}`);
      }

      const analyzeData = await analyzeResponse.json();
      
      // Extract all the details from the result
      const calculatedScore = calculateScore(); // Keep your existing score calculation
      const detectedCategory = determineCategory(calculatedScore); // Keep your existing category determination
      
      // Use new extraction functions
      const extractedScores = extractConditionScores(analyzeData.result);
      const extractedAnalysis = extractConditionAnalysis(analyzeData.result);
      const extractedRecommendations = extractRecommendations(analyzeData.result);
      const extractedDisclaimer = extractDisclaimer(analyzeData.result);
      
      // Set all the extracted data in state
      setResult(analyzeData.result);
      setScore(calculatedScore);
      setCategory(detectedCategory);
      setRecommendations(extractedRecommendations);
      setConditionScores(extractedScores);
      setConditionAnalysis(extractedAnalysis);
      setDisclaimer(extractedDisclaimer);
      
      // Save the assessment result to localStorage for persistence
      const assessmentData = {
        result: analyzeData.result,
        score: calculatedScore,
        category: detectedCategory,
        conditionScores: extractedScores,
        conditionAnalysis: extractedAnalysis,
        recommendations: extractedRecommendations,
        disclaimer: extractedDisclaimer,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastAssessmentResult', JSON.stringify(assessmentData));
      
      // Then save the report
      const saveResponse = await fetch('http://localhost:4001/MentalHealth/saveReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          user_responses,
          analysis_result: analyzeData.result,
          score: calculatedScore,
          category: detectedCategory,
          condition_scores: extractedScores, // Save these additional details
          condition_analysis: extractedAnalysis,
          recommendations: extractedRecommendations,
          disclaimer: extractedDisclaimer
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || `Failed to save report: ${saveResponse.status}`);
      }

      toast.success('Analysis completed and report saved! 🎉');
      fetchReports();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startNewTest = () => {
    setAnswers({});
    setResult("");
    setScore(null);
    setCategory("");
    setRecommendations([]);
    setConditionScores({});
    setConditionAnalysis({});
    setDisclaimer("");
    // Clear saved assessment data when starting a new test
    localStorage.removeItem('lastAssessmentResult');
  };

  const openReportsModal = () => {
    setShowReportsModal(true);
  };

  const closeReportsModal = () => {
    setShowReportsModal(false);
  };

  // Function to view a previous result
  const viewPreviousResult = (reportData) => {
    // Save the selected report to localStorage for persistence
    localStorage.setItem('lastAssessmentResult', JSON.stringify({
      result: reportData.analysis_result,
      score: reportData.score,
      category: reportData.category,
      conditionScores: reportData.condition_scores || extractConditionScores(reportData.analysis_result),
      conditionAnalysis: reportData.condition_analysis || extractConditionAnalysis(reportData.analysis_result),
      recommendations: reportData.recommendations || extractRecommendations(reportData.analysis_result),
      disclaimer: reportData.disclaimer || extractDisclaimer(reportData.analysis_result),
      timestamp: reportData.created_at || new Date().toISOString()
    }));
    
    setResult(reportData.analysis_result);
    setScore(reportData.score || calculateScore());
    setCategory(reportData.category || "Previous Assessment");
    
    // Extract or use stored data for the detailed view
    if (reportData.condition_scores) {
      setConditionScores(reportData.condition_scores);
    } else {
      setConditionScores(extractConditionScores(reportData.analysis_result));
    }
    
    if (reportData.condition_analysis) {
      setConditionAnalysis(reportData.condition_analysis);
    } else {
      setConditionAnalysis(extractConditionAnalysis(reportData.analysis_result));
    }
    
    if (reportData.recommendations) {
      setRecommendations(reportData.recommendations);
    } else {
      setRecommendations(extractRecommendations(reportData.analysis_result));
    }
    
    if (reportData.disclaimer) {
      setDisclaimer(reportData.disclaimer);
    } else {
      setDisclaimer(extractDisclaimer(reportData.analysis_result));
    }
    
    closeReportsModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-indigo-600 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-center text-indigo-600">Mental Health Self-Assessment</h1>
        </div>

        {/* Fetch error alert */}
        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p className="font-bold">Error fetching reports</p>
            <p>{fetchError}</p>
          </div>
        )}

        {!result && (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
            <div className="bg-indigo-50 p-4 rounded-xl mb-6">
              <p className="text-indigo-800">
                This questionnaire combines elements from standard mental health assessments. 
                Please answer honestly - your responses are used to provide personalized insights.
              </p>
            </div>
            
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700">{q.text}</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required
                >
                  <option value="">Select your answer</option>
                  <option value="0">Not at all</option>
                  <option value="1">Several days</option>
                  <option value="2">More than half the days</option>
                  <option value="3">Nearly every day</option>
                </select>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : "Submit for Analysis"}
              </button>

              <button
                type="button"
                onClick={openReportsModal}
                className="flex-1 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md"
              >
                Previous Test Reports
              </button>
            </div>
          </form>
        )}

        {/* Spinner */}
        {loading && !result && (
          <div className="flex justify-center items-center mt-8">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Analysis Result */}
        {!loading && result && (
          <AnalysisResult 
            result={result} 
            onNewTest={startNewTest} 
            score={score}
            category={category}
            recommendations={recommendations}
            conditionScores={conditionScores}
            conditionAnalysis={conditionAnalysis}
            disclaimer={disclaimer}
          />
        )}

        {/* Modal for Previous Reports */}
        {showReportsModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
            <div className="bg-white p-6 rounded-xl max-w-3xl w-full overflow-y-auto max-h-[80vh] shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Previous Assessment Reports
                </h2>
                <button
                  onClick={closeReportsModal}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg text-gray-600">
                    {fetchError ? "Error loading reports." : "No previous reports found."}
                  </p>
                  <p className="text-gray-500 mt-2">
                    {!fetchError && "Complete an assessment to see your reports here."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {history.map((entry, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-indigo-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-sm font-medium text-indigo-600">
                          {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString()}
                        </p>
                        {entry.category && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.category === "Severe" ? "bg-red-100 text-red-800" :
                            entry.category === "Moderate" ? "bg-orange-100 text-orange-800" :
                            entry.category === "Mild" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {entry.category}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 line-clamp-3">{entry.analysis_result.substring(0, 150)}...</p>
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => viewPreviousResult(entry)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
                        >
                          View Full Report
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={closeReportsModal}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealthForm;