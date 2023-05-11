import React from "react";

function Button({ text, onHandleClick }) {
    const handleClick = () => {
        onHandleClick();
    };

    return (
        <button style={{ padding: "5px", margin: "5px" }} onClick={handleClick}>
            {text}
        </button>
    );
}

export default Button;
