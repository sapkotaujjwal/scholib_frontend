import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./navbar1.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Navbar1 = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  useEffect(() => {}, []);

  const navbarRef = useRef(null);

  const toggleNavbar = () => {
    if (navbarRef.current) {
      navbarRef.current.classList.toggle("hidden1");
    }
  };

  return (
    <div className="dgudgadguadgu31">
      <div className="header flex1">
        <div className="container flex4">
          <div className="left flex2">
            <div className="menu" onClick={toggleNavbar}>
              <FontAwesomeIcon icon={faBars} />
            </div>

            <Link to={`/`}>
              <h1 className="h5 w600"> Scholib. </h1>
            </Link>
          </div>

          <div className="center flex2 hidden1" ref={navbarRef}>
            <ul>
              <li>
                <Link
                  to={""}
                  className={currentPath === `/` ? "active" : ""}
                  onClick={toggleNavbar}
                >
                  Home
                </Link>
              </li>
              <p className="h4"> | </p>

              <li>
                <Link
                  onClick={toggleNavbar}
                  to={`/about`}
                  className={currentPath === `/about` ? "active" : ""}
                >
                  About Us
                </Link>
              </li>
              <p className="h4"> | </p>

              <li>
                <a
                  onClick={toggleNavbar}
                  href="http://localhost:3000/login"
                  className=""
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          <div className="right flex2">
            {/* social Here  */}
            {false && (
              <>
                <a href={"https://www.facebook.com"}>
                  <p className="h5">
                    <FontAwesomeIcon
                      icon={faTwitter}
                      style={{ color: "#323842" }}
                    />
                  </p>
                </a>

                <a href="https://www.facebook.com">
                  <p className="h5">
                    <FontAwesomeIcon
                      icon={faFacebook}
                      style={{ color: "#323842" }}
                    />
                  </p>
                </a>

                <a href="https://www.facebook.com">
                  <p className="h5">
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      style={{ color: "#323842" }}
                    />
                  </p>
                </a>
              </>
            )}

            <Link
              onClick={toggleNavbar}
              to={`/register`}
              className='w400 mr-[15px] underline underline-offset-4'
            >
              <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar1;
