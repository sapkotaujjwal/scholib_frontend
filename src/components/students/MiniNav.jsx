import React from "react";
import "./miniNav.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpenReader,
  faChartSimple,
  faCoins,
  faGraduationCap,
  faLock,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const MiniNav = ({ function23 = function () {} }) => {
  const logo =
    "https://img.freepik.com/premium-vector/modern-badge-logo-instagram-icon_578229-124.jpg";

  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;
  const scholib = useSelector((state) => state.Scholib.scholib.payload);

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="miniNav832836 custom-scrollbar">
      <div className="main1">
        <div className="middle mt-5">
          <div
            className={
              currentPath === `/school/${schoolCode}/student/`
                ? "content active"
                : "content"
            }
            onClick={() => function23()}
          >
            <Link className="text-dark" to={`/school/${schoolCode}/student/`}>
              <p className="h6">
                <FontAwesomeIcon icon={faChartSimple} /> Dashboard
              </p>
            </Link>
          </div>

          {/* <div
            className={
              currentPath === `/school/${schoolCode}/student/results`
                ? "content active"
                : "content"
            }
            onClick={() => function23()}
          >
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/student/results`}
            >
              <p className="h6">
                <FontAwesomeIcon icon={faGraduationCap} /> Results
              </p>
            </Link>
          </div> */}

          <div
            className={
              currentPath === `/school/${schoolCode}/student/fees`
                ? "content active"
                : "content"
            }
            onClick={() => function23()}
          >
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/student/fees`}
            >
              <p className="h6">
                <FontAwesomeIcon icon={faCoins} /> Fees
              </p>
            </Link>
          </div>

          <div
            className={
              currentPath === `/school/${schoolCode}/student/profile`
                ? "content active"
                : "content"
            }
            onClick={() => function23()}
          >
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/student/profile`}
            >
              <p className="h6">
                <FontAwesomeIcon icon={faUserTie} /> Profile
              </p>
            </Link>
          </div>

          <div
            className={
              currentPath === `/school/${schoolCode}/student/library`
                ? "content active"
                : "content"
            }
            onClick={() => function23()}
          >
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/student/library`}
            >
              <p className="h6">
                <FontAwesomeIcon icon={faBookOpenReader} /> Library
              </p>
            </Link>
          </div>

          <div
            className={
              currentPath === `/school/${schoolCode}/student/security`
                ? "content active"
                : "content"
            }
            onClick={() => function23()}
          >
            <Link
              className="text-dark"
              to={`/school/${schoolCode}/student/security`}
            >
              <p className="h6">
                <FontAwesomeIcon icon={faLock} /> Security
              </p>
            </Link>
          </div>
        </div>

        {/* <div className="bottom">
          <div className="image">
            <img src={logo} alt="" />
          </div>
          <p className="h6 para1" style={{ color: '#8253E3' }}>
            Kanchanjunga Namuna College
          </p>
          <p className="h7">
            <span>"</span> A good life starts with good education <span>"</span>
          </p>
        </div> */}

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
