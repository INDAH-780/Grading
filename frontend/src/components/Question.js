import React, { useState, useEffect } from "react";

const Question = ({ questionText, constraints }) => {
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const fetchRandomQuestion = async () => {
      try {
        const response = await fetch("http://localhost:5000/question");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.text();
        setQuestion(data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchRandomQuestion();
  }, []);

  return (
    <div className="question-field">
      <div>
        <p>{questionText}</p>
        <p>Constraints:</p>
        {/* Render constraints as key-value pairs because its an object */}
        {constraints && typeof constraints === "object" ? (
          <ul>
            {Object.entries(constraints).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        ) : (
          <p>{constraints}</p> // but if its not an object this will be rendered
        )}
      </div>
    </div>
  );
};

export default Question;
