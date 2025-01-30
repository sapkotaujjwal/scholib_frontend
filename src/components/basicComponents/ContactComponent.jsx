import React, { useEffect } from 'react'
import './contactComponent.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLink, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'

const ContactComponent = () => {

  const school = useSelector((state) => state.Home.school.payload);


    useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);


  return (
    <div className='dgContact732382'>
              <MetaData title={`${school.sName} || ${'Contact Us'}`} />

        <div className="container">
            <p className="h4 text-center w600 f2" style={{marginTop: '40px', color: '#1ABFE3'}}> Let's Get In Touch</p>

            <p className="h7 w400 p-3 text-center" style={{fontSize: '14px'}}> Feel free to reach out to us for any of your queries we are here to help you... </p>


            </div>

            <div className="dfs text-center">
              <Link to={`/school/${school.schoolCode}/admission`}>
              <button className="btn btn-primary" style={{width: '280px'}}> Get Admission </button>
            </Link>
            </div>

            <p className="h8 w400 p-3 text-center text-capitalize text-secondary" style={{fontSize: '14px'}}> <FontAwesomeIcon icon={faLocationDot} style={{marginRight: '5px'}} />  {school.address}
             </p>

            

            <section className="contact">
            <div className="four">
              <p className="h4 w600 text-center"> Contact Us </p>

              <div className="main width flex4">
                <div className="left width flex2">
                  <div className="content flex1">
                    <FontAwesomeIcon icon={faPhone} />
                    <p className="h6 w700">PHONE</p>

                    {
                      school.phone.map((ph,i)=>{
                        return(

                    <p className="h7 w700" key={i}>
                      &nbsp; <span> {ph}</span>
                    </p>
                        )
                      })
                    }


                  </div>
                  <div className="content flex1">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p className="h6 w700">EMAIL</p>

                    {
                      school.email.map((em,i)=>{
                        return(

                    <p className="h7 w700" key={i}>
                      &nbsp; <span> {em} </span>
                    </p>
                        )
                      })
                    }




                  </div>
                  <div className="content flex1">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p className="h6 w700">LOCATION</p>
                    <p className="h7 w700">
                      &nbsp;
                      <span>
                        {school.address}
                      </span>
                    </p>
                  </div>
                  <div className="content flex1">
                    <FontAwesomeIcon icon={faLink} />
                    <p className="h6 w700">SOCIAL MEDIA</p>

                    <div className="logos flex1">
                    <a href={school.social.facebook}>
                      <p className="h3">
                        <FontAwesomeIcon icon={faFacebook} />
                      </p>
                    </a>

                    <a href={school.social.instagram}>
                      <p className="h3">
                        <FontAwesomeIcon icon={faInstagram} />
                      </p>
                    </a>

                    <a href={school.social.twitter}>
                      <p className="h3">
                        <FontAwesomeIcon icon={faTwitter} />
                      </p>
                    </a>

                    <a href={school.social.youtube}>
                      <p className="h3">
                        <FontAwesomeIcon icon={faYoutube} />
                      </p>
                    </a>
                    </div>
                  </div>
                </div>

                <div className="right width flex1">

                   <iframe
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6622.535044702995!2d55.26842287499925!3d25.1707301041825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2snp!4v1698745670383!5m2!1sen!2snp"
                    style={{ border: "0" }}
                    allowFullScreen=""
                    width={600}
                    height={600}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                </div>
              </div>
            </div>
          </section>
    </div>
  )
}

export default ContactComponent
