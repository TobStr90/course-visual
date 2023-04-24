import React, { useState } from "react";

function Dropdown(props) {
  // const [selectedOption, setSelectedOption] = useState("2D-ForceDirected");
  const [selectedOption, setSelectedOption] = useState("2D-Hierarchical");

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
        <option value="2D-ForceDirected">2D-ForceDirected</option>
        <option value="2D-Hierarchy">2D-Hierarchy</option>
        <option value="2D-Hierarchical">2D-Hierarchical</option>
        <option value="3D">3D</option>
        <option value="Quiz">Quiz</option>
      </select>
    </div>
  );
}

export default Dropdown;
