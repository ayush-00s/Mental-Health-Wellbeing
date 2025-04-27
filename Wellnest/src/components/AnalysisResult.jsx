const AnalysisResult = ({ result, onNewTest }) => {
  if (!result) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-indigo-600 mb-4 text-center">🧠 Your Assessment Result</h2>
      
      <div className="text-gray-800 whitespace-pre-line leading-relaxed">
        {result}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onNewTest}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition duration-300"
        >
          Take Another Self-Assessment
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
