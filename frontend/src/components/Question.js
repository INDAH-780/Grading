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
        <p>Constraints</p>
        <p>{constraints}</p>
      </div>
    </div>
  );
};

export default Question;
