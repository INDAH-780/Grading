import React from "react";

const Model = ({
  message,
  results,
  onContinue,
  onStopExam,
  continueText,
  stopText,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h4>{message}</h4>
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              {result.includes("not met") || result.includes("exceeded")
                ? "✖️"
                : "✅"}{" "}
              {result}
            </li>
          ))}
        </ul>
        <button onClick={onContinue}>{continueText}</button>
        <button onClick={onStopExam}>{stopText}</button>
      </div>
    </div>
  );
};

export default Model;
