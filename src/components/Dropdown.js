import React, { useState } from "react";

function Dropdown({ mode, handleDisplayOptionChange }) {
    const [selectedOption, setSelectedOption] = useState(mode);

    const handleSelectChange = (event) => {
        const newValue = event.target.value;
        if (newValue === selectedOption) return;

        setSelectedOption(newValue);
        handleDisplayOptionChange(newValue);
    };

    return (
        <div>
            <label style={{ marginRight: "5px" }} htmlFor="dropdown">
                Graphmodus:
            </label>
            <select
                id="dropdown"
                value={selectedOption}
                onChange={handleSelectChange}
            >
                <option value="2D-ForceDirected">2D-Kräftebasiert</option>
                <option value="2D-Hierarchical">2D-Hierarchisch</option>
                <option value="3D">3D</option>
                <option value="Quiz">Quiz</option>
            </select>
        </div>
    );
}

export default Dropdown;
