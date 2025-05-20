import React, { useEffect, useState } from "react";
import "./profile.scss";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faLocationDot,
  faPen,
  faPhone,
  faUser,
  faCalendarAlt,
  faVenusMars,
  faSchool,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import userImg from "../../images/user.png";
import CreateNewStaff from "../test/CreateNewStaff";

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2 border-b last:border-none">
    <FontAwesomeIcon icon={icon} className="text-gray-500 mt-1" />
    <div>
      <small className="text-gray-500">{label}</small>
      <p className="text-sm text-gray-800 font-medium">{value || "N/A"}</p>
    </div>
  </div>
);

const Profile = () => {
  const user = useSelector((state) => state.User.user.payload);
  const [admin, setAdmin] = useState(user || null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (user) setAdmin(user);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle("dshauda-hidden", edit);
  }, [edit]);

  if (!admin) return null;

  return (
    <>
      <MetaData title={`${admin.role || "User"} || Profile`} />
      {edit && (
        <CreateNewStaff
          data={{ ...admin }}
          closeFunction={() => setEdit(false)}
          title={"Update Your Profile"}
          selfUpdate
        />
      )}

      <div className="bg-gray-50 min-h-screen py-5 px-1 md:px-10">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <img
                src={admin.pPhoto?.secure_url || userImg}
                alt={admin.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {admin.name}
                </h2>
                <p className="text-sm text-gray-500 mb-0 w500">
                  {admin.title || "—"}
                </p>
                <span className="inline-block mt-1 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {admin.role || "User"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setEdit(true)}
              className="hidden  md:flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <FontAwesomeIcon icon={faPen} />
              Edit Profile
            </button>


          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">


<div className="flex1 justify-end">

                          <button
              onClick={() => setEdit(true)}
              className="flex1  md:hidden items-center gap-2 w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <FontAwesomeIcon icon={faPen} />
              Edit Profile
            </button>
</div>


              {/* About */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  About
                </h3>
                <p className="text-gray-600 text-sm">
                  {admin.about || "No description available."}
                </p>
              </div>

              {/* Personal Details */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Personal Details
                </h3>
                <InfoRow icon={faUser} label="Full Name" value={admin.name} />
                <InfoRow
                  icon={faVenusMars}
                  label="Gender"
                  value={admin.gender}
                />
                <InfoRow
                  icon={faCalendarAlt}
                  label="Date of Birth (BS)"
                  value={admin.dob}
                />
                <InfoRow icon={faIdCard} label="Title" value={admin.title} />
              </div>

              {/* Contact Info */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Contact Information
                </h3>
                <InfoRow icon={faEnvelope} label="Email" value={admin.email} />
                <InfoRow icon={faPhone} label="Phone" value={admin.phone} />
                <InfoRow
                  icon={faLocationDot}
                  label="Address"
                  value={admin.address}
                />
                <InfoRow
                  icon={faGraduationCap}
                  label="Qualification"
                  value={admin.qualification}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  System Information
                </h3>
                <InfoRow
                  icon={faSchool}
                  label="School Code"
                  value={admin.schoolCode}
                />
                <InfoRow
                  icon={faIdCard}
                  label="Login ID"
                  value={admin.loginId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
