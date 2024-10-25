import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/Firebase";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false); // For exam modal
  const [authModal, setAuthModal] = useState(false); // For authentication modal
  const navigate = useNavigate();

  const handleStartExam = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      // If the user is not authenticated, show the authentication modal
      setAuthModal(true);
    } else {
      // If the user is authenticated, show the exam details modal
      setShowModal(true);
    }
  };

  const handleAuthenticate = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider); // Perform Google sign-in
      const authenticatedUser = result.user; // Get the authenticated user
      console.log("User signed in: ", authenticatedUser);
      setAuthModal(false); // Hide the auth modal
      setShowModal(true); // Show the exam details modal after authentication
    } catch (error) {
      console.error("Error during authentication: ", error);
    }
  };

  const handleAuthCancel = () => {
    // User declined authentication, hide auth modal and go back to homepage
    setAuthModal(false);
  };

  // Continue to the exam page in full screen mode
  const handleContinue = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate("/exam");
    } catch (error) {
      console.error("Error entering fullscreen:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false); // Close the exam modal
  };

  return (
    <div className="container">
      <h1>Welcome to the Essay Grading System App!</h1>
      <p>
        Take the Essay Grading Test and receive your results immediately after
        submission.
      </p>
      <button onClick={handleStartExam}> Start Exam</button>

      {/* Authentication Modal */}
      {authModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Authentication Required</h2>
            <p>Would you like to sign in with Google to proceed?</p>
            <div className="modal-actions">
              <button onClick={handleAuthenticate}>Yes, Authenticate</button>
              <button onClick={handleAuthCancel}>No, Go Back</button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Exam Details</h2>
            <p>The exam will take 2 hours to complete.</p>
            <p>
              If you switch tabs or leave the page, your exam will be submitted
              automatically.
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="continue-btn" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
