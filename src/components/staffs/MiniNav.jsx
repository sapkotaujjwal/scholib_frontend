import React, { useEffect, useRef } from "react";
import "./miniNav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faComputer,
  faGraduationCap,
  faLock,
  faNoteSticky,
  faPen,
  faPeopleCarry,
  faPeopleGroup,
  faToolbox,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import placeholderImage from "../../images/placeholder.png";

const MiniNav = ({ function24 = function () {} }) => {
  const school = useSelector((state) => state.Home.school.payload);
  const scholib = useSelector((state) => state.Scholib.scholib.payload);
  const schoolCode = school.schoolCode;

  const location = useLocation();
  const currentPath = location.pathname;
  const contRef = useRef(null);

    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown
      if (contRef.current && !contRef.current.contains(event.target)) {
        function24();
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
    <div className="miniNav83283 custom-scrollbar" ref={contRef}>
      <div className="main1">
        <div className="top flex2">
          <div className="image">
            <img
              src={
                school.logo && school.logo.secure_url
                  ? school.logo.secure_url
                  : placeholderImage
              }
              alt="School Logo"
            />
          </div>

          <div className="name">
            <p className="h6 w600"> {school.sName} </p>
            <p className="h8 text-secondary"> School </p>
          </div>
        </div>

        <div className="middle">
          <div
            className={
              currentPath === `/school/${schoolCode}/staff/`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            <Link className="text-dark" to={`/school/${schoolCode}/staff/`}>
              <p className="h6">
                {" "}
                <FontAwesomeIcon icon={faChartSimple} /> Dashboard
              </p>
            </Link>
          </div>

          <div
            className={
              currentPath === `/school/${schoolCode}/staff/staffs`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/staffs`}
            >
              {" "}
              <p className="h6">
                {" "}
                <FontAwesomeIcon icon={faPeopleCarry} /> Staffs
              </p>{" "}
            </Link>{" "}
          </div>

          <div
            className={
              currentPath === `/school/${schoolCode}/staff/profile`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/profile`}
            >
              {" "}
              <p className="h6">
                <FontAwesomeIcon icon={faUserTie} />
                Profile
              </p>{" "}
            </Link>
          </div>

          <hr />
          <p className="h6 text-secondary w600 text-left mx-1 mt-4 mb-3">
            {" "}
            Student Tools{" "}
          </p>

          <div
            className={
              currentPath === `/school/${schoolCode}/staff/exams`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/exams`}
            >
              <p className="h6">
                {" "}
                <FontAwesomeIcon icon={faGraduationCap} /> Exams
              </p>{" "}
            </Link>
          </div>

          <div
            className={
              currentPath === `/school/${schoolCode}/staff/students`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/students`}
            >
              <p className="h6">
                {" "}
                <FontAwesomeIcon icon={faPeopleGroup} /> Students
              </p>{" "}
            </Link>
          </div>

          {/* <div
            className={
              currentPath === `/school/${schoolCode}/staff/account`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/account`}
            >
              <p className="h6">
                <FontAwesomeIcon icon={faCoins} />
                Account
              </p>{" "}
            </Link>
          </div> */}

          <div
            className={
              currentPath === `/school/${schoolCode}/staff/attendance`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/attendance`}
            >
              <p className="h6">
                {" "}
                <FontAwesomeIcon icon={faNoteSticky} /> Attendance
              </p>
            </Link>{" "}
          </div>

          {/* <div
            className={
              currentPath === `/school/${schoolCode}/staff/library`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/library`}
            >
              <p className="h6">
                <FontAwesomeIcon icon={faBookAtlas} />
                Library
              </p>{" "}
            </Link>{" "}
          </div> */}

          <hr />

          <p className="h6 text-secondary w600 text-left mx-1 mt-4 mb-3">
            {" "}
            System{" "}
          </p>

          <div
            className={
              currentPath === `/school/${schoolCode}/staff/security`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/security`}
            >
              <p className="h6">
                {" "}
                <FontAwesomeIcon icon={faLock} /> Security
              </p>
            </Link>{" "}
          </div>

          <div
            className={
              currentPath === `/school/${schoolCode}/staff/admissions`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/admissions`}
            >
              <p className="h6">
                {" "}
                <FontAwesomeIcon icon={faPen} /> Admissions
              </p>
            </Link>{" "}
          </div>

          <div
            className={
              currentPath === `/school/${schoolCode}/staff/tools`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/staff/tools`}
            >
              <p className="h6">
                <FontAwesomeIcon icon={faToolbox} /> Tools
              </p>
            </Link>{" "}
          </div>

          <div
            className={
              currentPath === `/school/${schoolCode}/staff/site`
                ? "content active"
                : "content"
            }
            onClick={() => function24()}
          >
            {" "}
            <Link className="text-dark" to={`/school/${schoolCode}/staff/site`}>
              <p className="h6">
                <FontAwesomeIcon icon={faComputer} /> Site Tools
              </p>
            </Link>{" "}
          </div>
        </div>

        {scholib && (
          <div className="bottom">
            <div className="image">
              <img src={scholib.logo.secure_url} alt="" />
            </div>

            <p className="h6 para1" style={{ color: "#8253E3" }}>
              {" "}
              {scholib.name}
            </p>

            <p className="h7">
              {" "}
              <span>"</span> A good life starts with a good education{" "}
              <span>"</span>{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniNav;
