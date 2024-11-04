import React from "react";
import Timer from "./Timer"; 


const Navbar = ({
  timerHours,
  timerMinutes,
  timerSeconds,
  borderColor,
  onStop,
}) => {
  return (
    <nav
      className="navbar d-flex justify-content-between align-items-center"
      style={{
        width: "100%",
        backgroundColor: "#7963a8",
        color: "#fff",
        position: "fixed",
      }}
    >
      <h1 className="navbar-title">Exam Portal</h1>
      <button
        className="btn btn-primary ms-0"
        onClick={onStop}
        style={{
          backgroundColor: "#242034",
          color: "#fff",
          border: "none",
          marginRight: "2px",
        }}
      >
        Stop
      </button>
      <div >
        <Timer
          timerHours={timerHours}
          timerMinutes={timerMinutes}
          timerSeconds={timerSeconds}
          borderColor={borderColor}
        />
      </div>
    </nav>
  );
};

export default Navbar;
