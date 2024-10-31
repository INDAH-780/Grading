import React, { useState, useEffect } from "react";

const PushNotification = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show notification every 5 minutes
    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 5000); // Hide after 5 seconds
    }, 300000); // 5 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className={`push-notification ${visible ? "visible" : ""}`}>
      <p>If you leave fullscreen mode, your work will not be graded!</p>
    </div>
  );
};

export default PushNotification;
