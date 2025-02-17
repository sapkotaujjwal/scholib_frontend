import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const SocialIcon = ({ href, icon }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      <FontAwesomeIcon icon={icon} className="text-2xl" />
    </a>
  );
};

const Footer = () => {
  const school = useSelector((state) => state.Home.school.payload);
  const scholib = useSelector((state) => state.Scholib.scholib.payload);

  return (
    <footer className="bg-white py-8 px-4 shadow-inner mt-10" id="footerId001">
      {/* School Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {school.logo && (
                <img
                  src={school.logo.secure_url}
                  alt={school.sName}
                  className="h-12 w-12 object-contain"
                />
              )}
              <h2 className="text-xl font-semibold capitalize">
                {school.sName}
              </h2>
            </div>
            <h3 className="text-lg font-normal capitalize">{school.name}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm w200">{school.address}</p>
            </div>
          </div>

          {/* Middle Column */}
          <div className="text-center md:text-left">
            {school.logo && (
              <img
                src={school.logo.secure_url}
                alt={school.sName}
                className="h-16 w-16 object-contain mx-auto md:mx-0 mb-4"
              />
            )}
            <p className="text-sm text-gray-600">{school.address}</p>
          </div>

          {/* Right Column */}
          <div className="text-center ">
            <h3 className="text-lg font-medium">Follow Us</h3>
            <div className="flex1 space-x-4 py-3">
              <SocialIcon href={school.social.facebook} icon={faFacebook} />
              <SocialIcon href={school.social.instagram} icon={faInstagram} />
              <SocialIcon href={school.social.twitter} icon={faLinkedin} />
              <SocialIcon href={school.social.youtube} icon={faYoutube} />
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="my-1">{school.address}</p>
              <p className="my-1">{school.email[0]}</p>
              <p className="my-1">{school.phone[0]}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t pt-8 flex4">
          <p className="text-sm font-semibold text-gray-600 md:mb-0">
            © Copyright Scholib Tech Pvt. Ltd
          </p>
          <nav className="hidden md:flex">
            <ul className="flex flex-wrap justify-center space-x-6">
              {[
                { path: "", label: "Home" },
                { path: "updates", label: "Updates" },
                { path: "contact", label: "Contact" },
                { path: "gallery", label: "Gallery" },
                { path: "admission", label: "Admission" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={`/school/${school.schoolCode}${
                      item.path ? `/${item.path}` : ""
                    }`}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Scholib Section */}
      {scholib && (
        <div className="max-w-7xl mx-auto mt-9 pt-8 border-t">
          <div className=" w-full flex4 flex-wrap">
            {/* Scholib Info */}
            <div className="space-y-4 flex1 flex-col">
              <h3 className="text-lg font-medium capitalize">{scholib.name}</h3>
              <a href={scholib.url}>
                <div className="shadow1">
                  <img
                    src={scholib.logo.secure_url}
                    alt={scholib.name}
                    className="h-32 w-32 object-contain"
                  />
                </div>
              </a>
              <div className="flex space-x-4">
                <SocialIcon href={scholib.facebook} icon={faFacebook} />
                <SocialIcon href={scholib.instagram} icon={faInstagram} />
                <SocialIcon href={scholib.linkedin} icon={faLinkedin} />
                <SocialIcon href={scholib.youtube} icon={faYoutube} />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 flex1 flex-col ">
              <p className="text-sm text-gray-600 my-1">{scholib.email}</p>
              <p className="text-sm text-gray-600 my-1">{scholib.phone}</p>
              <a
                href={"https://scholib.com"}
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Visit Scholib
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
