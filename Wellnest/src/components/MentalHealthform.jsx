import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import AnalysisResult from "../components/AnalysisResult";

const MentalHealthForm = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");
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

  useEffect(() => {
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
      setResult(analyzeData.result);
      
      // Then save the report
      const saveResponse = await fetch('http://localhost:4001/MentalHealth/saveReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          user_responses,
          analysis_result: analyzeData.result
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
  };

  const openReportsModal = () => {
    setShowReportsModal(true);
  };

  const closeReportsModal = () => {
    setShowReportsModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Mental Health Questionnaire</h1>
        


        {/* Fetch error alert */}
        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p className="font-bold">Error fetching reports</p>
            <p>{fetchError}</p>
          </div>
        )}

        {!result && (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700">{q.text}</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
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
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Submit for Analysis"}
              </button>

              <button
                type="button"
                onClick={openReportsModal}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Previous Test Reports
              </button>
            </div>
          </form>
        )}

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center items-center mt-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Analysis Result */}
        {!loading && result && (
          <AnalysisResult result={result} onNewTest={startNewTest} />
        )}

        {/* Modal for Previous Reports */}
        {showReportsModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10 z-50">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full overflow-y-auto max-h-[80vh]">
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">📚 Previous Test Reports</h2>
              {history.length === 0 ? (
                <p>{fetchError ? "Error loading reports." : "No previous reports found."}</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {history.map((entry, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-100">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Date:</strong> {new Date(entry.created_at).toLocaleString()}
                      </p>
                      <p className="whitespace-pre-line">{entry.analysis_result}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-6">
                <button
                  onClick={closeReportsModal}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg"
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