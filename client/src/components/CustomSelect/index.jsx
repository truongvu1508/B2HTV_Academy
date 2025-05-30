// src/components/CustomSelect.jsx
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const CustomSelect = ({
  value,
  onChange,
  options,
  label,
  className = "",
  disabled = false,
  placeholder = "Chọn một tùy chọn",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { value: option.value } }); // Giả lập sự kiện onChange
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative  ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full 
          bg-white 
          border 
          border-gray-300 
          rounded-lg 
          px-4 
          py-2 
          text-sm 
          text-gray-700 
          text-left 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          transition-all 
          duration-200 
          hover:border-blue-400
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          flex items-center justify-between
        `}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <ul
          className="
            absolute 
            z-10 
            w-full 
            mt-1 
            bg-white 
            border 
            border-gray-300 
            rounded-lg 
            shadow-lg 
            max-h-60 
            overflow-auto
          "
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="
                px-4 
                py-2 
                text-sm 
                text-gray-700 
                hover:bg-blue-50 
                hover:text-blue-600 
                cursor-pointer
                transition-colors
              "
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default CustomSelect;
