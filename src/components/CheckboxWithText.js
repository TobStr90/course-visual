import React from "react";

const CheckboxWithText = ({ isChecked, setIsChecked }) => {
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <label>
        <input
          style={{
            marginRight: "5px",
          }}
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        Zeige den kompletten Pfad
      </label>
    </div>
  );
};

export default CheckboxWithText;
