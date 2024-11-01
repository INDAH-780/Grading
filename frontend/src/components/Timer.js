import React, { Fragment } from "react";

const formatTime = (value) => {
  return value < 10 ? `0${value}` : value; 
};

const Timer = ({ timerHours, timerMinutes, timerSeconds, borderColor }) => {
  return (
    <Fragment>
      <section className="timer-container">
        <section className="timer">
          <div className="clock" style={{ borderColor }}>
            <section>
              <p>{formatTime(timerHours)}</p>
              {/* <small>Hours</small> */}
            </section>
            <span>:</span>
            <section>
              <p>{formatTime(timerMinutes)}</p>
              {/* <small>Minutes</small> */}
            </section>
            <span>:</span>
            <section>
              <p>{formatTime(timerSeconds)}</p>
              {/* <small>Seconds</small> */}
            </section>
          </div>
        </section>
      </section>
    </Fragment>
  );
};

export default Timer;
