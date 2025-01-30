import React, { useEffect, useState } from "react";
import "./siteTools.scss";
import MetaData from "../../layout/MetaData";
import { useSelector } from "react-redux";
import Reviews from "./Reviews";
import Faq from "./Faq";
import MoreThings from "./MoreThings";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Updates from "../../updates/Updates";
import Gallery from "../../gallery/Gallery";

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
    <div className="site-tools-admin2733">
      <MetaData title={`${user && user.role ? "Staff" : "Student"} || Tools`} />
      <div className="content-inside">
        <div className="veryTop">
          <p className="h4 ps-3" style={{ color: "#133189" }}>
            Website Tools
          </p>
          <p
            className="h6 w500 f3 ps-3"
            style={{ marginBottom: "13px", fontSize: "13px" }}
          >
            {" "}
            Few of things to edit from your landing page and make sure the info
            is correct...{" "}
          </p>

          <button
            className="btn btn-secondary ms-3 pt-1"
            style={{ fontSize: "14px", width: "min(90%, 330px)" }}
            onClick={() =>
              history.push(`/school/${school.schoolCode}/website/update`)
            }
          >
            {" "}
            Edit School Info{" "}
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

            {/* <div
              className={`each-div ${currentPage === 3 ? "active" : ""} `}
              onClick={() => setCurrentPage(3)}
            >
              <p>More Things</p>
            </div> */}

            <div
              className={`each-div ${currentPage === 4 ? "active" : ""} `}
              onClick={() => setCurrentPage(4)}
            >
              <p>Updates</p>
            </div>

            <div
              className={`each-div ${currentPage === 5 ? "active" : ""} `}
              onClick={() => setCurrentPage(5)}
            >
              <p>Gallery</p>
            </div>
          </div>
        </div>

        {/* rendering the components according to their order  */}

        <section className="PagesRendering">
          {currentPage && currentPage === 1 && <Reviews />}
          {currentPage && currentPage === 2 && <Faq />}
          {currentPage && currentPage === 3 && <MoreThings />}
          {currentPage && currentPage === 4 && <Updates />}
          {currentPage && currentPage === 5 && <Gallery />}
        </section>
      </div>
    </div>
  );
};

export default Tools;
