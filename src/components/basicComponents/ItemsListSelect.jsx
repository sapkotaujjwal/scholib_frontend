import React, { useState, useEffect, useRef } from "react";
import "./itemsListSelect.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";




const SearchComponent = ({ suggestions, passClickedData }) => {


  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const eltRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const filteredSuggestions = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuggestions(filteredSuggestions);
  }, [searchTerm, suggestions]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim() !== "");
  };

  const handleSuggestionClick = (suggestion) => {
    passClickedData(suggestion)
  };

  const handleInputFocus = () => {
    setShowSuggestions(searchTerm.trim() !== "");
  };




  return (
    <div ref={eltRef} className="dge7237293nb">
      <div className="main-container">

    <div ref={searchRef} className="search-container">

      <input
        type="text"
        placeholder="Type here..."
        className="search-bar"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleInputFocus}
        ref={inputRef}
      />


<ul className={`suggestion-list ${showSuggestions ? "" : "d-none"}`}>
  {filteredSuggestions.length === 0 ? (
    <p className="h6 my-2 mx-3 text-secondary"> No results </p>
  ) : (
    filteredSuggestions.map((suggestion) => (
      <li className="suggestion-item h6 d-flex" key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
        <FontAwesomeIcon className="mx-2 text-secondary" icon={faMagnifyingGlass} />
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
