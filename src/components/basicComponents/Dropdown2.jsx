import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Dropdown2 = ({
  options = [
    {
      title: "Option 1",
      value: "Value 1",
    },
    {
      title: "Option 2",
      value: "Value 2",
    },
  ],
  title,
  onSelect = () => {},
  key11,
}) => {
  const [selectedValue, setSelectedValue] = useState(title || "");

  useEffect(() => {
    setSelectedValue(title); // Update when title prop changes
  }, [title]);

  const handleChange = (event) => {
    const selectedIndex = event.target.selectedIndex - 1; // Subtract 1 because of default option
    const selectedOption = options[selectedIndex];
    
    if (selectedIndex >= 0) { // Only trigger if not the default option
      setSelectedValue(selectedOption.title);
      onSelect(selectedIndex, key11, selectedOption.value);
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <select
        value={selectedValue}
        onChange={handleChange}
        className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  hover:border-gray-400 cursor-pointer"
      >
        {/* Default option showing the title */}
        <option value={title} disabled>
          {title}
        </option>
        
        {/* Map through options */}
        {options && options.length > 0 ? (
          options.map((option, index) => (
            <option
              key={index}
              value={option.title}
              className="py-2"
            >
              {option.title}
            </option>
          ))
        ) : (
          <option disabled>No Data</option>
        )}
      </select>
      
      {/* Custom caret icon */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <FontAwesomeIcon icon={faCaretDown} />
      </div>
    </div>
  );
};

export default Dropdown2;