import React, { useState, useEffect } from "react";

const QuestionComponent = ({ idx, questionSet, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);

  useEffect(() => {
    // Record the start time when the component is mounted
    setStartTime(Date.now());
  }, [idx, questionSet]);

  const handleOptionClick = (index) => {
    console.log("index", index)
    setSelectedOption(index);

    // Calculate the time taken and store it
    const decisionTime = Date.now() - startTime;
    setElapsedTime(decisionTime);
  };

  const handleSubmit = async() => {
    if (selectedOption === null) {
      alert("Please select an option before submitting.");
      return;
    }

    // Call the parent callback with the selected option and time taken
    await onSubmit(idx, selectedOption, elapsedTime)
  };

  return (
    <div className="question-component" style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Question {idx}</h2>
      <p>Choose the correct track based on the preview:</p>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {questionSet.options.map((option, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => handleOptionClick(index)}
              style={{
                display: "block",
                padding: "10px 20px",
                width: "100%",
                backgroundColor: selectedOption === index ? "#d1e7dd" : "#f8f9fa",
                border: "1px solid #ccc",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {index + 1}. {option.name} by {option.artists[0].name}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
        }}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default QuestionComponent;
