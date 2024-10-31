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
    <nav className="navbar d-flex justify-content-between align-items-center">
      <h1 className="navbar-title">Essay Grading Exam</h1>
      <button className="btn btn-danger ms-3" onClick={onStop}>
        Stop
      </button>
      <div className="d-flex align-items-center">
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
