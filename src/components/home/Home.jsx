import React, { useEffect, useState } from "react";
import "./home.scss";
import { useSelector } from "react-redux";
import Himage from "./Himage";
import MetaData from "../layout/MetaData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faClipboardCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import { faSlack } from "@fortawesome/free-brands-svg-icons";
import Reviews from "../layout/Reviews";
import FewMore from "./FewMore";
import FAQ from "./FAQ";
import { Link } from "react-router-dom";
import Dropdown from "../basicComponents/Dropdown";
import DataTable from "../layout/Table";

function Home() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const course = useSelector((state) => state.Course.course.payload.course);

  const [cClass, setCClass] = useState(course[0]);

  const school = useSelector((state) => state.Home.school.payload);


  return (
    <div className="qrysbs54">
      <div className="main width">
        <MetaData title={`${school.sName} || ${school.name}`} />
        <section>
          <h1 className="h5 f2 w600 mt-4"> {school.name} </h1>
          <p className="h7 d-inline-block my-2">
            <FontAwesomeIcon icon={faStar} style={{ color: "#00BCD7" }} />
            &nbsp; {school.studentsTaught} + Students Taught
          </p>

          <p className="h7 d-inline-block w500">
            {" "}
            <p className="h5 d-inline-block"> &nbsp;&nbsp;. &nbsp; </p>{" "}
            {school.address}{" "}
          </p>
        </section>
        <Himage />

        <section className="section2">
          <div className="first flex4">
            <div className="one">
              <p className="h6 py-3 pt-0 w700 " style={{ color: "#41CEE1" }}>
                <FontAwesomeIcon icon={faStar} className="me-2 " />
                Hello, We Have
              </p>

              <div className="weHave" style={{ width: "320px" }}>
                {school.facilities.map((service, index) => {
                  return (
                    <div className="each d-inline-block" key={index}>
                      <FontAwesomeIcon
                        className="d-inline-block"
                        icon={faSlack}
                        style={{ color: "#01BDD7", marginRight: "14px" }}
                      />
                      <p className="h6 w500 d-inline-block"> {service}</p>
                    </div>
                  );
                })}
              </div>

              <div className="text1">
                <p className="f2">{school.text1}</p>
              </div>

              <hr className="text-secondary" />

              {
                <div className="three">
                  <p className="h5 f2 w500 my-4 text-center"> Our Programs </p>

                  <div className="box">
                    {school.programs.map((program_text, index) => {
                      return (
                        <div className="each" key={index}>
                          <p className="h7 w500"> {program_text} </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              }
            </div>
            <div className="two">
              <div className="img">
                <img
                  src={
                    school.principle && school.principle.image
                      ? school.principle.image.secure_url
                      : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
                  }
                  alt=""
                />
              </div>

              <p className="h7 text-center text-secondary my-3">
                {'"'}
                {school.principle.quote}
                {'"'}
              </p>

              <div className="principle">
                <div className="box">
                  {" "}
                  <p className="h7"> Principle : </p>{" "}
                </div>
                <p className="h7 w500"> {school.principle.name} </p>
              </div>
            </div>
          </div>

        </section>

        <div className="section3 flex4">
          <div className="one">
            <p className="h4"> Since {school.estd}</p>

            <p className="h7 my-2" style={{ maxWidth: "400px" }}>
              {school.text2}
            </p>

            <Link to={`/school/${school.schoolCode}/admission`}>
              <button
                className="btn btn-primary mt-2"
                style={{ backgroundColor: "#01BDD7", border: "0px" }}
              >
                Get Admission{" "}
              </button>
            </Link>
          </div>
          <div className="two">
            <div className="box">
              <div className="one flex1">
                {" "}
                <FontAwesomeIcon icon={faClipboardCheck} />{" "}
                <p className="h6 w500"> Interactive Class </p>{" "}
              </div>
              <div className="two flex1">
                {" "}
                <FontAwesomeIcon icon={faCalendarCheck} />{" "}
                <p className="h6 w500"> Quality Education </p>{" "}
              </div>
            </div>
          </div>
        </div>

        <section className="team mt-5">
          <h3 className="h4 w500 my-4 text-center">
            Meet our <span style={{ color: "#00BDD6" }}> Team </span>
          </h3>

          <div className="p1">
            <p className="h6 my-3 text-center mx-3">{school.teamText}</p>
          </div>

          <div className="member-container custom-scrollbar flex2">
            {school.staffs.map((ind, index) => {
              return (
                <div className="member flex1 mx-2" key={index}>
                  <img
                    src={
                      ind.pPhoto
                        ? ind.pPhoto.secure_url
                        : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
                    }
                    style={{ objectFit: "cover" }}
                    className="rounded-circle"
                    alt=""
                  />
                  <p className="h6 w600 my-3 text-capitalize"> {ind.name} </p>
                  <p className="h7 w300"> {ind.title} </p>
                  <p className="h7 w500 text-primary my-0">
                    {ind.qualification}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="work">
          <p className="h4 w600 text-center">
            {" "}
            We work to make it <span className="happen">Happen</span>{" "}
          </p>

          <p className="h7 text-secondary text-center udata">
            {school.teamText}
          </p>

          <div className="bottom flex2">
            <div className="want">
              <p className="w600 h5"> What We Want </p>
            </div>

            <div className="image">
              <img
                src="https://img.freepik.com/free-vector/successful-business-man-holding-trophy_1150-35042.jpg"
                alt=""
              />
              <p className="h6">Education</p>
            </div>

            <div className="image">
              <img
                src="https://img.freepik.com/premium-vector/cute-man-working-laptop-with-fire-cartoon-vector-icon-illustration-people-technology-isolated_138676-6247.jpg"
                alt=""
              />
              <p className="h6">Hard Work</p>
            </div>

            <div className="image">
              <img
                src="https://blog.ipleaders.in/wp-content/uploads/2018/01/BV-Acharya-5.jpg"
                alt=""
              />
              <p className="h6">Success</p>
            </div>
          </div>
        </section>

        <section className="fewMore">
          <FewMore />
        </section>

        {school.faq.length > 0 && (
          <section className="faq-section">
            <FAQ array={school.faq} />
          </section>
        )}

        {course.length > 0 && (
          <section className="forFee">
            <hr className="my-3" />
            <div className="texr21">
              <p className="h4 w600 text-center"> Fee Structure </p>
              {/* <p className="h6 f2 w500 p-3 pb-0 text-center"> Check out our fee structure </p> */}
            </div>
            <hr className="my-3" />

            {course.length === 0 && (
              <>
                <hr />

                <p className="h6 text-center mx-2 text-secondary my-3">
                  No Courses available
                </p>
              </>
            )}

            {course.length > 0 && cClass && (
              <div className="fee-Table my-3 pb-3">
                <div className="for-dropdown flex1 mb-2">
                  <p className="h6 w500 pe-2"> Class : </p>
                  <Dropdown
                    onSelect={(a, b, c) => {
                      const selectedCourse = course.find(
                        (data) => data._id === c
                      );
                      setCClass(selectedCourse);
                    }}
                    title={cClass.class}
                    options={course.map((crc) => {
                      return {
                        label: crc.class,
                        value: crc._id,
                      };
                    })}
                  />
                </div>

                <div className="custom-scrollbar">
                  <DataTable
                    fields={["Title", "Amount ( Yearly )"]}
                    data={cClass.fees.map(({ ...data }) => {
                      delete data._id;
                      return data;
                    })}
                  />
                </div>

                <hr />
                <p className="h6 w500 text-center my-4">
                  <span
                    className="w600 bg-secondary text-white me-3 p-2"
                    style={{ borderRadius: "4px" }}
                  >
                    {" "}
                    Total Amount :{" "}
                  </span>{" "}
                  Rs. {cClass.fees.reduce((sum, fee) => sum + fee.amount, 0)}
                </p>

                <hr />
              </div>
            )}
          </section>
        )}

        <section className="reviews">
          <Reviews />
        </section>
      </div>
    </div>
  );
}

export default Home;
