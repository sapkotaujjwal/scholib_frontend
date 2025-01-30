import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faLock } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import UserComponent from "../basicComponents/UserComponent";
import userImg from "../../images/user.png";

const Header = () => {
  const user = useSelector((state) => state.User.user.payload);
  const [userComponent, setuserComponent] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;

  const navbarRef = useRef(null);

  const toggleNavbar = () => {
    if (navbarRef.current) {
      navbarRef.current.classList.toggle("hidden1");
    }
  };

  const handleLinkClick = () => {
    toggleNavbar();
  };

  const handleUserClick = () => {
    setuserComponent(!userComponent);
  };



  return (
    <div className="header21ed flex1" id="headerId001">
      {userComponent && (
        <div className="userComponent">
          <UserComponent closeUserComponent={handleUserClick} />
        </div>
      )}

      <div className="container121 flex4">
        <div className="left flex2">
          <div className="menu" onClick={toggleNavbar}>
            <FontAwesomeIcon icon={faBars} />
          </div>

          <Link to={`/school/${schoolCode}/`} onClick={handleLinkClick}>
            {school.logo && (
              <>
                <img
                  src={school.logo.secure_url}
                  className="mr-2"
                  style={{ height: "30px" }}
                />
              </>
            )}

            <h1 className="h5 w600"> {school.sName} </h1>
          </Link>
        </div>

        <div className="center flex2 hidden1" ref={navbarRef}>
          <ul>
            <li>
              <Link
                to={`/school/${schoolCode}/`}
                className={
                  currentPath === `/school/${schoolCode}/`
                    ? "active"
                    : "" || currentPath === `/school/${schoolCode}`
                    ? "active"
                    : ""
                }
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            <p className="h4"> | </p>

            <li>
              <Link
                to={`/school/${schoolCode}/updates`}
                className={
                  currentPath === `/school/${schoolCode}/updates`
                    ? "active"
                    : ""
                }
                onClick={handleLinkClick}
              >
                Updates
              </Link>
            </li>
            <p className="h4"> | </p>

            <li>
              <Link
                to={`/school/${schoolCode}/contact`}
                className={
                  currentPath === `/school/${schoolCode}/contact`
                    ? "active"
                    : ""
                }
                onClick={handleLinkClick}
              >
                Contact
              </Link>
            </li>

            <p className="h4"> | </p>

            <li>
              <Link
                to={`/school/${schoolCode}/gallery`}
                className={
                  currentPath === `/school/${schoolCode}/gallery`
                    ? "active"
                    : ""
                }
                onClick={handleLinkClick}
              >
                Gallery
              </Link>
            </li>
            <p className="h4"> | </p>

            <li>
              <Link
                to={`/school/${schoolCode}/admission`}
                className={
                  currentPath === `/school/${schoolCode}/admission`
                    ? "active"
                    : ""
                }
                onClick={handleLinkClick}
              >
                Admission
              </Link>
            </li>
          </ul>
        </div>

        <div className="right flex2">
          {!(user && user.schoolCode == schoolCode) && (
            <div className="login_div flex2">
              <Link to="/login" onClick={handleLinkClick}>
                LOGIN
              </Link>
              <p className="h6">
                <FontAwesomeIcon icon={faLock} />
              </p>
            </div>
          )}

          {user && user.schoolCode == schoolCode && (
            <div
              className="user_div flex1"
              onClick={handleUserClick}
              style={{ cursor: "pointer" }}
            >
              <div className="image">
                {user.title && (
                  <img
                    src={user.pPhoto ? user.pPhoto.secure_url : userImg}
                    style={{ objectFit: "cover" }}
                    alt=""
                  />
                )}

                {!user.title && (
                  <img
                    src={user.photo1 ? user.photo1.secure_url : userImg}
                    style={{ objectFit: "cover" }}
                    alt=""
                  />
                )}
              </div>

              <div className="userContent">
                <p className="h6 f3 font2"> Hi, {user.name.split(" ")[0]} </p>
                <p className="h7 f3 text-secondary">
                  {user.role ? "Staff" : "Student"}{" "}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
