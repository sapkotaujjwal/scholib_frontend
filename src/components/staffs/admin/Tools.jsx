import React, { useEffect, useState } from "react";
import "./tools.scss";
import MetaData from "../../layout/MetaData";
import { useSelector } from "react-redux";
import AnalyticsOverview from "./AnalyticsOverview";
import FeeStructure from "./FeeStructure";
import Classes from "./Classes";
import DailyActivities from "./DailyActivities";
import ExtraTools from "./ExtraTools";

const Tools = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state)=> state.Home.school.payload);

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="tools-admin2733">
      <MetaData title={`${user && user.role ? "Staff" : "Student"} || Tools`} />
      <div className="content-inside">
        <div className="veryTop">
          <p className="h4 text-center" style={{ color: "#133189" }}>
            Tools
          </p>
          <p className="h6 text-center"> {school.name} </p>
        </div>

        {/* another navigation bar  */}
        <div className="admin-navbar-pro custom-scrollbar">
          <div className="elementsInside flex1 pb-2">
            <div
              className={`each-div ${currentPage === 1 ? "active" : ""} `}
              onClick={() => setCurrentPage(1)}
            >
              <p>Analytics Overview</p>
            </div>

            <div
              className={`each-div ${currentPage === 2 ? "active" : ""} `}
              onClick={() => setCurrentPage(2)}
            >
              <p>Fee Structure</p>
            </div>

            <div
              className={`each-div ${currentPage === 3 ? "active" : ""} `}
              onClick={() => setCurrentPage(3)}
            >
              <p>Classes & Courses</p>
            </div>

            <div
              className={`each-div ${currentPage === 4 ? "active" : ""} `}
              onClick={() => setCurrentPage(4)}
            >
              <p>Daily Activity</p>
            </div>

            <div
              className={`each-div ${currentPage === 5 ? "active" : ""} `}
              onClick={() => setCurrentPage(5)}
            >
              <p>Removed Members</p>
            </div>
          </div>
        </div>

        {/* rendering the components according to their order  */}

        <section className="PagesRendering">
          {currentPage && currentPage === 1 && <AnalyticsOverview />}
          {currentPage && currentPage === 2 && <FeeStructure />}
          {currentPage && currentPage === 3 && <Classes />}
          {currentPage && currentPage === 4 && <DailyActivities />}
          {currentPage && currentPage === 5 && <ExtraTools />}
        </section>
      </div>
    </div>
  );
};

export default Tools;
