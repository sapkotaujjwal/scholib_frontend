import React, { useEffect, useState } from "react";
import "./siteTools.scss";
import MetaData from "../../layout/MetaData";
import { useSelector } from "react-redux";
import Reviews from "./Reviews";
import Faq from "./Faq";
import MoreThings from "./MoreThings";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Tools = () => {
  const history = useHistory();
  const school = useSelector((state) => state.Home.school.payload);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const user = useSelector((state) => state.User.user.payload);

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="site-tools-admin2733 applyBootstrap">
      <MetaData title={`${user && user.role ? "Staff" : "Student"} || Tools`} />
      <div className="content-inside">

        <div className="flex flex-col p-4 bg-white shadow1 rounded-lg mx-[2%]">
          <p className="text-xl font-semibold text-[#133189]">Website Tools</p>
          <p className="text-sm text-gray-600">{school.name}</p>
          <button
            className="bg-gray-300 hover:bg-gray-300 text-sm text-gray-800 py-2 px-4 rounded-lg w-full sm:w-80"
            onClick={() =>
              history.push(`/school/${school.schoolCode}/website/update`)
            }
          >
            Edit School Info
          </button>
        </div>

        {/* another navigation bar  */}
        <div className="admin-navbar-pro custom-scrollbar">
          <div className="elementsInside flex1">
            <div
              className={`each-div ${currentPage === 1 ? "active" : ""} `}
              onClick={() => setCurrentPage(1)}
            >
              <p>Reviews</p>
            </div>

            <div
              className={`each-div ${currentPage === 2 ? "active" : ""} `}
              onClick={() => setCurrentPage(2)}
            >
              <p>FAQ</p>
            </div>
          </div>
        </div>

        <section className="PagesRendering">
          {currentPage && currentPage === 1 && <Reviews />}
          {currentPage && currentPage === 2 && <Faq />}
          {currentPage && currentPage === 3 && <MoreThings />}
        </section>
      </div>
    </div>
  );
};

export default Tools;
