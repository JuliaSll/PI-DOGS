// Select.js
import React from "react";
import style from "./select.module.css";

const Select = ({ name, options, handleChange }) => {
  return (
    <div className={style["select-container"]}>
      <select className={style["select-element"]} name={name} onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option} className={style["select-option"]}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
