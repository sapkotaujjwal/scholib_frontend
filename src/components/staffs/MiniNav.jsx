import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faCoins,
  faComputer,
  faGraduationCap,
  faLock,
  faNoteSticky,
  faPen,
  faPeopleCarry,
  faPeopleGroup,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const MiniNav = ({ function24 = () => {} }) => {
  const school = useSelector((state) => state.Home.school.payload);
  const scholib = useSelector((state) => state.Scholib.scholib.payload);
  const schoolCode = school.schoolCode;

  const location = useLocation();
  const currentPath = location.pathname;
  const contRef = useRef(null);

  const handleClickOutside = (event) => {
    if (contRef.current && !contRef.current.contains(event.target)) {
      function24();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavLink = ({ to, icon, children }) => {
    const isActive = currentPath === to;
    return (
      <Link
        to={to}
        onClick={function24}
        className={`
          group w-full px-3 py-2 my-1 flex items-center rounded-md transition-all duration-300
          ${isActive 
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-200 hover:bg-cyan-600" 
            : "text-gray-700 hover:bg-sky-50 hover:text-cyan-600"
          }
        `}
      >
        <div
          className={`mr-3 transition-transform duration-300 group-hover:scale-110 ${
            isActive ? "text-white" : "text-gray-500"
          }`}
        >
          <FontAwesomeIcon icon={icon} className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">{children}</span>
      </Link>
    );
  };

  return (
    <div
      ref={contRef}
      className="w-[250px] md:w-[205px] h-screen overflow-y-auto bg-white shadow-sm border-r border-gray-100 px-2 py-4 transition-all duration-300 ease-in-out custom-scrollbar"
    >
      <div className="ps-2 pb-6">
        {/* Header */}
        <div className="flex items-center space-x-3 px-2 mb-8 group">
          <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
            <img
              src={school.logo?.secure_url || "/placeholder.png"}
              alt="School Logo"
              className="w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-gray-800 truncate">
              {school.sName}
            </h2>
            <span className="text-xs text-gray-500">School</span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1 px-1">
          <NavLink to={`/school/${schoolCode}/staff/`} icon={faChartSimple}>
            Dashboard
          </NavLink>
          <NavLink
            to={`/school/${schoolCode}/staff/staffs`}
            icon={faPeopleCarry}
          >
            Staffs
          </NavLink>
        </div>

        {/* Student Tools Section */}
        <div className="mt-6 px-1">
          <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Student Tools
          </h3>
          <div className="space-y-1">
            <NavLink
              to={`/school/${schoolCode}/staff/exams`}
              icon={faGraduationCap}
            >
              Exams
            </NavLink>
            <NavLink
              to={`/school/${schoolCode}/staff/students`}
              icon={faPeopleGroup}
            >
              Students
            </NavLink>
            <NavLink to={`/school/${schoolCode}/staff/account`} icon={faCoins}>
              Account
            </NavLink>
            <NavLink
              to={`/school/${schoolCode}/staff/attendance`}
              icon={faNoteSticky}
            >
              Attendance
            </NavLink>
          </div>
        </div>

        {/* System Section */}
        <div className="mt-6 px-1">
          <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            System
          </h3>
          <div className="space-y-1">
            <NavLink to={`/school/${schoolCode}/staff/security`} icon={faLock}>
              Security
            </NavLink>
            <NavLink to={`/school/${schoolCode}/staff/admissions`} icon={faPen}>
              Admissions
            </NavLink>
            <NavLink to={`/school/${schoolCode}/staff/tools`} icon={faToolbox}>
              Tools
            </NavLink>
            <NavLink to={`/school/${schoolCode}/staff/site`} icon={faComputer}>
              Site Tools
            </NavLink>
          </div>
        </div>

        {/* Scholib Footer */}
        {scholib && (
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg transition-all duration-300 hover:scale-[1.02] mb-7">
            <div className="w-full mb-3">
              <img
                src={scholib.logo.secure_url}
                alt="Scholib Logo"
                className="w-full mx-auto rounded-md shadow-sm object-cover"
              />
            </div>
            <h3 className="text-sm font-medium text-indigo-600 mb-2">
              {scholib.name}
            </h3>
            <p className="text-xs text-gray-600 italic">
              "A good life starts with a good education"
            </p>
          </div>
        )}

        <hr />
      </div>
    </div>
  );
};

export default MiniNav;
