import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Question from "./Question";
import EssayForm from "./EssayForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import ProctoringLibrary from 'proctoring-features';

const ExamPage = () => {
 const [timerHours, setTimerHours] = useState(0);
 const [timerMinutes, setTimerMinutes] = useState(30);
 const [timerSeconds, setTimerSeconds] = useState(0);
 const [borderColor, setBorderColor] = useState("silver");
 const [boxShadowColor, setBoxShadowColor] = useState("silver");
 const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
 const [essay, setEssay] = useState("");
 const [questionText, setQuestionText] = useState("");
 const [constraints, setConstraints] = useState({});
 const [maxTimeInSeconds, setMaxTimeInSeconds] = useState(0); // New state for maxTime
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [modalMessage, setModalMessage] = useState("");
 const [constraintChecks, setConstraintChecks] = useState({});
 const totalSecondsRef = useRef(0);
 const intervalRef = useRef(null);
 const examRef = useRef(null);
 const navigate = useNavigate();

  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get("http://localhost:5000/question");
        console.log("Fetched Response:", response.data); // Log the full response
        setQuestionText(response.data.questionText);
          const parsedConstraints = parseConstraints(response.data.constraints);
          setConstraints(parsedConstraints);

          // Set timer based on maxTime in constraints
        const maxTimeInSec = (parsedConstraints.maxTime || 60) * 60;
        setMaxTimeInSeconds(maxTimeInSec); // Set max time in state
        totalSecondsRef.current = maxTimeInSec;

        const hours = Math.floor(maxTimeInSec / 3600);
        const minutes = Math.floor((maxTimeInSec % 3600) / 60);
        const seconds = maxTimeInSec % 60;

        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);


        console.log("Fetched Constraints:", response.data.constraints);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchQuestion();

    // Request fullscreen on page load
    if (examRef.current.requestFullscreen) {
      examRef.current.requestFullscreen();
    } else if (examRef.current.webkitRequestFullscreen) {
      examRef.current.webkitRequestFullscreen(); // Safari support
    } else if (examRef.current.mozRequestFullScreen) {
      examRef.current.mozRequestFullScreen(); // Firefox support
    } else if (examRef.current.msRequestFullscreen) {
      examRef.current.msRequestFullscreen(); // IE/Edge support
    }

    // Initialize the timer interval
    intervalRef.current = setInterval(() => {
      if (totalSecondsRef.current <= 0) {
        clearInterval(intervalRef.current);
        handleSubmit(); // Auto-submit if time runs out
        return;
      }

      totalSecondsRef.current -= 1;

      const hours = Math.floor(totalSecondsRef.current / 3600);
      const minutes = Math.floor((totalSecondsRef.current % 3600) / 60);
      const seconds = totalSecondsRef.current % 60;

      setTimerHours(hours);
      setTimerMinutes(minutes);
      setTimerSeconds(seconds);

      const percentageRemaining =
        (totalSecondsRef.current / maxTimeInSeconds) * 100;
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
    }, 1000);

   
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        navigate("/");
      }
    };

    const handleKeyDown = (event) => {
      if (event.altKey) {
        setModalMessage(
          "You cannot switch tabs during the exam. Please stay on this tab."
        );
        setIsModalVisible(true);
        event.preventDefault();
      }
    };

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
    setIsSubmitEnabled(
      wordCount >= (constraints.minWords || 0) &&
        wordCount <= (constraints.maxWords || Infinity)
    );
  };

  // Helper function to parse constraints from the string format
  const parseConstraints = (constraintsString) => {
    const constraints = {};

    const wordMatch = constraintsString.match(/Word limit: (\d+)-(\d+)/);
    const charMatch = constraintsString.match(/Character limit: (\d+)-(\d+)/);
    const timeMatch = constraintsString.match(/Sitting time: (\d+)-(\d+)/);

    if (wordMatch) {
      constraints.minWords = parseInt(wordMatch[1], 10);
      constraints.maxWords = parseInt(wordMatch[2], 10);
    }
    if (charMatch) {
      constraints.minChars = parseInt(charMatch[1], 10);
      constraints.maxChars = parseInt(charMatch[2], 10);
    }
    if (timeMatch) {
      constraints.minTime = parseInt(timeMatch[1], 10);
      constraints.maxTime = parseInt(timeMatch[2], 10);
    }

    return constraints;
  };

  const handleEssayChange = (text) => {
    setEssay(text);
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(text.length);
    handleWordCount(words.length);
  };

  const checkConstraints = () => {
    const minWords = constraints.minWords ?? 1;
    const maxWords = constraints.maxWords ?? Infinity;
    const minChars = constraints.minChars ?? 1;
    const maxChars = constraints.maxChars ?? Infinity;
    const minTimeInSeconds = (constraints.minTime ?? 0) * 60;
    const maxTimeInSeconds = (constraints.maxTime ?? Infinity) * 60;

    const wordCountCheck = wordCount >= minWords && wordCount <= maxWords;
    const characterCountCheck =
      characterCount >= minChars && characterCount <= maxChars;

    const isMinTimeMet = totalSecondsRef.current >= minTimeInSeconds;
    const isMaxTimeMet = totalSecondsRef.current <= maxTimeInSeconds;

    const checks = {
      wordCount: wordCountCheck,
      characterCount: characterCountCheck,
      sittingTime: {
        isMinTimeMet,
        isMaxTimeMet,
      },
    };

    setConstraintChecks(checks);
    return Object.values(checks).every(Boolean);
  };

  //proctoring features

