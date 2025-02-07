import React, { useState } from "react";
import "./extraTools.scss";
import { useSelector } from "react-redux";
import StaffProfileBig from "./StaffProfileBig";
import noimage from "../../../images/user.png";

const ExtraTools = () => {
  const staffs2 = useSelector((state) => state.Home.staffs2);
  
  const [currentMember, setCurrentMember] = useState(null);

  if (currentMember) {
    document.body.classList.add("dshauda-hidden");
  } else if (!currentMember) {
    document.body.classList.remove("dshauda-hidden");
  }

  return (
    <div className="removed-members">
      {currentMember && (
        <StaffProfileBig
          id={currentMember._id}
          closeFunction={() => setCurrentMember(null)}
          removed={true}
        />
      )}

      {staffs2.length < 1 && (
        <>
          <hr />
          <p className="h6 w500 text-center text-secondary py-2">
            {" "}
            No Removed Members Available{" "}
          </p>
          <hr />
        </>
      )}

      {staffs2.map((staff) => {
        return (
          <div className="ee" style={{ cursor: "pointer" }} key={staff._id}>
            <div
              className="myboxelem flex4"
              onClick={() => setCurrentMember(staff)}
            >
              <div className="each left">
                <div className="image">
                  {staff.pPhoto && <img src={staff.pPhoto.secure_url} alt="" />}
                  {!staff.pPhoto && <img src={noimage} alt="" />}
                </div>

                <div className="data">
                  <p className="h6 f2 w600"> {staff.name} </p>
                  <p className="h6" style={{ color: "#4069E5" }}>
                    {staff.role}
                  </p>
                  <p className="h7 f2 special"> {staff.title} </p>
                  <p className="h7 f2 w600 versatile">
                    {" "}
                    Removed :{" "}
                    <span className="h7 w400">
                      {" "}
                      {staff.removedOn.substring(0, 10)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="each right">
                <div className="intt">
                  <p className="h6 f2 w600">
                    {" "}
                    Qualification :{" "}
                    <span className="h6 w400"> {staff.qualification} </span>
                  </p>
                </div>
                <div className="intt">
                  <p className="h6 f2 w600">
                    {" "}
                    Removed On :{" "}
                    <span className="h6 w400">
                      {" "}
                      {staff.removedOn.substring(0, 10)}{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExtraTools;
