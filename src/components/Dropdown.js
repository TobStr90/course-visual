import React, { useState } from "react";

function Dropdown(props) {
  const [selectedOption, setSelectedOption] = useState("2D");

  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    if (newValue === selectedOption) return;

    setSelectedOption(newValue);
    props.handleDisplayOptionChange(newValue);
  };

  return (
    <div>
      <label htmlFor="dropdown">Select an option:</label>
      <select
        id="dropdown"
        value={selectedOption}
        onChange={handleSelectChange}
      >
        <option value="2D">2D</option>
        <option value="3D">3D</option>
        <option value="Quiz">Quiz</option>
      </select>
    </div>
  );
}

export default Dropdown;
