import React from "react";

function Button(props) {
  const handleClick = () => {
    props.handleClick();
  };

  return <button onClick={handleClick}>{props.text}</button>;
}

export default Button;
