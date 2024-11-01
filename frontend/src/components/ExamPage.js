import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Question from "./Question";
import EssayForm from "./EssayForm";
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
  const [constraints, setConstraints] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const totalSecondsRef = useRef(1800);
  const intervalRef = useRef(null);
  const examRef = useRef(null);
  const navigate = useNavigate();

  // New states for word and character count
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get("http://localhost:5000/question");
        setQuestionText(response.data.questionText);
        setConstraints(response.data.constraints);
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

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleStopExam();
      }
    };

    // Key down event to capture Alt key usage
    const handleKeyDown = (event) => {
      if (event.altKey) {
        setModalMessage(
          "You cannot switch tabs during the exam. Please stay on this tab."
        );
        setIsModalVisible(true);
        event.preventDefault();
      }
    };

    // Event listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleStopExam = () => {
    setModalMessage(
      "You are about to stop the exam. If you stop now, your work will not be graded. Do you want to continue?"
    );
    setIsModalVisible(true);
  };

  const handleWordCount = (wordCount) => {
    setIsSubmitEnabled(wordCount >= 100 && wordCount <= 500);
  };

  // Updated handleEssayChange function
  const handleEssayChange = (text) => {
    setEssay(text);
    // Update word and character counts
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(text.length);
    handleWordCount(words.length); // Check if the essay meets the word count requirements
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

  const handleModalStopExam = () => {
    navigate("/"); // Navigate to the main page when stopping the exam
  };

  const handleModalContinue = () => {
    setIsModalVisible(false); // Close the modal and continue the exam
  };

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
        onStop={handleStopExam}
      />
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4">
        <div className="w-100 mt-4">
          <Question questionText={questionText} constraints={constraints} />
        </div>
        <div className="w-100 mt-4">
          <EssayForm onEssayChange={handleEssayChange} />
        </div>
        <div className="d-flex justify-content-between w-100 align-items-center mt-3">
          <div>
            <p>Word Count: {wordCount}</p>
            <p>Character Count: {characterCount}</p>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Essay
          </button>
        </div>
      </div>
      {/* Conditional rendering of Modal */}
      {isModalVisible && (
        <Modal
          message={modalMessage}
          onContinue={handleModalContinue}
          onStopExam={handleModalStopExam}
          continueText="Continue"
          stopText="Stop Exam"
        />
      )}
    </div>
  );
};

export default ExamPage;
