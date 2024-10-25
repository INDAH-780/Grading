import React, { useState, useEffect, useRef } from "react";
import Timer from "./Timer";
import Question from "./Question";
import EssayForm from "./EssayForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExamPage = () => {
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [borderColor, setBorderColor] = useState("silver");
  const [boxShadowColor, setBoxShadowColor] = useState("silver");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [essay, setEssay] = useState(""); 
  const totalSecondsRef = useRef(300);
  const examRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (examRef.current.requestFullscreen) {
      examRef.current.requestFullscreen();
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleSubmit();
      }
    };

    document.onfullscreenchange = handleFullscreenChange;

    const startTimer = () => {
      const interval = setInterval(() => {
        if (totalSecondsRef.current <= 0) {
          clearInterval(interval);
          handleSubmit(); 
        } else {
          const hours = Math.floor(totalSecondsRef.current / 3600);
          const minutes = Math.floor((totalSecondsRef.current % 3600) / 60);
          const seconds = totalSecondsRef.current % 60;

          setTimerHours(hours);
          setTimerMinutes(minutes);
          setTimerSeconds(seconds);

          const percentageRemaining = (totalSecondsRef.current / 300) * 100;
          if (percentageRemaining <= 5) {
            setBorderColor("red");
            setBoxShadowColor("red");
          } else if (percentageRemaining <= 10) {
            setBorderColor("red");
            setBoxShadowColor("red");
          } else if (percentageRemaining <= 50) {
            setBorderColor("orange");
            setBoxShadowColor("orange");
          } else {
            setBorderColor("silver");
            setBoxShadowColor("silver");
          }

          totalSecondsRef.current -= 1;
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    };

    startTimer();

    return () => {
      document.onfullscreenchange = null;
    };
  }, [borderColor, boxShadowColor, navigate]);

  const handleWordCount = (wordCount) => {
    setIsSubmitEnabled(wordCount >= 100 && wordCount <= 500);
  };

  const handleEssayChange = (text) => {
    setEssay(text);
  };

  const handleSubmit = async () => {
    if (isSubmitEnabled || totalSecondsRef.current <= 0) {
      try {
        const { data } = await axios.post("http://localhost:5000/api/submit", {
          essay,
        });
        console.log("API Response:", data); 

       
        navigate("/result", {
          state: {
            gradingResults: data,
            question: "Your exam question here", 
            userAnswer: essay,
          },
        });

      } catch (error) {
        console.error("Error submitting essay:", error);
      }
    }
  };

  return (
    <div className="exam-page">
      <div ref={examRef}>
        <Timer
          timerHours={timerHours}
          timerMinutes={timerMinutes}
          timerSeconds={timerSeconds}
          borderColor={borderColor}
          boxShadowColor={boxShadowColor}
        />
        <Question />
        <EssayForm
          minWords={100}
          maxWords={500}
          onWordCountChange={handleWordCount}
          onEssayChange={handleEssayChange} 
        />
        <button
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
          style={{
            backgroundColor: isSubmitEnabled ? "blue" : "grey",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: isSubmitEnabled ? "pointer" : "not-allowed",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ExamPage;
