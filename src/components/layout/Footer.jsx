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
import {
  faEnvelopeCircleCheck,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const SocialIcon = ({ href, icon }) => {
  if (!href) return null;
  return (
    <div className="w-full flex1">
      <a
        href={href}
        className="text-blue-100 hover:text-white transition-colors duration-300 rounded-full bg-blue-600 hover:bg-blue-500 w-10 h-10 flex1"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </a>
    </div>
  );
};

const FooterLink = ({ to, children }) => {
  const isExternal = to.startsWith("http");

  return isExternal ? (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-100 hover:text-white transition-colors duration-300 text-sm inline-block"
    >
      {children}
    </a>
  ) : (
    <Link
      to={to}
      className="text-blue-100 hover:text-white transition-colors duration-300 text-sm inline-block"
    >
      {children}
    </Link>
  );
};

const Footer = () => {
  const school = useSelector((state) => state.Home.school.payload);
  const scholib = useSelector((state) => state.Scholib.scholib.payload);

  return (
    <footer className="bg-gradient-to-br from-blue-800 to-blue-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* School Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {school?.logo && (
                  <img
                    src={school.logo.secure_url}
                    alt={school.sName}
                    className="h-16 w-16 object-cover rounded-xl shadow-lg"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white capitalize">
                    {school?.sName}
                  </h2>
                  <p className="text-blue-200 capitalize">{school?.name}</p>
                </div>
              </div>
              <div className="text-blue-200 space-y-2">
                <p className="flex">
                  <span className="mr-2">
                    {" "}
                    <FontAwesomeIcon icon={faLocationDot} />{" "}
                  </span>
                  {school?.address}
                </p>
                <p className="flex">
                  <span className="mr-2">
                    {" "}
                    <FontAwesomeIcon icon={faEnvelopeCircleCheck} />{" "}
                  </span>
                  {school?.email?.[0]}
                </p>
                <p className="flex">
                  <span className="mr-2">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  {school?.phone?.[0]}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-semibold text-lg mb-6">
                Quick Links
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { path: `https://${school.domain}/`, label: "Home" },
                  { path: "/updates", label: "Updates" },
                  {
                    path: `https://${school.domain}/contact.html`,
                    label: "Contact",
                  },
                  { path: "/gallery", label: "Gallery" },
                  { path: "/admission", label: "Admission" },
                ].map((item) => (
                  <FooterLink
                    key={item.path}
                    to={
                      item.path.startsWith("http")
                        ? item.path
                        : `/school/${school?.schoolCode}${item.path}`
                    }
                  >
                    {item.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6 ">
                Connect With Us
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <SocialIcon href={school?.social?.facebook} icon={faFacebook} />
                <SocialIcon
                  href={school?.social?.instagram}
                  icon={faInstagram}
                />
                <SocialIcon href={school?.social?.twitter} icon={faLinkedin} />
                <SocialIcon href={school?.social?.youtube} icon={faYoutube} />
              </div>
            </div>
          </div>
        </div>

        {/* review Section */}


        {/* Scholib Section */}
        {scholib && (
          <div className="border-t border-blue-700 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-4">
                <a
                  href={scholib.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90 transition-opacity duration-300"
                >
                  <img
                    src={scholib.logo.secure_url}
                    alt={scholib.name}
                    className="h-12 w-12 object-contain rounded-lg shadow-lg"
                  />
                </a>
                <div>
                  <h3 className="text-lg font-semibold text-white capitalize">
                    {scholib.name}
                  </h3>
                  <p className="text-sm text-blue-200">{scholib.email}</p>
                </div>
              </div>

              <div className="flex items-center ">
                <div className="flex space-x-3">
                  <SocialIcon href={scholib.facebook} icon={faFacebook} />
                  <SocialIcon href={scholib.instagram} icon={faInstagram} />
                  <SocialIcon href={scholib.linkedin} icon={faLinkedin} />
                  <SocialIcon href={scholib.youtube} icon={faYoutube} />
                </div>
                <a
                  href="https://scholib.com"
                  className="px-6 text-center py-2.5 min-w-[300px] bg-white text-blue-900 rounded-lg hover:bg-gray-700 transition-colors duration-300 text-sm font-semibold shadow-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Scholib
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="py-6 text-center border-t border-blue-700">
          <p className="text-sm text-blue-200">
            © {new Date().getFullYear()} Scholib Tech Pvt. Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
