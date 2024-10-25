import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/Firebase";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false); 
  const [authModal, setAuthModal] = useState(false); 
  const navigate = useNavigate();

  const handleStartExam = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      // If the user is not authenticated, show the authentication modal to seek the users permission
      setAuthModal(true);
    } else {
      // If the user is authenticated, show the exam details modal at once
      setShowModal(true);
    }
  };

  const handleAuthenticate = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider); 
      const authenticatedUser = result.user;
      console.log("User signed in: ", authenticatedUser);
      setAuthModal(false); 
      setShowModal(true); 
    } catch (error) {
      console.error("Error during authentication: ", error);
    }
  };

  const handleAuthCancel = () => {
    setAuthModal(false);
  };
//fullscreen mode on exam page
  const handleContinue = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate("/exam");
    } catch (error) {
      console.error("Error entering fullscreen:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false); 
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
