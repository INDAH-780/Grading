import React, { useState, useEffect } from "react";

const EssayForm = ({
  minWords = 100,
  maxWords = 500,
  onWordCountChange,
  onEssayChange,
}) => {
  const [essay, setEssay] = useState("");
  const [error, setError] = useState("");
  //const [essayText, setEssayText] = useState("");

  // Calculate word and character count once
  const wordCount = essay.trim().split(/\s+/).length;
  const charCount = essay.length;

  // Handle change in textarea
  const handleChange = (event) => {
    const text = event.target.value;
    setEssay(text);

    const wordCount = text.trim().split(/\s+/).length;
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

  // Notify parent of word count change if required
  useEffect(() => {
    if (onWordCountChange) {
      onWordCountChange(wordCount);
    }
  }, [wordCount, onWordCountChange]);

  return (
    <div className="essay-form">
      <textarea
        value={essay}
        onChange={handleChange}
        rows="10"
        cols="50"
        placeholder="Type your essay here..."
        style={{
          width: "100%",
          padding: "10px",
          borderColor: error ? "red" : "black",
          borderRadius: "5px",
        }}
      />
      <div>
        <p>Word Count: {wordCount}</p>
        <p>Character Count: {charCount}</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default EssayForm;
