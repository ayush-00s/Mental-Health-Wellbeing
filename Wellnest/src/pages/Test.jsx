import React from "react";
import MentalHealthForm from "../components/MentalHealthform";
import { useNavigate } from "react-router-dom";

function Test() {
  const navigate = useNavigate();

  const handleFormSubmit = async (responses) => {
    console.log("User responses:", responses);

    localStorage.setItem("userResponses", JSON.stringify(responses));

    navigate("/Home", { state: { tab: "Self Assessment" } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Mental Health Self-Assessment
      </h1>
      <MentalHealthForm onSubmit={handleFormSubmit} />
    </div>
  );
}

export default Test;
