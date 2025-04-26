import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const SelfAssesment = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);

  const handleButtonClick = () => {
    navigate('/Test');
  };

  useEffect(() => {
    const storedResult = localStorage.getItem("llmResult");
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        setAssessment(parsed);
      } catch (e) {
        console.error("Error parsing result:", e);
      }
    }
  }, []); 

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Self Assessment</h1>

      <div className="p-6 bg-white shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-2">Take a New Assessment</h2>
        <p className="mb-4">Evaluate yourself with our assessment tool.</p>
        <div className="flex flex-col md:flex-row">
          <button 
            className="bg-blue-800 px-8 py-3 text-white rounded-full text-lg font-medium hover:bg-blue-900 transition-colors"
            onClick={handleButtonClick}
          >
            Start
          </button>
        </div>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-2">Your Previous Test Report</h2>

        {assessment ? (
          <>
            {typeof assessment.result === "string" ? (
              <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap mb-4">
                {assessment.result}
              </pre>
            ) : (
              <>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap mb-4">
                  {assessment.result?.summary || "No summary available."}
                </pre>
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Score:</strong> {assessment.result?.score || "N/A"}<br />
                  <strong>Severity:</strong> {assessment.result?.severity || "N/A"}
                </p>
                {assessment.result?.suggestions?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Suggestions:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {assessment.result.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mb-4">No result found.</p>
        )}

        <p className="mb-2">Find professional help near you</p>
        <button className="bg-blue-800 px-8 py-3 text-white rounded-full text-lg font-medium hover:bg-blue-900 transition-colors">
          Find Doctors
        </button>
      </div>
    </div>
  );
};

export default SelfAssesment;