useEffect(() => {
  // Set up event listeners for proctoring-related events
  ProctoringLibrary.handleFullscreenChange(() => {
    setModalMessage("Exiting fullscreen is not allowed during the exam.");
    setIsModalVisible(true);
  });

  ProctoringLibrary. detectWindowSwitching(() => {
    setModalMessage("Tab switching is not permitted during the exam.");
    setIsModalVisible(true);
  });

  ProctoringLibrary.initLogging((key) => {
    // Optionally log keystrokes or handle specific key events
    console.log(`Key pressed: ${key}`);
  });

  // Enforce fullscreen mode at the beginning of the exam
  ProctoringLibrary.enforceFullscreen();

  ProctoringLibrary.startScreenshotCapture();

  // Cleanup on component unmount
  return () => {
    ProctoringLibrary.endSession(); // Assuming this is a valid method
  };
}, []);



  useEffect(() => {
    console.log("Current Constraints:", constraints);
    console.log("Min Words:", constraints.minWords);
    console.log("Max Words:", constraints.maxWords);
    console.log("Min Chars:", constraints.minChars);
    console.log("Max Chars:", constraints.maxChars);
    console.log("Min Time:", constraints.minTime);
    console.log("Max Time:", constraints.maxTime);
  }, [constraints]);


const renderConstraintStatus = () => {
  const messages = [];

  // Check word count
  if (!constraintChecks.wordCount) {
    messages.push("You didn't meet the specified word count.");
  }

  // Check character count
  if (!constraintChecks.characterCount) {
    messages.push("You didn't meet the specified character count.");
  }

  // Check sitting time
  const { minTime, maxTime } = constraintChecks;

  if (!minTime) {
    messages.push("You didn't meet the minimum sitting time requirement.");
  } else if (!maxTime) {
    messages.push(
      "You exceeded the maximum sitting time. Your exam will be submitted in 2 seconds."
    );
  } else {
    messages.push("Your sitting time is within the required range.");
  }

  // Render messages as list items
  return messages.map((message, index) => <li key={index}>{message}</li>);
};




  const handleSubmit = async () => {
    if (!checkConstraints()) {
      setModalMessage("Please meet all constraints to submit the essay.");
      setIsModalVisible(true);
      return;
    }

    // If exceeding the maximum sitting time, show a modal message
    if (!constraintChecks.sittingTime.isMaxTimeMet) {
      setModalMessage(
        "You exceeded the maximum sitting time. Your exam will be submitted in 2 seconds."
      );
      setIsModalVisible(true);

      // Delay the submission by 2 seconds
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            "http://localhost:5000/api/submit",
            {
              essay,
            }
          );
          navigate("/result", {
            state: {
              gradingResults: data,
              question: questionText,
              userAnswer: essay,
            },
          });
        } catch (error) {
          console.error("Error submitting essay:", error);
        }
      }, 2000);

      return; // Prevent the regular submission from occurring immediately
    }

    // Regular submission if constraints are met
    try {
      const { data } = await axios.post("http://localhost:5000/api/submit", {
        essay,
      });
      navigate("/result", {
        state: {
          gradingResults: data,
          question: questionText,
          userAnswer: essay,
        },
      });
    } catch (error) {
      console.error("Error submitting essay:", error);
    }
  };

  const handleModalStopExam = () => navigate("/");
  const handleModalContinue = () => setIsModalVisible(false);

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
            <p>
              Word Count: {wordCount} / {constraints.maxWords ?? "∞"}
            </p>
            <p>
              Character Count: {characterCount} / {constraints.maxChars ?? "∞"}
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Essay
          </button>
        </div>
      </div>
      {isModalVisible && (
        <Modal
          message={modalMessage}
          onContinue={handleModalContinue}
          onStopExam={handleModalStopExam}
          continueText="Continue"
          stopText="Stop Exam"
        >
          <ul>{renderConstraintStatus()}</ul>
        </Modal>
      )}
    </div>
  );
};

export default ExamPage;
