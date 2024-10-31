import React, { Fragment } from "react";

const Timer = ({ timerHours, timerMinutes, timerSeconds, borderColor }) => {
  return (
    <Fragment>
      <section className="timer-container">
        <section className="timer">
          <div className="clock" style={{ borderColor }}>
            <section>
              <p>{timerHours}</p>
              {/* <small>Hours</small> */}
            </section>{" "}
            <span>:</span>
            <section>
              <p>{timerMinutes}</p>
              {/* <small>Minutes</small> */}
            </section>{" "}
            <span>:</span>
            <section>
              <p>{timerSeconds}</p>
             {/*  <small>Seconds</small> */}
            </section>
          </div>
        </section>
      </section>
    </Fragment>
  );
};


export default Timer;
