import React, { useEffect, useState } from "react";
import "./account.scss";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Dropdown from "../basicComponents/Dropdown";
import DataTable from "../layout/Table";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import { busPriceCalculator } from "../../tools/feeTools";

const Account = () => {
  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;
  const dispatch = useDispatch();
  const date = useSelector((state) => state.Other.date);

  const courses = useSelector((state) => state.Course.course.payload.course);

  const studentsInfo = useSelector((state) => state.Students.students.payload);

  const [currentClass, setCurrentClass] = useState(
    courses.length > 0 ? courses[0] : null
  );

  function getAllSectionIds() {
    if (currentClass === null) {
      return [];
    }

    let sectionIds = [];

    currentClass.groups.forEach((group) => {
      group.sections.forEach((section) => {
        sectionIds.push(section);
      });
    });

    return sectionIds;
  }

  const [allSections, setAllSections] = useState(
    getAllSectionIds(
      courses.find((crc) => {
        return crc._id === currentClass;
      })
    )
  );

  const [currentSection, setCurrentSection] = useState(allSections[0]);

  useEffect(() => {
    setAllSections(getAllSectionIds());
  }, [currentClass]);

  useEffect(() => {
    setCurrentSection(allSections[0]);
  }, [allSections]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/account/${currentSection._id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          let data = response.data.data;

          setStudents(
            data.map((each, index) => {
              let student = each.session[0];
              return {
                SN: index + 1,
                Name: each.name,
                Paid: student.paymentHistory.reduce(
                  (acc, hist) => acc + hist.amount,
                  0
                ),
                UnPaid: findAmountLeft(student),
                Bus: busPriceCalculator(
                  date,
                  student.bus,
                  school.busFee,
                  "2081-01-01"
                ),
                Fine: student.fine.reduce((acc, fine) => acc + fine.amount, 0),
                Discount: student.discount.reduce(
                  (acc, discount) => acc + discount.amount,
                  0
                ),
              };
            })
          );
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data.data));
        }
      })
      .catch((error) => {
        setLoading(false);
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
      });
  }, [currentSection]);

  function findTotalFee(studentMainData) {
    let totalAmt = 0;
    let cCourse22 = currentClass;

    totalAmt = totalAmt + studentMainData.previousLeft;

    cCourse22.fees.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    studentMainData.fine.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    studentMainData.discount.forEach((elem) => {
      totalAmt = totalAmt - elem.amount;
    });

    return (
      totalAmt +
      busPriceCalculator(date, studentMainData.bus, school.busFee, "2081-01-01")
    );
  }

  function findClassFee() {
    let totalAmt = 0;
    let cCourse22 = currentClass;

    cCourse22.fees.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    return totalAmt;
  }

  function findAmountLeft(studentMainData) {
    return (
      findTotalFee(studentMainData) -
      studentMainData.paymentHistory.reduce((acc, hist) => acc + hist.amount, 0)
    );
  }

  return (
    <div className="accountAdmin2838">
      <MetaData
        title={`${user && user.role ? "Staff" : "Student"} || Account`}
      />

      <div className="inside-content">
        <div className="veryTop">
          <p className="h4 text-center" style={{ color: "#133189" }}>
            Account
          </p>
          <p className="h6 text-center"> {school.name} </p>
        </div>

        <div className="bar-control flex1 my-3">
          <div className="ind-bar flex1">
            {" "}
            <p className="h6 w500 me-2"> Class : </p>{" "}
            <Dropdown
              title={currentClass && currentClass.class}
              options={courses.map((ind) => {
                return {
                  label: ind.class,
                  value: ind._id,
                };
              })}
              onSelect={(a, b, c) => {
                setCurrentClass(
                  courses.find((ind) => {
                    return ind._id === c;
                  })
                );
              }}
            />{" "}
          </div>
          <div className="ind-bar flex1">
            {" "}
            <p className="h6 w500 me-2"> Section : </p>{" "}
            <Dropdown
              options={allSections.map((sec) => {
                return {
                  label: sec.name,
                  value: sec._id,
                };
              })}
              onSelect={(a, b, c) => {
                setCurrentSection(
                  allSections.find((ind) => {
                    return ind._id === c;
                  })
                );
              }}
              title={currentSection && currentSection.name}
            />{" "}
          </div>
        </div>

        <section className="shadow1 mx-2 rounded-md">
          {loading && (
            <div
              className="spinner-container flex1"
              style={{ width: "100%", height: "80px" }}
            >
              <div
                className="spinner-border text-primary my-4 loading452"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>{" "}
            </div>
          )}

          <div className="custom-scrollbar overflow-auto max-w-[100%]">
            <DataTable
              data={students}
              exclude={["_id"]}
              fields={[
                "SN",
                "Name",
                "Paid",
                "Unpaid",
                "Bus",
                "Fine",
                "Discount",
              ]}
              noSelect={true}
              selectedOnes={() => {}}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Account;
