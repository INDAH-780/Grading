import React from "react";

const Modal = ({
  message,
  onContinue,
  onStopExam,
  continueText,
  stopText,
  children,
}) => {
  return (
    <div className="modal" style={{ display: "block" }}>
      {" "}
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmation</h5>
          </div>
          <div className="modal-body">
            <p>{message}</p>
            {children}
          </div>
          <div
            className="modal-footer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <button className="btn btn-secondary" onClick={onContinue}>
              {continueText || "Continue"}
            </button>
            <button className="btn btn-primary" onClick={onStopExam}>
              {stopText || "Stop Exam"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
