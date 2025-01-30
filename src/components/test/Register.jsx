import React, { useRef, useState } from "react";
import "./register.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCircleExclamation,
  faClock,
  faCoins,
  faEnvelope,
  faLocationDot,
  faMoneyBill,
  faPen,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../basicComponents/Dropdown";

const Register = () => {
  //starting of register component
  const array = [
    { roll: 1, fullName: "John Doe" },
    { roll: 2, fullName: "Emily Johnson" },
    { roll: 3, fullName: "Daniel Smith" },
    { roll: 4, fullName: "Sophia Brown" },
    { roll: 5, fullName: "Michael Davis" },
    { roll: 6, fullName: "Olivia Wilson" },
    { roll: 7, fullName: "Christopher Lee" },
    { roll: 8, fullName: "Ava Miller" },
    { roll: 9, fullName: "Matthew Martinez" },
    { roll: 10, fullName: "Emma Taylor" },
    { roll: 11, fullName: "Andrew Anderson" },
    { roll: 12, fullName: "Grace Thomas" },
    { roll: 13, fullName: "William White" },
    { roll: 14, fullName: "Madison Harris" },
    { roll: 15, fullName: "Ethan Robinson" },
    { roll: 16, fullName: "Chloe Hall" },
    { roll: 17, fullName: "Benjamin Wright" },
    { roll: 18, fullName: "Avery Turner" },
    { roll: 19, fullName: "Liam Baker" },
    { roll: 20, fullName: "Nora Garcia" },
  ];
  const [selected, setSelected] = useState([]);

  function handleSubmit() {
    console.log(selected);
  }

  function handleSelected(index) {
    setSelected((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((item) => item !== index);
      } else {
        return [...prevSelected, index];
      }
    });
  }

  //starting of image select component
  const [image, setImage] = useState();
  const imageRef = useRef(null);

  function handleImageSelected() {
    let myImage = imageRef.current.files[0];
    setImage(URL.createObjectURL(myImage));
  }

  //starting of my create-result component
  const studentsDataArray = [
    { roll: 1, name: "John Doe", marks: 85 },
    { roll: 2, name: "Alice Smith", marks: 92 },
    { roll: 3, name: "Bob Johnson", marks: 78 },
    { roll: 4, name: "Eva Brown", marks: 95 },
  ];
  const [studentsData, setStudentData] = useState(studentsDataArray);
  const handleMarksChange = (index, newValue) => {
    const updatedStudentsData = [...studentsData];
    updatedStudentsData[index].marks = newValue;
    setStudentData(updatedStudentsData);
  };

  // This one is for our great select components
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const handleSelect = (option) => {
    alert(" I am from " + option);
  };

  return (
    <div className="registerComp26326">
      {/* jotko navbar */}
      <div className="navbar flex1">
        <div className="inside d-flex">
          <p className="h6 w600 px-3"> Travelib.</p>
          <p className="h7 w600 mx-3 hda"> Login / signup </p>
        </div>
      </div>

      {/* for the student attendance component  */}
      <div className="regParent">
        <div className="right">
          <div className="parent">
            <div className="each">
              <div className="box" style={{ backgroundColor: "#00BDD6" }}></div>
              <div className="p-cont">
                <p className="h6"> Present </p>
              </div>
            </div>{" "}
          </div>

          <div className="parent">
            <div className="each">
              <div className="box" style={{ backgroundColor: "#E05858" }}></div>
              <div className="p-cont">
                <p className="h6"> Absent </p>
              </div>
            </div>{" "}
          </div>
        </div>

        <div className="content flex4">
          {array.map((each, index) => {
            const isSelected = selected.includes(index);
            const backgroundColor = isSelected ? "#E05858" : "#00BDD6";

            return (
              <div
                className="each flex1"
                title={each.fullName}
                style={{ backgroundColor }}
                onClick={() => handleSelected(index)}
              >
                <p className="d-block">{each.roll}</p>
              </div>
            );
          })}
        </div>

        <div className="buttonsP" style={{ marginTop: "20px" }}>
          <button
            onClick={() => handleSubmit()}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Update
          </button>
        </div>
      </div>

      <br />
      <br />
      {/* for the image input component  */}
      <div className="selectImage">
        <p className="h6 w500"> Profile Picture </p>
        {!image && (
          <img
            src="https://cdn.pixabay.com/photo/2012/11/28/11/28/rocket-launch-67723_640.jpg"
            alt=""
            onClick={() => imageRef.current.click()}
          />
        )}

        {image && (
          <img src={image} alt="" onClick={() => imageRef.current.click()} />
        )}

        <input
          ref={imageRef}
          type="file"
          name="image"
          id=""
          accept="image/*"
          onChange={handleImageSelected}
          className="d-none"
        />

        <button
          className="btn btn-secondary"
          onClick={() => imageRef.current.click()}
        >
          {" "}
          <FontAwesomeIcon
            style={{ marginRight: "6px", fontSize: "13px" }}
            icon={faPen}
          />{" "}
          {image ? "Change Image" : "Select Image"}{" "}
        </button>
      </div>

      {/* for that legendary regisnation component */}
      <div className="resign-box">
        <div className="confirm">
          <p className="h6 w500"> Confirm Regisnation </p>
        </div>

        <div className="image">
          <img
            src="https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg"
            alt=""
          />
        </div>

        <div className="info">
          <p className="h6 w600" style={{ fontSize: "19px" }}>
            {" "}
            Ujjwal Sapkota{" "}
          </p>
          <p className="h7 text-secondary"> CEO / FOUNDER </p>

          <div className="more-info custom-scrollbar">
            <div className="each">#</div>
            <div className="each">Founder</div>
            <div className="each">CEO</div>
            <div className="each">#</div>
          </div>

          <div className="surity">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              style={{ fontSize: "40px", color: "red" }}
            />
            <p className="h5 w600 text-dark mt-3" style={{ fontSize: "17px" }}>
              {" "}
              Confirm Resignation
            </p>

            <p className="h6 w400 px-2" style={{ marginTop: "13px" }}>
              If you resine you will no longer have access to Travelib account
              unless an until Travelib adminstration back again provide you
              access with it. This is only recommended when you had made the
              final decision to quit and is sure about it.
            </p>
          </div>

          <div className="message">
            <p className="h6 w600 text-secondary"> Message :</p>
            <textarea
              type="text"
              name=""
              id=""
              placeholder="Enter Your Message"
            />
          </div>

          <hr />

          <div className="buttons mt-4">
            <button
              className="btn btn-secondary mx-2 px-4"
              style={{ width: "41%", fontSize: "14px" }}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger mx-2 px-4"
              style={{ width: "41%", fontSize: "14px" }}
            >
              confirm
            </button>
          </div>
        </div>
      </div>

      {/* for that admission inquiry box */}
      <div className="admission-inquiry flex3">
        <div className="each left flex1">
          <img
            src="https://cdn.pixabay.com/photo/2017/11/06/13/45/cap-2923682_640.jpg"
            alt=""
          />
          <div className="info d-inline-block ms-4">
            <p className="h6 w600 mb-2"> Ujjwal Sapkota </p>
            <p className="h7"> Class: 11 </p>
            <p className="h7"> Science (Physical) </p>
            <p className="h6 w600 mt-2"> GPA : 3.4 </p>
          </div>
        </div>

        <div className="each right flex1">
          <div className="info">
            <p className="h6"> Ujjwal Sapkota </p>
            <p className="h6"> 9806014021 </p>
            <p className="h6"> bisiness.ujjwal@gmail.com </p>
          </div>
        </div>
      </div>

      {/* for that legendary staff profile card */}
      <div className="profile-container my-5">
        <div className="user-profile-8237">
          <div className="top d-flex">
            <div className="left">
              <img
                src="https://cdn.pixabay.com/photo/2020/03/11/10/08/camera-4921646_640.jpg"
                alt=""
              />
            </div>
            <div className="right">
              <p className="h6">Ujjwal Sapkota</p>
              <p className="h7 text-secondary">Accountant</p>
            </div>
          </div>

          <div className="bottom">
            <div className="each d-flex">
              <FontAwesomeIcon icon={faPhone} />
              <p className="h6" style={{ marginLeft: "12px" }}>
                {" "}
                9806014021{" "}
              </p>
            </div>

            <div className="each d-flex">
              <FontAwesomeIcon icon={faEnvelope} />
              <p className="h6" style={{ marginLeft: "12px" }}>
                {" "}
                sumanjhah39@gmail.com{" "}
              </p>
            </div>

            <div className="each d-flex">
              <FontAwesomeIcon icon={faLocationDot} />
              <p className="h6" style={{ marginLeft: "12px" }}>
                {" "}
                Buddhashanti -2 Budhabare Jhapa{" "}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* for that legendary create result component */}
      <div className="create-result-main-parent">
        <div
          className="create-result-parent27327 custom-scrollbar"
          style={{ overflow: "auto", paddingBottom: "4px" }}
        >
          <div className="create-result327 flex1">
            <div className="vertical">
              <div className="each top"> Roll No </div>
              {studentsData.map((obj, index) => (
                <div key={index} className="each">
                  {obj.roll}
                </div>
              ))}
            </div>

            <div className="vertical">
              <div className="each top"> Student Name </div>
              {studentsData.map((obj, index) => (
                <div key={index} className="each">
                  {obj.name}
                </div>
              ))}
            </div>

            <div className="vertical">
              <div className="each top"> Obtained Marks </div>
              {studentsData.map((obj, index) => (
                <div key={index} className="each">
                  <input
                    type="text"
                    name={`marks-${index}`}
                    id={`marks-${index}`}
                    value={obj.marks}
                    onChange={(e) => handleMarksChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="inputsBelow">
          <div className="each">
            <div className="inside">
              <p className="h6"> Full Marks </p>
              <input type="text" name="" id="" />
            </div>
          </div>
          <div className="each">
            <div className="inside">
              <p className="h6"> Pass Marks </p>
              <input type="text" name="" id="" />
            </div>
          </div>
        </div>
      </div>

      {/* for that legendary confirm payment component */}
      <div className="confirm-payment">
        <p className="h5 w600 text-center" style={{ marginBottom: "25px" }}>
          {" "}
          Confirm Payment{" "}
        </p>
        <div className="box">
          <div className="each flex4 my-2">
            <div className="left d-flex">
              <FontAwesomeIcon
                icon={faCalendarDays}
                style={{ color: "#00BCD7" }}
              />
              <p className="h6 text-secondary ms-2"> Date </p>
            </div>

            <div className="right d-flex">
              <p className="h6 text-seconadry"> 2079/10/12 </p>
            </div>
          </div>

          <div className="each flex4 my-2">
            <div className="left d-flex">
              <FontAwesomeIcon
                icon={faMoneyBill}
                style={{ color: "#00BCD7" }}
              />
              <p className="h6 text-secondary ms-2"> Payment Method </p>
            </div>

            <div className="right d-flex">
              <p className="h6 text-seconadry"> Cash </p>
            </div>
          </div>

          <hr />

          <div className="each flex4 my-2">
            <div className="left d-flex">
              <FontAwesomeIcon icon={faCoins} style={{ color: "#00BCD7" }} />
              <p className="h6 text-secondary ms-2"> Amount (Rs.) </p>
            </div>

            <div className="right d-flex">
              <p className="h6 text-seconadry"> 30000 </p>
            </div>
          </div>

          <p className="h6 my-4 w600 mb-2"> Student </p>
          <hr />

          <div className="admission-inquiry352 flex3">
            <div className="each left flex1">
              <img
                src="https://cdn.pixabay.com/photo/2017/11/06/13/45/cap-2923682_640.jpg"
                alt=""
              />
              <div className="info d-inline-block ms-4">
                <p className="h6 w600 mb-2"> Ujjwal Sapkota </p>
                <p className="h7"> Class: 11 </p>
                <p className="h7"> Science (Physical) </p>
                <p className="h6 w600 mt-2"> GPA : 3.4 </p>
              </div>
            </div>

            <div className="each right">
              <div className="info">
                <p className="h5 w600"> Amount Left : </p>
                <p className="h5 text-danger ms-3"> 30000 Rs </p>
              </div>
            </div>
          </div>

          <div className="each flex4 my-2">
            <div className="left d-flex">
              <FontAwesomeIcon icon={faUser} style={{ color: "#00BCD7" }} />
              <p className="h6 text-secondary ms-2"> Initiated By </p>
            </div>

            <div className="right d-flex">
              <p className="h6 text-seconadry"> Balkrishna Sapkota </p>
            </div>
          </div>

          <div className="each flex4 my-2">
            <div className="left d-flex">
              <FontAwesomeIcon icon={faClock} style={{ color: "#00BCD7" }} />
              <p className="h6 text-secondary ms-2"> Time </p>
            </div>

            <div className="right d-flex">
              <p className="h6 text-seconadry"> 09:02 AM </p>
            </div>
          </div>

          <hr style={{ marginTop: "20px" }} />

          <div className="buttons flex4" style={{ marginTop: "20px" }}>
            <button
              className="btn btn-secondary"
              style={{ width: "48%", fontSize: "14px" }}
            >
              {" "}
              Cancel{" "}
            </button>
            <button
              className="btn btn-primary"
              style={{ width: "48%", fontSize: "14px" }}
            >
              {" "}
              Confirm Payment{" "}
            </button>
          </div>
        </div>
      </div>

      {/* for that legendary navbar for our tools page of admin dashboard  */}
      <div className="admin-navbar-pro custom-scrollbar">
        <div className="elementsInside flex1">
          <div className="each-div active">
            <p>Analytics Overview</p>
          </div>

          <div className="each-div">
            <p>Fee Structure</p>
          </div>

          <div className="each-div">
            <p>Salary Table</p>
          </div>

          <div className="each-div">
            <p>Daily Activity</p>
          </div>

          <div className="each-div">
            <p>Removed Members</p>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      {/* for that Analytics overview header page let's go  */}
      <section className="analytics279">
        <div className="content-analytics flex4">
          {/* left side div  */}
          <div className="first each flex3">
            <div className="final">
              <p className="h6 w600"> Total Sales (Yearly) </p>

              <div className="flex1" style={{ backgroundColor: "#EAFCFF" }}>
                <p className="h5"> Nrs. 50,000 </p>
              </div>
            </div>

            <div className="final">
              <p className="h6 w600"> Funds Available </p>

              <div className="flex1" style={{ backgroundColor: "#EFFDF2" }}>
                <p className="h5"> Nrs. 50,000 </p>
              </div>
            </div>

            <div className="final">
              <p className="h6 w600"> Online Transaction </p>

              <div className="flex1" style={{ backgroundColor: "#F4F3FD" }}>
                <p className="h5"> Nrs. 50,000 </p>
              </div>
            </div>

            <div className="final">
              <p className="h6 w600"> Offline Transaction </p>

              <div className="flex1" style={{ backgroundColor: "#F3F5F7" }}>
                <p className="h5"> Nrs. 50,000 </p>
              </div>
            </div>
          </div>

          {/* right side div */}
          <div className="second each flex3">
            <div className="chart final"></div>

            <div
              className="more final flex1"
              style={{ flexDirection: "column" }}
            >
              <div className="flex1" style={{ backgroundColor: "#F4F3FD" }}>
                <p className="h7">Total Students</p>
                <p className="h5"> 450 </p>
              </div>

              <div className="flex1" style={{ backgroundColor: "#F8E0E1" }}>
                <p className="h7">Total Staffs</p>
                <p className="h5"> 32 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-5" style={{ color: "#fff" }} />

      {/* for that legendary form component */}
      <div className="our-form3636">
        <p className="h5 w600 text-center"> Registration Form </p>
        <div className="form-content6">
          <div className="each width2">
            <p> School Name </p>
            <input type="text" name="" id="" placeholder="John" />
          </div>

          <div className="each width1">
            <p> Short Name </p>
            <input type="text" name="" id="" placeholder="John" />
          </div>

          <div className="each width1">
            <p> Students Taught </p>
            <input type="text" name="" id="" placeholder="John" />
          </div>

          <div className="each width2">
            <p> Address </p>
            <input type="text" name="" id="" placeholder="John" />
          </div>

          <div className="each width2">
            <p> Detailed Address </p>
            <input type="text" name="" id="" placeholder="John" />
          </div>

          <div className="each width4">
            <p> Description </p>
            <textarea name="" id="" cols="30" rows="10"></textarea>
          </div>

          <div className="each width2">
            <p> Gender </p>

            <div
              className="d-flex gender-div"
              style={{ marginTop: "8px", marginLeft: "3px" }}
            >
              <label
                className="d-flex"
                style={{ margin: "0px 5px 0px 0px", cursor: "pointer" }}
              >
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked
                />
                <p
                  className="h6 w600"
                  style={{ marginLeft: "5px", marginBottom: "0px" }}
                >
                  Male
                </p>
              </label>

              <label
                className="d-flex"
                style={{ margin: "0px 10px", cursor: "pointer" }}
              >
                <input type="radio" id="female" name="gender" value="female" />
                <p
                  className="h6 w600"
                  style={{ marginLeft: "5px", marginBottom: "0px" }}
                >
                  Female
                </p>
              </label>

              <label
                className="d-flex"
                style={{ margin: "0px 10px", cursor: "pointer" }}
              >
                <input type="radio" id="other" name="gender" value="other" />
                <p
                  className="h6 w600"
                  style={{ marginLeft: "5px", marginBottom: "0px" }}
                >
                  Others
                </p>
              </label>
            </div>
          </div>

          <div className="each width1">
            <p> Estd </p>
            <div className="wobbler" style={{ padding: "0px 3px" }}>
              <Dropdown
                options={options}
                title={`Select One`}
                onSelect={handleSelect}
              />
            </div>
          </div>

          <div className="each width2">
            <p> Facilities Available </p>

            <div className="checkbox-div">
              <ul>
                <li>
                  <input type="checkbox" id="option1" />
                  <label htmlFor="option1">Bus</label>
                </li>
                <li>
                  <input type="checkbox" id="option2" />
                  <label htmlFor="option2">Canteen</label>
                </li>
                <li>
                  <input type="checkbox" id="option3" />
                  <label htmlFor="option3">Hostel</label>
                </li>
                <li>
                  <input type="checkbox" id="option3" />
                  <label htmlFor="option3">Lab</label>
                </li>
                <li>
                  <input type="checkbox" id="option3" />
                  <label htmlFor="option3">Medical</label>
                </li>
                <li>
                  <input type="checkbox" id="option3" />
                  <label htmlFor="option3">Playground</label>
                </li>
              </ul>
            </div>
          </div>

          <div className="each width4">
            <hr style={{ color: "grey" }} />
          </div>

          <div className="each width1">
            <div className="selectImage">
              <p className="h6 w500"> Profile Picture </p>
              {!image && (
                <img
                  src="https://cdn.pixabay.com/photo/2012/11/28/11/28/rocket-launch-67723_640.jpg"
                  alt=""
                  onClick={() => imageRef.current.click()}
                />
              )}

              {image && (
                <img
                  src={image}
                  alt=""
                  onClick={() => imageRef.current.click()}
                />
              )}

              <input
                ref={imageRef}
                type="file"
                name="image"
                id=""
                accept="image/*"
                onChange={handleImageSelected}
                className="d-none"
              />

              <button
                className="btn btn-secondary"
                onClick={() => imageRef.current.click()}
              >
                {" "}
                <FontAwesomeIcon
                  style={{ marginRight: "6px", fontSize: "13px" }}
                  icon={faPen}
                />{" "}
                {image ? "Change Image" : "Select Image"}{" "}
              </button>
            </div>
          </div>

          <div className="each width1">
            <div className="selectImage">
              <p className="h6 w500"> Citizenship Image </p>
              {!image && (
                <img
                  src="https://cdn.pixabay.com/photo/2012/11/28/11/28/rocket-launch-67723_640.jpg"
                  alt=""
                  onClick={() => imageRef.current.click()}
                />
              )}

              {image && (
                <img
                  src={image}
                  alt=""
                  onClick={() => imageRef.current.click()}
                />
              )}

              <input
                ref={imageRef}
                type="file"
                name="image"
                id=""
                accept="image/*"
                onChange={handleImageSelected}
                className="d-none"
              />

              <button
                className="btn btn-secondary"
                onClick={() => imageRef.current.click()}
              >
                {" "}
                <FontAwesomeIcon
                  style={{ marginRight: "6px", fontSize: "13px" }}
                  icon={faPen}
                />{" "}
                {image ? "Change Image" : "Select Image"}{" "}
              </button>
            </div>
          </div>

          <div className="each width1">
            <div className="selectImage">
              <p className="h6 w500"> Recommendation Letter </p>
              {!image && (
                <img
                  src="https://cdn.pixabay.com/photo/2012/11/28/11/28/rocket-launch-67723_640.jpg"
                  alt=""
                  onClick={() => imageRef.current.click()}
                />
              )}

              {image && (
                <img
                  src={image}
                  alt=""
                  onClick={() => imageRef.current.click()}
                />
              )}

              <input
                ref={imageRef}
                type="file"
                name="image"
                id=""
                accept="image/*"
                onChange={handleImageSelected}
                className="d-none"
              />

              <button
                className="btn btn-secondary"
                onClick={() => imageRef.current.click()}
              >
                {" "}
                <FontAwesomeIcon
                  style={{ marginRight: "6px", fontSize: "13px" }}
                  icon={faPen}
                />{" "}
                {image ? "Change Image" : "Select Image"}{" "}
              </button>
            </div>
          </div>

          <div className="each width1">
            <div className="selectImage">
              <p className="h6 w500"> Approval Letter </p>
              {!image && (
                <img
                  src="https://cdn.pixabay.com/photo/2012/11/28/11/28/rocket-launch-67723_640.jpg"
                  alt=""
                  onClick={() => imageRef.current.click()}
                />
              )}

              {image && (
                <img
                  src={image}
                  alt=""
                  onClick={() => imageRef.current.click()}
                />
              )}

              <input
                ref={imageRef}
                type="file"
                name="image"
                id=""
                accept="image/*"
                onChange={handleImageSelected}
                className="d-none"
              />

              <button
                className="btn btn-secondary"
                onClick={() => imageRef.current.click()}
              >
                {" "}
                <FontAwesomeIcon
                  style={{ marginRight: "6px", fontSize: "13px" }}
                  icon={faPen}
                />{" "}
                {image ? "Change Image" : "Select Image"}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
