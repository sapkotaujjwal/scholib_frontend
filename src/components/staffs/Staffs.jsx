import React, { useEffect, useState } from "react";
import "./staffs.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
  faPlus,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import CreateNewStaff from "../test/CreateNewStaff";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import StaffProfileBig from "./admin/StaffProfileBig";

import userImg from "../../images/user.png";
import { SET_STAFFS } from "../../redux/OtherInfoSlice";
import StaffTable from "./StaffTable";

const Staffs = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const dispatch = useDispatch();

  const school = useSelector((state) => state.Home.school.payload);
  const user = useSelector((state) => state.User.user.payload);
  const schoolCode = school.schoolCode;

  const [newStaff, setNewStaff] = useState(false);

  function handleAddNewStaff() {
    setNewStaff(!newStaff);
  }

  const [bigStaff, setBigStaff] = useState(null);

  if (newStaff || bigStaff) {
    document.body.classList.add("dshauda-hidden");
  } else if (!newStaff && !bigStaff) {
    document.body.classList.remove("dshauda-hidden");
  }

  const staffs = useSelector((state) => state.Other.staffsDetails);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (staffs) {
      setLoading(false);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/staff/${schoolCode}/staffs`, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);

        if (response.data.success) {
          dispatch(SET_STAFFS(response.data.data));
        } else {
          setError(response.data);
        }
      })
      .catch((error) => {
        setLoading(false);
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };
        setError(data);
      });
  }, [schoolCode]);

  return (
    <div className="staffs3267">
      {newStaff && <CreateNewStaff closeFunction={handleAddNewStaff} />}

      {bigStaff && (
        <StaffProfileBig
          id={bigStaff}
          closeFunction={() => {
            setBigStaff(null);
          }}
        />
      )}

      {staffs && (
        <div className="sInside27">
          <div className="veryTop">
            <div className="flex flex-col p-4 bg-white shadow1 rounded-lg">
              <p className="text-xl font-semibold text-[#133189]">Staffs</p>
              <p className="text-sm text-gray-600">{school.name}</p>
            </div>
          </div>

          <div className="flex1 justify-between wrap px-2">
            <div className="top2stafs d-flex">
              <p className="h5 w600"> STAFFS </p>
              <div className="number flex1"> {staffs.length} </div>
            </div>

            {user &&
              (user.role === "Administrator" ||
                user.role === "Coordinator") && (
                <div className="onlyAdmin " style={{ marginTop: "20px" }}>
                  <button
                    className="w-[200px] md:w-[300px]"
                    onClick={() => handleAddNewStaff()}
                  >
                    {" "}
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ marginRight: "5px" }}
                    />{" "}
                    Add New Staff{" "}
                  </button>
                </div>
              )}
          </div>

          <div className="my-3  px-[2%]">
            <StaffTable
              loading={loading}
              error={error}
              staffs={staffs}
              setBigStaff={setBigStaff}
              userImg={userImg}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Staffs;
