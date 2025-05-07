import React, { useEffect, useRef, useState } from "react";
import "./dropdown.scss"; // Assuming you have a stylesheet for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Dropdown = ({
  options = [
    {
      label: "Option 1",
      value: "Value 1",
    },
    {
      label: "Option 2",
      value: "Value 2",
    },
  ],
  title,
  onSelect = () => {},
  key11,
}) => {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(title); // Initialize with title prop

  const dropdownRef = useRef(null);

  useEffect(() => {
    setCurrent(title); // Update current when title prop changes
  }, [title]);

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  const handleSelect = (index) => () => {
    onSelect(index, key11, options[index].value);
    setCurrent(options[index].label);
    setShow(false); // Close dropdown after selection
  };

  const handleClickOutside = (event) => {
    // Check if the click is outside the dropdown
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    // Add event listener when the component is mounted
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown973753" ref={dropdownRef}>
      <p className="text-center mb-0" onClick={handleShow}>
        {current} &nbsp; <FontAwesomeIcon icon={faCaretDown} />
      </p>

      {show && (
        <div
          className="container"
          style={{ top: dropdownRef.current.offsetHeight + 5 }}
        >
          {options && options.length > 0 ? (
            <ul>
              {/* Map options to list items */}
              {options.map((obj, index) => (
                <li key={index} className="each" onClick={handleSelect(index)}>
                  <p className="text-center py-2">{obj.label}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="each2">
              <p className="text-center">No Data</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
