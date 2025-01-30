import React from "react";
import "./footer.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import phone from "../../images/phone.png";
import img from "../../images/dots.avif";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import { useSelector } from "react-redux/es/hooks/useSelector";

const Footer = () => {
  const school = useSelector((state) => state.Home.school.payload);

  const scholib = useSelector((state) => state.Scholib.scholib.payload);

  return (
    <div className="footer" id="footerId001">
      {/* school   */}

      <div className="school">
        <div className="school-top flex2">
          <div className="left flex1" style={{ flexDirection: "column" }}>
            <div className="logo flex1">
              {school.logo && (
                <img
                  src={school.logo.secure_url}
                  style={{ objectFit: "contain" }}
                  alt="anyway"
                />
              )}
              <h1 className="h6 capitalize" style={{ marginBottom: "0px" }}>
                {school.sName}
              </h1>
            </div>

            <div className="name flex1 capitalize">
              <h1 className="h6 w400"> {school.name} </h1>
            </div>

            <div className="taught">
              <p className="h7 w500" style={{ marginBottom: "0px" }}>
                Taught More than
              </p>
              &nbsp;&nbsp;{" "}
              <p className="h6 w500" style={{ color: " #171A1FFF" }}>
                {" "}
                {school.studentsTaught} + Students{" "}
              </p>
              <div className="emoji flex1"> &#11088; </div>
            </div>
          </div>

          {/* medium */}

          <div className="medium">
            <div className="logo flex1">
              {school.logo && <img src={school.logo.secure_url} alt="anyway" />}
            </div>

            <div className="slogan">
              <p className="h7 w500"> {school.principle.quote} </p>
            </div>
          </div>

          {/* right */}

          <div className="right">
            <p className="h5 w500" style={{ marginBottom: "10px" }}>
              {" "}
              Follow Us{" "}
            </p>
            <div className="logos">
              {school.social.facebook && (
                <a href={school.social.facebook}>
                  {" "}
                  <p className="h3">
                    <FontAwesomeIcon icon={faFacebook} />{" "}
                  </p>{" "}
                </a>
              )}
              {school.social.instagram && (
                <a href={school.social.instagram}>
                  {" "}
                  <p className="h3">
                    <FontAwesomeIcon icon={faInstagram} />{" "}
                  </p>{" "}
                </a>
              )}
              {school.social.twitter && (
                <a href={school.social.twitter}>
                  {" "}
                  <p className="h3">
                    <FontAwesomeIcon icon={faLinkedin} />{" "}
                  </p>{" "}
                </a>
              )}
              {school.social.youtube && (
                <a href={school.social.youtube}>
                  {" "}
                  <p className="h3">
                    <FontAwesomeIcon icon={faYoutube} />{" "}
                  </p>{" "}
                </a>
              )}
            </div>

            <p className="h6">{school.address}</p>
            <p className="h6">{school.email[0]}</p>
            <p className="h6">{school.phone[0]}</p>
          </div>
        </div>

        <div className="school-bottom flex2">
          <p className="h7 w600" style={{ marginBottom: "0px" }}>
            {" "}
            &copy; Copyright Scholib Tech Pvt. Ltd{" "}
          </p>
          <div className="nav flex2">
            <ul>
              <li>
                <Link to={`/school/${school.schoolCode}`}> Home </Link>
              </li>
              <li>
                <Link to={`/school/${school.schoolCode}/updates`}>
                  {" "}
                  Updates{" "}
                </Link>
              </li>
              <li>
                <Link to={`/school/${school.schoolCode}/contact`}>
                  {" "}
                  Contact{" "}
                </Link>
              </li>
              <li>
                <Link to={`/school/${school.schoolCode}/gallery`}>
                  {" "}
                  Gallery{" "}
                </Link>
              </li>
              <li>
                <Link to={`/school/${school.schoolCode}/admission`}>
                  {" "}
                  Admission{" "}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* end of school */}
      </div>

      {/* scholib  */}
      {scholib && (
        <div className="scholib flex2">
          <div className="left flex3">
            <div className="left">
              <p
                className="h6 w500 capitalize"
                style={{ marginBottom: "10px" }}
              >
                {" "}
                {scholib.name}{" "}
              </p>
              <a href={scholib.url}>
                {" "}
                <img src={scholib.logo.secure_url} alt="url" />
              </a>
              <div className="logos flex1">
                {school.facebook && (
                  <a href={scholib.facebook}>
                    {" "}
                    <p className="h4">
                      <FontAwesomeIcon icon={faFacebook} />{" "}
                    </p>{" "}
                  </a>
                )}
                {school.instagram && (
                  <a href={scholib.instagram}>
                    {" "}
                    <p className="h4">
                      <FontAwesomeIcon icon={faInstagram} />{" "}
                    </p>{" "}
                  </a>
                )}
                {school.linkedin && (
                  <a href={scholib.linkedin}>
                    {" "}
                    <p className="h4">
                      <FontAwesomeIcon icon={faLinkedin} />{" "}
                    </p>{" "}
                  </a>
                )}
                {school.youtube && (
                  <a href={scholib.youtube}>
                    {" "}
                    <p className="h4">
                      <FontAwesomeIcon icon={faYoutube} />{" "}
                    </p>{" "}
                  </a>
                )}
              </div>
            </div>

            <div className="middle">
              <p className="h6"> {scholib.email}</p>
              <p className="h6"> {scholib.phone} </p>
              <a href={scholib.url}>
                {" "}
                <button className="button-66"> Learn More </button>{" "}
              </a>
            </div>

            <div className="right flex1">
              <div className="blurhashImg">
                <img src={phone} alt="" style={{ width: "130px" }} />
              </div>
            </div>
          </div>
          <div className="right flex1">
            <div className="blurhashImg">
              <img src={img} alt="" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
