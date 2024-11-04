import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import examImage from "../images/exam.png";
import logoImage from "../images/logoh.png"


const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleStartExam = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setAuthModal(true); // Show authentication modal if not signed in
    } else {
      setShowModal(true); // Show exam modal if signed in
    }
  };

  const handleAuthenticate = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account", // Forces the account selection dialog
    });

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in: ", result.user);
      setAuthModal(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error during authentication: ", error);
    }
  };

  const handleAuthCancel = () => {
    setAuthModal(false); // Close the authentication modal without signing in
  };

  const handleContinue = (e) => {
    e.preventDefault(); 
    navigate("/exam"); 
  };

  const handleCancel = () => {
    setShowModal(false); // Close the exam modal
  };

  return (
    <div className="wrapper">
      <header className="header d-flex justify-content-between align-items-center">
        <div className="logo">
          <img
            src={logoImage}
            alt="Logo"
            width="80"
            height="80"
            style={{ borderRadius: "50%" }}
          />
        </div>

        <button
          onClick={handleStartExam}
          className="btn btn-primary"
          style={{
            backgroundColor: "#578d13",
            color: "#fff",
            border: "none",
          }}
        >
          Start Exam
        </button>
      </header>

      <div
        className="container container-content"
        style={{
          width: "100%",
          marginTop: "12rem",
          padding: "0 15px",
        }}
      >
        <div className="row align-items-center">
          <div className="col-md-6 text-center">
            <h1>Welcome to the Essay Grading System App!</h1>
            <p>
              Take the Essay Grading Test and receive your results immediately
              after submission.
            </p>
            <button
              onClick={handleStartExam}
              className="btn btn-primary"
              style={{
                backgroundColor: "#578d13",
                color: "#fff",
                border: "none",
              }}
            >
              Start Exam
            </button>
          </div>

          <div className="col-md-6 text-center">
            <img
              src={examImage}
              alt="Exam Illustration"
              className="img-fluid"
              width="200"
              height="200"
            />
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      {authModal && (
        <div
          className={`modal fade show`}
          style={{ display: "block" }}
          role="dialog"
          tabIndex="-1"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Authentication Required</h5>
              </div>
              <div className="modal-body">
                <p>Would you like to sign in with Google to proceed?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleAuthCancel}
                >
                  No, Go Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAuthenticate}
                >
                  Yes, Authenticate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className={`modal fade show`}
          style={{ display: "block" }}
          role="dialog"
          tabIndex="-1"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Exam Details</h5>
              </div>
              <div className="modal-body">
                <p>The exam will take an hour to complete.</p>
                <p>
                  If your time elapses when you aren't done yet or you switch
                  tabs or leave the page, your exam will be submitted
                  automatically.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleContinue}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
