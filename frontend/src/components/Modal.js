import React from "react";

const Modal = ({ message, onContinue, onStopExam, continueText, stopText }) => {
  return (
    <div className="modal" style={{ display: "block" }}>
      {" "}
      {/* Use Bootstrap modal class */}
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmation</h5>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onContinue}>
              {continueText || "Continue"}
            </button>
            <button className="btn btn-danger" onClick={onStopExam}>
              {stopText || "Stop Exam"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
