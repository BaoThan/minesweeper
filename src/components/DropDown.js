import React from "react";

function DropDown({ levelOptions, onSelect }) {
  const onChangeEvent = (e) => {
    const val = e.target.value;
    onSelect(val);
  };

  return (
      <select id="levelDropdown" onChange={onChangeEvent} className="dropdown-select">
        {levelOptions.map((option, index) => (
          <option key={index} value={index} className="dropdown-option">
            {option.label}
          </option>
        ))}
      </select>
  );
}

export default DropDown;
