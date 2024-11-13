import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Question from "./Question";
import EssayForm from "./EssayForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import ProctoringLibrary from 'proctoring-features';

const ExamPage = () => {

  //defining neccessary useStates
 const [timerHours, setTimerHours] = useState(0);
 const [timerMinutes, setTimerMinutes] = useState(30);
 const [timerSeconds, setTimerSeconds] = useState(0);
 const [borderColor, setBorderColor] = useState("silver");
 const [boxShadowColor, setBoxShadowColor] = useState("silver");
 const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
 const [essay, setEssay] = useState("");
 const [questionText, setQuestionText] = useState("");
 const [constraints, setConstraints] = useState({});
 const [maxTimeInSeconds, setMaxTimeInSeconds] = useState(0);
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [modalMessage, setModalMessage] = useState("");
 const [constraintChecks, setConstraintChecks] = useState({});
 const [wordCount, setWordCount] = useState(0);
 const [characterCount, setCharacterCount] = useState(0);
 //
 const totalSecondsRef = useRef(0);
 const intervalRef = useRef(null);
 const examRef = useRef(null);
 const navigate = useNavigate();

//ueseEffect to fetch exam's questions and its constraints
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        //fetching exam questions and constraints
        const response = await axios.get("http://localhost:5000/question");
        console.log("Fetched Response:", response.data); 
        setQuestionText(response.data.questionText);
        const parsedConstraints = parseConstraints(response.data.constraints);
        setConstraints(parsedConstraints);

        //Timer notifiaction, based on the maximum time of the question stated in the constraints
        const maxTimeInSec = (parsedConstraints.maxTime || 60) * 60;
        setMaxTimeInSeconds(maxTimeInSec); 
        totalSecondsRef.current = maxTimeInSec;
        const hours = Math.floor(maxTimeInSec / 3600);
        const minutes = Math.floor((maxTimeInSec % 3600) / 60);
        const seconds = maxTimeInSec % 60;
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);

        //using the library, together with the time constraint to perform alerts and pop ups to users
        ProctoringLibrary.totalExamDuration = parsedConstraints.maxTime || 60; 
        ProctoringLibrary.startTimerNotification();

        console.log("Fetched Constraints:", response.data.constraints); //for debugging purpose
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchQuestion();
///=====question fetchedready ====//

    // Initialize the timer interval with respect to the constraints
    intervalRef.current = setInterval(() => {
      if (totalSecondsRef.current <= 0) {
        clearInterval(intervalRef.current);
        handleSubmit(); 
        return;
      }
      totalSecondsRef.current -= 1;
      const hours = Math.floor(totalSecondsRef.current / 3600);
      const minutes = Math.floor((totalSecondsRef.current % 3600) / 60);
      const seconds = totalSecondsRef.current % 60;
      setTimerHours(hours);
      setTimerMinutes(minutes);
      setTimerSeconds(seconds);

      //Creating awareness of time left, by changing the color of the timer within a given period of time
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


    // Proctoring features from the library
    ProctoringLibrary.enforceFullscreen();
    ProctoringLibrary.startScreenshotCapture();
    ProctoringLibrary.detectWindowSwitching(() => {
      setModalMessage("Tab switching is not permitted during the exam.");
      setIsModalVisible(true);
    });
    ProctoringLibrary.initLogging((key) => {
      console.log(`Key pressed: ${key}`);
    });
     ProctoringLibrary.handleFullscreenChange(() => {
        if (!document.fullscreenElement) {
        navigate("/");
      }
      }
     );
    // Cleanup on component unmount, to prevent it being applied on different pages
    return () => {
      clearInterval(intervalRef.current);
      ProctoringLibrary.endSession();
    };
  }, []);

   
//to handle the stop button, stopping the exam
  const handleStopExam = () => {
    setModalMessage(
      "You are about to stop the exam. If you stop now, your work will not be graded. Do you want to continue?"
    );
    setIsModalVisible(true);
  };

  //Handles word count
  const handleWordCount = (wordCount) => {
    setIsSubmitEnabled(
      wordCount >= (constraints.minWords || 0) &&
        wordCount <= (constraints.maxWords || Infinity)
    );
  };

  // Helper function to parse constraints from the string format so as to be able to use it in calculation
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


  //handle essay change is a function that triggers the submit button to submit the essay
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

//action on submit both for the button and exceeded time limits
  const handleSubmit = async () => {
    if (!checkConstraints()) {
      setModalMessage("Please meet all constraints to submit the essay.");
      setIsModalVisible(true);
      return;
    }
    if (!constraintChecks.sittingTime.isMaxTimeMet) {
      setModalMessage(
        "You exceeded the maximum sitting time. Your exam will be submitted in 2 seconds."
      );
      setIsModalVisible(true);
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

      return;
    }
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
