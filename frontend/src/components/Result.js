import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gradingResults, question, userAnswer } = location.state || {
    gradingResults: null,
    question: "No question available",
    userAnswer: "No answer available",
  };

  console.log("Received Grading Results:", gradingResults);

  // Attempt to parse gradingResults if it's a string
  let gradingData = null;
  if (typeof gradingResults === "string") {
    try {
      const parsedResults = gradingResults.match(/data: (.*)/);
      gradingData = parsedResults ? JSON.parse(parsedResults[1]) : null;
    } catch (error) {
      console.error("Error parsing gradingResults:", error);
    }
  }

  // Check if gradingData exists and is an array with content
  if (!gradingData || !Array.isArray(gradingData) || gradingData.length === 0) {
    return (
      <div>
        No results available: gradingResults data is not an array or is empty.
      </div>
    );
  }

  // Access the first result in the gradingData array
  const firstResult = gradingData[0];

  // Navigate back to the homepage
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="result-container">
      <h1>Grading Results:</h1>
      <ul>
        {Object.entries(firstResult).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>

      {/* Display the question and the user's answer */}
      <div className="question-section">
        <h2>Question:</h2>
        <p>{question}</p>
        <h2>Your Answer:</h2>
        <p>{userAnswer}</p>
      </div>

      {/* Back to Homepage Button */}
      <button onClick={handleBackToHome} className="back-button">
        Back to Homepage
      </button>
    </div>
  );
};

export default Result;
