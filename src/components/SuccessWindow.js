import React from "react";

import "./SuccessWindow.css";

const SuccessWindow = ({ onClose, onNewQuiz }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <button className="close-button" onClick={onClose}>
                X
            </button>
            <p className="success-text">
                Gratulation! Alle Knoten wurden erfolgreich verbunden.
            </p>
            <button className="new-quiz-button" onClick={onNewQuiz}>
                Neues Quiz
            </button>
        </div>
    );
};

export default SuccessWindow;
