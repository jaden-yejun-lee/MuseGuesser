import React, { useEffect, useState } from "react";

// A timeout bar used to show the time left to answer a question
//  totalTime - in seconds
//  onTimeout - function to trigger on timeout
const TimeoutBar = ({ totalTime, onTimeout, resetTrigger }) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [disableTransition, setDisableTransition] = useState(false);

  useEffect(() => {
    setTimeLeft(totalTime)

    setDisableTransition(true)      // So the timebar resets immediately, css-wise
    setTimeout(() => {
      setDisableTransition(false);
    }, 10);
  }, [resetTrigger, totalTime])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onTimeout(); // timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);   // in seconds

    return () => clearInterval(interval);
  }, [onTimeout]);

  // Calculate percentage width
  const percentage = (timeLeft / totalTime) * 100;

  // Determine bar color based on time left
  const getColor = () => {
    if (percentage > 50) return "green";
    if (percentage > 25) return "orange";
    return "red";
  };

  return (
    <div style={{ width: "100%", height: "10px", background: "#ddd", borderRadius: "5px" }}>
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          background: getColor(),
          transition: disableTransition ? "none" : "width 1s linear, background 1s linear",
          borderRadius: "5px",
        }}
      ></div>
    </div>
  );
};

export default TimeoutBar;
