import React, { useEffect, useState } from "react";
import "./fees.scss";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import Table from "../layout/Table";
import BusStatus from "../staffs/BusStatus";
import FeeInfo from "../staffs/FeeInfo";

const Fees = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const user = useSelector((state) => state.User.user.payload);
  const studentData = useSelector(
    (state) => state.StudentData.studentData.payload
  );

  const courses = useSelector((state) => state.Course.courseAll.payload.course);
  const courseId = studentData.student.session[0].courseId;

  let StudentCourseInfo = studentData.course;

  const fees = courses.find((crc) => crc._id == courseId).fees;

  const school = useSelector((state) => state.Home.school.payload);
  const course = useSelector((state) => state.Course.course.payload.course);

  function busPriceCalculator(
    date = "2080-02-01",
    dataArray,
    priceArray,
    date2 = "2080-01-01"
  ) {
    const getDaysDifference = (date2, date1) => {
      const oneDay = 24 * 60 * 60 * 1000;

      const firstDate = new Date(date1);
      const secondDate = new Date(date2);

      firstDate.setHours(0, 0, 0, 0);
      secondDate.setHours(0, 0, 0, 0);

      const timeDifference = firstDate.getTime() - secondDate.getTime();
      const daysDifference = Math.round(timeDifference / oneDay);

      return daysDifference;
    };

    let totalPrice = 0;

    dataArray.forEach((dataItem) => {
      const { place, start, end } = dataItem;
      const priceItem = priceArray.find((item) => item._id === place);

      if (priceItem) {
        const { amounts } = priceItem;
        let startDate = new Date(start);

        if (getDaysDifference(startDate, date2) > 0) {
          startDate = date2;
        }

        let endDate = end ? new Date(end) : new Date(date);

        amounts.forEach((each) => {
          let daysdif = getDaysDifference(each.date, endDate);

          if (daysdif > 0) {
            let interval = getDaysDifference(each.date, endDate);
            let interval2 = getDaysDifference(each.date, startDate);

            if (interval2 > 0) {
              interval = interval - interval2;
            }

            totalPrice += (each.amount / 30) * (interval + 1);
          }
        });
      }
    });

    return Math.ceil(totalPrice);
  }

  const feeStructure = fees.map((crc) => {
    return {
      category: crc.title,
      amount: crc.amount,
      frequency: "Per Year",
    };
  });

  function findTotalFee() {
    let totalAmt = 0;
    let cCourse22 = course.find((crc) => crc._id === StudentCourseInfo.class);

    totalAmt = totalAmt + studentData.student.session[0].previousLeft;

    cCourse22.fees.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    studentData.student.session[0].fine.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    studentData.student.session[0].discount.forEach((elem) => {
      totalAmt = totalAmt - elem.amount;
    });

    return (
      totalAmt +
      busPriceCalculator(
        "2081-02-10",
        studentData.student.session[0].bus,
        school.busFee,
        "2080-01-01"
      )
    );
  }

  const [busStatus, setBusStatus] = useState(false);
  const [feeInfo, setFeeInfo] = useState(false);

  if (busStatus || feeInfo) {
    document.body.classList.add("dshauda-hidden");
  } else if (!busStatus && !feeInfo) {
    document.body.classList.remove("dshauda-hidden");
  }

  return (
    <>
    <div className="applyBootstrap">


      {busStatus && (
        <div className="full">
          <BusStatus
            StudentCourseInfo={StudentCourseInfo}
            data={studentData.student.session.find(
              (ses) => ses.courseId === StudentCourseInfo.class
            )}
            closeFunction={() => setBusStatus(false)}
          />
        </div>
      )}

      {feeInfo && (
        <div className="full">
          <FeeInfo
            StudentCourseInfo={StudentCourseInfo}
            data={studentData.student.session.find(
              (ses) => ses.courseId === StudentCourseInfo.class
            )}
            totalFee={findTotalFee()}
            feePaid={studentData.student.session
              .find((ses) => ses.courseId === StudentCourseInfo.class)
              .paymentHistory.reduce((acc, hist) => acc + hist.amount, 0)}
            closeFunction={() => setFeeInfo(false)}
          />
        </div>
      )}

      {!busStatus && !feeInfo && (
        <div className="feesComponent325375 flex2">
          <MetaData
            title={`${user && user.role ? "Staff" : "Student"} || Fees`}
          />
          <div className="mainyy">
            <section className="fees">
              <div
                className="buttons flex1 mb-6 bg-gray-200 py-3 px-4 rounded-lg"
                style={{ justifyContent: "flex-end" }}
              >
                <button
                  onClick={() => setFeeInfo(true)}
                  className="btn btn-secondary"
                  style={{
                    marginLeft: "10px",
                    fontSize: "14px",
                    width: "130px",
                  }}
                >
                  {" "}
                  View Bill{" "}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setBusStatus(true)}
                  style={{
                    marginLeft: "10px",
                    fontSize: "14px",
                    width: "130px",
                  }}
                >
                  {" "}
                  Bus Fees{" "}
                </button>
              </div>

              <section className="account">
                <section className="paymentDetails">
                  <p className="h5 w600 post-text-center f2">Payment History</p>

                  <div className="payment-history custom-scrollbar shadow1">
                    {/* <Table data={paymentDetails} /> */}

                    <Table
                      data={studentData.student.session
                        .find((ses) => ses.courseId === StudentCourseInfo.class)
                        .paymentHistory.map((ind) => {
                          return {
                            amount: ind.amount,
                            date: ind.date.split("T")[0],
                            time: ind.time,
                            method: ind.method,
                          };
                        })}
                      fields={["Amount (Rs.)", "Date", "Time", "Method"]}
                      exclude={["_id"]}
                    />
                  </div>

                  <div className="payment-info flex2">
                    <div className="paid">
                      <p className="h6 w600 text-secondary">
                        AMOUNT PAID :
                        <span className="w500 text-black ms-2">
                          {" "}
                          Rs.{" "}
                          {studentData.student.session
                            .find(
                              (ses) => ses.courseId === StudentCourseInfo.class
                            )
                            .paymentHistory.reduce(
                              (acc, hist) => acc + hist.amount,
                              0
                            )}{" "}
                        </span>
                      </p>
                    </div>
                    <div className="left">
                      <p className="h6 w600 text-danger">
                        AMOUNT LEFT :
                        <span className="w500 text-black ms-2">
                          {" "}
                          Rs.{" "}
                          {findTotalFee() -
                            studentData.student.session
                              .find(
                                (ses) =>
                                  ses.courseId === StudentCourseInfo.class
                              )
                              .paymentHistory.reduce(
                                (acc, hist) => acc + hist.amount,
                                0
                              )}{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                </section>

                <section className="paymentDetails">
                  <p
                    className="h5 post-text-center w600 f2"
                    style={{ marginTop: "40px" }}
                  >
                    Fee Structure (Yearly)
                  </p>

                  <div className="payment-history custom-scrollbar">
                    <Table data={feeStructure} />
                  </div>
                </section>
              </section>
            </section>
          </div>
        </div>
      )}
          </div>
    </>
  );
};

export default Fees;
