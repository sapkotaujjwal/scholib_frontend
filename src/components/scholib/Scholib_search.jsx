import React, { useState, useEffect, useRef } from "react";
import "./scholib_search.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SearchComponent = ({ suggestions, search10 }) => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // Default to the first suggestion.
  const searchRef = useRef(null);
  const eltRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Show all schools if search term is empty.
      setFilteredSuggestions(suggestions);
    } else {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [searchTerm, suggestions]);

  useEffect(() => {
    // Auto-select the first suggestion whenever the list changes.
    setSelectedIndex(filteredSuggestions.length > 0 ? 0 : -1);
  }, [filteredSuggestions]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true); // Always show suggestions on change.
  };

  const handleSuggestionClick = (suggestion) => {
    const schoolCode = parseInt(suggestion.match(/^\d{6}/));
    search10();
    history.push(`/school/${schoolCode}/updates`);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    setShowSuggestions(true); // Show suggestions when focused.
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const handleSearchClose = () => {
    search10(false);
  };

  // Handle key navigation for suggestions
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      // Move selection down
      setSelectedIndex((prevIndex) =>
        prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      // Move selection up
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      // Select the currently highlighted suggestion
      handleSuggestionClick(filteredSuggestions[selectedIndex]);
    }
  };

  return (
    <div ref={eltRef} className="seardasydg56262 applyBootstrap">
      <div className="main">
        <div ref={searchRef} className="search-container">
          <div
            className="close flex1"
            onClick={handleSearchClose}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>

          <input
            type="text"
            placeholder="Search for your school..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            ref={inputRef}
            onKeyDown={handleKeyDown} // Listen for key events
          />

          <ul className={`suggestion-list ${showSuggestions ? "" : "d-none"}`}>
            {filteredSuggestions.length === 0 ? (
              <p className="h6 my-2 mx-3 text-secondary">School not found</p>
            ) : (
              filteredSuggestions.map((suggestion, index) => (
                <li
                  className={`suggestion-item h6 d-flex ${
                    index === selectedIndex ? "highlighted" : "" // Highlight selected item
                  }`}
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <FontAwesomeIcon
                    className="mx-2 text-secondary"
                    icon={faMinus}
                  />
                  <p style={{ marginBottom: 0 }}> {suggestion} </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
