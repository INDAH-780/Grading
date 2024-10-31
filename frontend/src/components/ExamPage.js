import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Question from "./Question";
import EssayForm from "./EssayForm";
import PushNotification from "./PushNotification";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const ExamPage = () => {
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [borderColor, setBorderColor] = useState("silver");
  const [boxShadowColor, setBoxShadowColor] = useState("silver");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [essay, setEssay] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [constraints, setConstraints] = useState(""); // Define constraints state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const totalSecondsRef = useRef(1800);
  const intervalRef = useRef(null);
  const examRef = useRef(null);
  const navigate = useNavigate();

  // Fetch question and setup timer
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get("http://localhost:5000/question");
        setQuestionText(response.data.questionText);
        setConstraints(response.data.constraints); // Set constraints here
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchQuestion();

    intervalRef.current = setInterval(() => {
      totalSecondsRef.current -= 1;
      const hours = Math.floor(totalSecondsRef.current / 3600);
      const minutes = Math.floor((totalSecondsRef.current % 3600) / 60);
      const seconds = totalSecondsRef.current % 60;

      setTimerHours(hours);
      setTimerMinutes(minutes);
      setTimerSeconds(seconds);

      const percentageRemaining = (totalSecondsRef.current / 1800) * 100;
      setBorderColor(
        percentageRemaining <= 10
          ? "red"
          : percentageRemaining <= 50
          ? "orange"
          : "silver"
      );
      setBoxShadowColor(
        percentageRemaining <= 10
          ? "red"
          : percentageRemaining <= 50
          ? "orange"
          : "silver"
      );

      if (totalSecondsRef.current <= 0) {
        clearInterval(intervalRef.current);
        handleSubmit();
      }
    }, 1000);

    // Handle fullscreen changes
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleStopExam(); // Show modal if exiting fullscreen
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Listen for tab swaps
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleStopExam(); // Show modal if tab is not active
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleStopExam = () => {
    clearInterval(intervalRef.current);
    setModalMessage("You have stopped the exam. Your work will not be graded.");
    setIsModalVisible(true);
    setTimeout(() => {
      navigate("/"); // Redirect after 5 seconds
    }, 5000);
  };

  const handleWordCount = (wordCount) => {
    setIsSubmitEnabled(wordCount >= 100 && wordCount <= 500);
  };

  const handleEssayChange = (text) => {
    setEssay(text);
  };

  const handleSubmit = async () => {
    const submissionData = { essay: essay.trim() === "" ? "N/A" : essay };

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/submit",
        submissionData
      );
      navigate("/result", {
        state: {
          gradingResults: data,
          question: questionText,
          userAnswer: submissionData.essay,
        },
      });
    } catch (error) {
      console.error("Error submitting essay:", error);
    }
  };

  const handleStartFullscreen = () => {
    if (examRef.current.requestFullscreen) {
      examRef.current.requestFullscreen();
    } else if (examRef.current.mozRequestFullScreen) {
      // Firefox
      examRef.current.mozRequestFullScreen();
    } else if (examRef.current.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      examRef.current.webkitRequestFullscreen();
    } else if (examRef.current.msRequestFullscreen) {
      // IE/Edge
      examRef.current.msRequestFullscreen();
    }
  };

  useEffect(() => {
    handleStartFullscreen(); // Start in fullscreen mode
  }, []);

  return (
    <div
      className="d-flex flex-column vh-100"
      ref={examRef}
      style={{ borderColor, boxShadow: `0 0 10px ${boxShadowColor}` }}
    >
      <Navbar
        timerHours={timerHours}
        timerMinutes={timerMinutes}
        timerSeconds={timerSeconds}
        borderColor={borderColor}
        onStop={handleStopExam} // Pass handleStopExam to Navbar
      />
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4">
        <div className="w-100 mt-4">
          <Question questionText={questionText} constraints={constraints} />
        </div>
        <div className="w-100 mt-4">
          <EssayForm
            onWordCountChange={handleWordCount}
            onEssayChange={handleEssayChange}
          />
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
        >
          Submit Essay
        </button>
      </div>
      {isModalVisible && (
        <Modal
          message={modalMessage}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};

export default ExamPage;
