import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../data/question.json";

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

export default function MentalHealthform({ onSubmit }) {
  const [responses, setResponses] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  const handleChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
   a
  };

  const totalQuestions = questions.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-indigo-50 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-indigo-800 mb-4">Mental Health Assessment</h1>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-indigo-700 mb-1">
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {questions[currentQuestion] && (
            <div className="p-6 bg-white shadow-md rounded-lg">
              <p className="font-medium text-lg mb-4 text-gray-800">{questions[currentQuestion].question}</p>
              <div className="space-y-3">
                {options.map((opt) => (
                  <label 
                    key={opt.value}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer hover:bg-indigo-50 transition-colors ${
                      responses[questions[currentQuestion].id] === opt.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={questions[currentQuestion].id}
                      value={opt.value}
                      checked={responses[questions[currentQuestion].id] === opt.value}
                      onChange={() => handleChange(questions[currentQuestion].id, opt.value)}
                      className="h-4 w-4 text-indigo-600"
                      required
                    />
                    <span className="ml-3 text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-lg text-indigo-700 border border-indigo-300 hover:bg-indigo-100 ${
                currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>

            {currentQuestion < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (responses[questions[currentQuestion].id] !== undefined) {
                    setCurrentQuestion(currentQuestion + 1);
                  }
                }}
                disabled={responses[questions[currentQuestion].id] === undefined}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                  responses[questions[currentQuestion].id] === undefined ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={responses[questions[currentQuestion].id] === undefined}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                  responses[questions[currentQuestion].id] === undefined ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
