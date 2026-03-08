import React, { useState, useEffect, useRef } from "react";
import MetaData from "../layout/MetaData";
import "./scholib.scss";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowRight,
  faGraduationCap,
  faSchool,
  faUsers,
  faMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Scholib = () => {
  const history = useHistory();
  const loading = useSelector((state) => state.Scholib.loading);
  const scholib = useSelector((state) => state.Scholib.scholib.payload);
  const error = useSelector((state) => state.Scholib.error.payload);
  const user = useSelector((state) => state.User.user.payload);

  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const allSchools = scholib?.schools?.map((school) => school.info) || [];

  useEffect(() => {
    if (user) {
      history.push(`/school/${user.schoolCode}/updates`);
    }
  }, [user, history]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSchools(allSchools);
    } else {
      const filtered = allSchools.filter((school) =>
        school.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSchools(filtered);
    }
    setSelectedIndex(0);
  }, [searchTerm, allSchools.length]);

  const handleSchoolClick = (school) => {
    const schoolCode = parseInt(school.match(/^\d{6}/));
    history.push(`/school/${schoolCode}/updates`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < filteredSchools.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSchools.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex !== -1 && filteredSchools[selectedIndex]) {
      handleSchoolClick(filteredSchools[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="scholib-portal-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !scholib) {
    return null;
  }

  return (
    <div className="scholib-portal">
      <MetaData title="Scholib Portal | Find Your School" />

      {/* Background decoration */}
      <div className="portal-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="portal-container">
        {/* Header */}
        <header className="portal-header">
          <div className="logo-section">
            <div className="logo-icon">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <span className="logo-text">Scholib</span>
          </div>
          <a href="http://localhost:3000/login" className="login-btn">
            <span>Login</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </header>

        {/* Hero Section */}
        <main className="portal-main">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your <span className="highlight">School</span>
            </h1>
            <p className="hero-subtitle">
              Access your school's portal instantly. Search by name or code to get started.
            </p>

            {/* Search Box */}
            <div className="search-wrapper" ref={resultsRef}>
              <div className={`search-box ${showResults ? "active" : ""}`}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for your school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  onKeyDown={handleKeyDown}
                />
                {searchTerm && (
                  <button
                    className="clear-btn"
                    onClick={() => {
                      setSearchTerm("");
                      inputRef.current?.focus();
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {showResults && (
                <div className="search-results">
                  {filteredSchools.length === 0 ? (
                    <div className="no-results">
                      <p>No schools found matching "{searchTerm}"</p>
                    </div>
                  ) : (
                    <ul>
                      {filteredSchools.map((school, index) => (
                        <li
                          key={school}
                          className={`result-item ${index === selectedIndex ? "selected" : ""}`}
                          onClick={() => handleSchoolClick(school)}
                        >
                          <FontAwesomeIcon icon={faSchool} className="school-icon" />
                          <span>{school}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <p className="search-hint">
              Press <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to select
            </p>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <FontAwesomeIcon icon={faSchool} />
              <div className="stat-info">
                <span className="stat-number">{allSchools.length}+</span>
                <span className="stat-label">Schools</span>
              </div>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faUsers} />
              <div className="stat-info">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Students</span>
              </div>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faGraduationCap} />
              <div className="stat-info">
                <span className="stat-number">500+</span>
                <span className="stat-label">Teachers</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="portal-footer">
          <p>&copy; {new Date().getFullYear()} Scholib. School Management Made Simple.</p>
        </footer>
      </div>
    </div>
  );
};

export default Scholib;
