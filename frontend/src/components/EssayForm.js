import React, { useState } from "react";
const EssayForm = ({ onEssayChange }) => {
  const [essay, setEssay] = useState("");
  // Handle changes in the textarea
  const handleChange = (event) => {
    const text = event.target.value;
    setEssay(text);
    onEssayChange(text);
  };
  return (
    <div className="essay-form mb-4">
      <p>Your response here</p>
      <textarea
        value={essay}
        onChange={handleChange}
        className="form-control essay"
        rows="10"
        placeholder="Type your essay here..."
      />
    </div>
  );
};

export default EssayForm;
