import React, { useEffect } from "react";
import "./scholib_about.scss";
import MetaData from "../layout/MetaData";
import Terms from "./Terms";
const Scholib_about = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="yeh627vae34">
      <MetaData title={`Scholib || About Us  `} />

      <div className="asdkfjoqwerfaljsdf">
        <header className="header">
          <div className="header-overlay">
            <div className="header-content">
              <h1>
                About <span>Scholib</span>
              </h1>
              <p>Empowering Schools Across Nepal with Modern Technology</p>
            </div>
          </div>
        </header>

        <div className="mainInews3232z">
          <section className="about">
            <div className="about-container">
              <div className="about-text">
                <h2 className="font-semibold"> Who We Are </h2>
                <p>
                  At <strong className="font-normal">Scholib</strong>, we are
                  passionate about transforming education in Nepal. We empower
                  schools with advanced tools to manage operations efficiently,
                  automate daily tasks, and foster collaboration among students,
                  teachers, and administrators.
                </p>
                <p>
                  Our vision is simple: to equip every school with secure,
                  user-friendly, and innovative solutions, enabling them to
                  focus on what truly matters –
                  <em>building the leaders of tomorrow.</em>
                </p>
              </div>
              <div className="about-image">
                <img
                  src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="About Us Image"
                />
              </div>
            </div>
          </section>

          <section className="features-container">
            <h2 className="section-title">Our Key Features</h2>
            <section className="features">
              <div className="feature">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Feature Icon"
                />
                <h3>Centralized Management</h3>
                <p>One platform to handle all school operations efficiently.</p>
              </div>

              <div className="feature">
                <img
                  src="https://plus.unsplash.com/premium_photo-1700681802509-d31a20943657?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Feature Icon"
                />
                <h3>User-Friendly Interface</h3>
                <p>Intuitive and easy-to-use interface for all users.</p>
              </div>

              <div className="feature">
                <img
                  src="https://media.istockphoto.com/id/2172249278/photo/lock-sign-on-abstract-program-code-digital-security-concept-protect-data.jpg?s=2048x2048&w=is&k=20&c=WqwD-OFSbuNxQ4-nITN44I2AEf9okmdqVJcppUeflgw="
                  alt="Feature Icon"
                />
                <h3>Data Security</h3>
                <p>Top-notch security ensures your data stays protected.</p>
              </div>
            </section>
          </section>

          <section className="team applyBootstrap">
            <h3 className="h4 w500 my-4 text-center">
              Meet our <span style={{ color: "#00BDD6" }}> Team </span>
            </h3>

            <div className="p1">
              <p className="h6 my-3 text-center mx-3">
                Our team at Scholib.com is dedicated to transforming education
                through technology. With a passion for innovation and a deep
                understanding of school needs, we work tirelessly to create
                solutions that empower educators and simplify school management.
                Together, we're shaping the future of education.
              </p>
            </div>

            <div className="member-container custom-scrollbar flex2">
              <div className="member flex1 mx-2">
                <img
                  src={
                    "https://res.cloudinary.com/dodvbotgd/image/upload/v1716822181/j18rrjipb2kbtjx1pi1j.jpg"
                  }
                  className="rounded-circle"
                  alt=""
                />
                <p className="h6 w600 my-3 text-capitalize"> ujjwal sapkota </p>
                <p className="h7 w300"> Co Founder </p>
                <p className="h7 w500 text-primary my-0">BIT</p>
              </div>

              <div className="member flex1 mx-2">
                <img
                  src={
                    "https://res.cloudinary.com/dodvbotgd/image/upload/v1725001088/uvqaoid8bjxvr4ulrfcl.jpg"
                  }
                  className="rounded-circle"
                  alt=""
                />
                <p className="h6 w600 my-3 text-capitalize">
                  {" "}
                  Milan Bhattarai{" "}
                </p>
                <p className="h7 w300"> Co Founder </p>
                <p className="h7 w500 text-primary my-0">BIT</p>
              </div>

              <div className="member flex1 mx-2">
                <img
                  src={
                    "https://res.cloudinary.com/dodvbotgd/image/upload/v1725000204/mahyuvrrisnefyopgf7a.jpg"
                  }
                  className="rounded-circle"
                  alt=""
                />
                <p className="h6 w600 my-3 text-capitalize">
                  {" "}
                  Mausham Acharya{" "}
                </p>
                <p className="h7 w300"> Co Founder</p>
                <p className="h7 w500 text-primary my-0">BIT</p>
              </div>
            </div>
          </section>

          <section className="terms">
              <p className="h5 w600 text-center text-secondary mb-4">
                {" "}
                Our Policies{" "}
              </p>
              <Terms />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Scholib_about;
