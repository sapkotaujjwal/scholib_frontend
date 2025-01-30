import React, { useEffect, useState } from "react";
import "./Scholib_home.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faLocation,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import SearchComponent from "./Scholib_search";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Scholib_home = () => {


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const allSchools = useSelector((state) => state.Scholib.scholib.payload.schools);

  const schoolsArray = allSchools.map((school)=>{
    return school.info;
  })

  const [searchee , showSearch ] = useState(false);

  function handleSearchFocus (){
    document.body.classList.toggle('dshauda-hidden');
    showSearch(!searchee);
  }

  const scholib = useSelector((state)=> state.Scholib.scholib.payload);


  return (
    <div className="jhdtqq8">

      {searchee && <SearchComponent suggestions={schoolsArray} search10={handleSearchFocus} /> }

      
      <div className="main">


        <div className="search_box flex1">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <p className="h3 d-inline-block mx-3"> Discover </p>
        </div>

        <p className="h5 d-block mt-1 mb-5 text-center w300">
          Search for your school...
        </p>

        <div className="search-component">
          <input type="text" placeholder="Search..." onFocus={handleSearchFocus} />
        </div>

        <div className="login1">
         <Link to='/register'>  <button className="yyy" style={{borderRadius: '2px'}}> Register your school </button> </Link>


          <div className="line my-5"></div>

          <section className="myInfo text-left">
          <div className="upper d-flex">
            {scholib && <div className="image">
              <img src={scholib.logo.secure_url} style={{objectFit: 'contain'}} alt="" />
            </div>}
            <div className="info ms-2">
              <p className="h6 text-secondary w600"> Scholib </p>
              <p className="h7"> Making Things Easy </p>
            </div>
          </div>

          <hr style={{marginTop:'30px'}}/>

          <div className="below flex4">
            <div className="left each">
              <p> <FontAwesomeIcon icon={faBriefcase} style={{marginRight: '6px'}} /> Scholib Tech Pvt. Ltd </p>
              <p> <FontAwesomeIcon icon={faLocation} style={{marginRight: '6px'}} /> Buddhashanti 2 Budhabare Jhapa </p>
            </div>
            <div className="right each">
            <p> <FontAwesomeIcon icon={faPhone} style={{marginRight: '6px'}} /> 9806014021 </p>
              <p> <FontAwesomeIcon icon={faEnvelope} style={{marginRight: '6px'}} /> contact@scholib.com </p>
            </div>
          </div>
        </section>

        <section className="about-box">
          <p className="h5 w600"> Why Choose Us </p>

          <p className='lastP'>
          At Scholib, we revolutionize school operations through innovative web and ERP solutions tailored for the education sector. Our cutting-edge platforms leverage the latest technologies to streamline processes, enhance collaboration, and provide powerful insights. With a team of seasoned experts deeply versed in the unique needs of schools, we craft customized systems that exceed expectations. Choose Scholib for our unparalleled expertise in developing user-friendly, feature-rich solutions that elevate the educational experience for administrators, teachers, students, and parents alike. Join our growing community of satisfied educational institutions empowered by Scholib's commitment to excellence.
          </p>

        </section>



          <section className="contact">
            <div className="four">
              <p className="h4 w600 tc"> Contact Us </p>

              <div className="main width flex4">
                <div className="left width flex2">
                  <div className="content flex1">
                    <FontAwesomeIcon icon={faPhone} />
                    <p className="h6 w700">PHONE</p>
                    <p className="h7 w700">
                      &nbsp; <span> 9806014021</span>
                    </p>
                    <p className="h7 w700">
                      &nbsp; <span> 9816037076 </span>
                    </p>
                  </div>
                  <div className="content flex1">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p className="h6 w700">EMAIL</p>
                    <p className="h7 w700">
                      &nbsp; <span> contact@scholib.com</span>
                    </p>
                    <p className="h7 w700">
                      &nbsp; <span> milanbhattarai007@gmail.com </span>
                    </p>
                  </div>
                  <div className="content flex1">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p className="h6 w700">LOCATION</p>
                    <p className="h7 w700">
                      &nbsp;
                      <span>
                        Buddhashanti 2 Budhabare jhapa
                      </span>
                    </p>
                  </div>
                  <div className="content flex1">
                    <FontAwesomeIcon icon={faLink} />
                    <p className="h6 w700">SOCIAL MEDIA</p>

                    <div className="logos flex1">

                      <a href={"https://www.instagram.com/scholib.official"} target="_blank">
                        <p className="h3">
                          <FontAwesomeIcon icon={faInstagram} />
                        </p>
                      </a>

                      <a href={"https://www.x.com/scholib"} target="_blank">
                        <p className="h3">
                          <FontAwesomeIcon icon={faTwitter} />
                        </p>
                      </a>

                      <a href={"https://www.youtube.com/@scholib"} target="_blank">
                        <p className="h3">
                          <FontAwesomeIcon icon={faYoutube} />
                        </p>
                      </a>
                    </div>
                  </div>
                </div>

                {/* <div className="right width flex1">


                   <iframe
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1498.3764852834981!2d88.04312823955637!3d26.72011464642144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e5b707bb4dee8b%3A0xa28189dcc8d781c4!2sBudhabare!5e0!3m2!1sen!2snp!4v1735198869526!5m2!1sen!2snp"
                    style={{ border: "0" }}
                    allowFullScreen=""
                    width={600}
                    height={600}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                </div> */}
              </div>
            </div>
          </section>

          <section className="work">
          <p className="h4 w600"> We work to make it <span className="happen">Happen</span> </p>

          <p className="h7 text-secondary text-center udata">
          Scholib.com empowers schools with cutting-edge management tools to streamline administration, enhance communication, and elevate the educational experience. Our platform simplifies tasks, from student data management to exam scheduling, so educators can focus on what matters most—nurturing student success.
          </p>

          <div className="bottom flex2">
            
            <div className="want">
              <p className="w600 h5"> What We Offer </p>
               </div>

              <div className="image">
                <img src="https://img.freepik.com/free-vector/successful-business-man-holding-trophy_1150-35042.jpg" alt="" />
                <p className="h6"> Technology </p>
              </div>

              <div className="image">
                <img src="https://img.freepik.com/free-vector/isometric-cms-concept_23-2148807389.jpg?t=st=1735110218~exp=1735113818~hmac=c80469c1971d50c2f52c07e2539fa2b004e14234a71b5757935d2ac4e3849db1&w=996" alt="" />
                <p className="h6"> Platform </p>
              </div>

              <div className="image">
                <img src="https://img.freepik.com/free-vector/hand-drawn-ai-alignment-illustration_23-2151106542.jpg?t=st=1735110277~exp=1735113877~hmac=15730d9d506563784b39ba6d236b3933249deaf9e0fb4fd78d45efe99911205f&w=740" alt="" />
                <p className="h6">Integration</p>
              </div>

          </div>
          </section>


        </div>


        
      </div>


    </div>
  );
};

export default Scholib_home;
