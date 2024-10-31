import React, { useState, useEffect } from "react";

const EssayForm = ({
  minWords = 100,
  maxWords = 500,
  onWordCountChange,
  onEssayChange,
}) => {
  const [essay, setEssay] = useState("");
  const [error, setError] = useState("");

  // Calculate word and character count
  const wordCount = essay.trim().split(/\s+/).length;
  const charCount = essay.length;

  // Handle changes in the textarea
  const handleChange = (event) => {
    const text = event.target.value;
    setEssay(text);
    onEssayChange(text);

    // Word count validation
    if (wordCount < minWords) {
      setError(`Minimum word count is ${minWords}. Current: ${wordCount}`);
    } else if (wordCount > maxWords) {
      setError(`Maximum word count is ${maxWords}. Current: ${wordCount}`);
    } else {
      setError("");
    }
  };

  useEffect(() => {
    if (onWordCountChange) {
      onWordCountChange(wordCount);
    }
  }, [wordCount, onWordCountChange]);

  return (
    <div className="essay-form mb-4">
      <textarea
        value={essay}
        onChange={handleChange}
        className="form-control essay"
        rows="10"
        placeholder="Type your essay here..."
      />
      <div className="info-container mt-3">
        <p className="info-item">Word Count: {wordCount}</p>
        <p className="info-item">Character Count: {charCount}</p>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default EssayForm;
