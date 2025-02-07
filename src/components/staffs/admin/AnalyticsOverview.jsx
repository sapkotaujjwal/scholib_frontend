import { faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./analyticsOverview.scss";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import { GET_ACCOUNTS } from "../../../redux/HomeSlice";
import Graph from "../../basicComponents/Graph";
import { parseDate } from "../../../tools/dateTool";

import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

const AnalyticsOverview = () => {
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // }, []);

  const dispatch = useDispatch();
  const date = useSelector((state) => state.Other.date);
  const accounts = useSelector((state) => state.Home.accounts);

  function formatDateToString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  function convertTo12Hour(time) {
    let [hours, minutes, seconds] = time.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  const school = useSelector((state) => state.Home.school.payload);
  const students = useSelector((state) => state.Students.students.payload);

  useEffect(() => {
    if (accounts.length === 0) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/accounts/info`,
          {
            params: {},
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.success) {
            const paymentData = response.data.data.paymentHistory.map(
              (ind, index) => {
                return {
                  sn: index + 1,
                  date: formatDateToString(ind.date), // in year/month/day format
                  amount: ind.amount,
                  approvedBy: school.staffs.find(
                    (sta) => sta._id === ind.approvedBy
                  ).name,
                  method: ind.method,
                  time: convertTo12Hour(ind.time),
                  student:
                    students.find((sta) => sta._id === ind.student)?.name ||
                    "N/A",
                };
              }
            );

            dispatch(GET_ACCOUNTS(paymentData));
          } else {
            dispatch(SET_ALERT_GLOBAL(response.data));
          }
        })
        .catch((error) => {
          console.log(error);
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
    }
  }, []);

  // Single function to calculate total amount for last 10 days
  function getTotalAmountLast10Days(accounts, today) {
    const todayDate = new Date(today);
    const tenDaysAgo = new Date(todayDate);
    tenDaysAgo.setDate(todayDate.getDate() - 10);

    // Helper function to convert "YYYY/MM/DD" to Date object
    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    // Filter and sum amounts
    return accounts
      .filter((account) => {
        const accountDate = parseDate(account.date);
        return accountDate >= tenDaysAgo && accountDate <= todayDate;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
  }

  const calculateMonthlyTotals = (accounts) => {
    // Initialize an array of 12 elements, each set to 0
    const monthlyTotals = Array(12).fill(0);

    // Iterate over each account object
    accounts.forEach((account) => {
      const { month } = parseDate(account.date); // Get the month using the global function
      monthlyTotals[month - 1] += account.amount; // Add the amount to the corresponding month
    });

    return monthlyTotals; // Return the array of totals
  };

  const [calenderDate, setCalenderDate] = useState(parseDate(date));

  const shortMonths = [
    "Baisakh", // Baisakh
    "Jestha", // Jestha
    "Asar", // Asar
    "Shrawan", // Shrawan
    "Bhadra", // Bhadra
    "Ashwin", // Ashwin
    "Kartik", // Kartik
    "Mangsir", // Mangsir
    "Poush", // Poush
    "Magh", // Magh
    "Falgun", // Falgun
    "Chaitra", // Chaitra
  ];

  const [todaySales, setTodaySales] = useState(0);

  useEffect(() => {
    function calculateTotalSales(accountsss, calendarDate) {
      const targetDate = {
        year: calendarDate.year,
        month: calendarDate.month,
        day: calendarDate.day,
      };

      let totalSales = 0;
      accountsss.forEach((accountxx) => {
        let parsedDate = parseDate(accountxx.date);

        if (
          targetDate.year === parsedDate.year &&
          targetDate.month === parsedDate.month &&
          targetDate.day === parsedDate.day
        ) {
          totalSales = totalSales + parseInt(accountxx.amount);
        }
      });

      return totalSales;
    }
    setTodaySales(calculateTotalSales(accounts, calenderDate));
  }, [calenderDate, accounts]);

  return (
    <div className="analytics-overviewPage">
      <div className="basic-stats">
        <p className="h6 w600"> Analytics Overview</p>
        <p className="last bg-blue-500">Today : {date}</p>
      </div>

      {/* for that Analytics overview header page let's go  */}
      <section className="analytics279">
        <div className="content-analytics flex4">
          {/* left side div  */}

          <div className="second each flex3">
            <div className="more final flex3 p-2">
              <div className="flex1 bg-slate-200 p-2">
                <p className="h7 py-2">Total Fees Collected</p>
                <p className="h5">
                  {" "}
                  Nrs. {accounts.reduce(
                    (acc, curr) => acc + curr.amount,
                    0
                  )}{" "}
                </p>
              </div>

              <div className="flex1 bg-blue-200 p-2">
                <p className="h7 py-2">Last 10 Days</p>
                <p className="h5">
                  {" "}
                  Nrs. {getTotalAmountLast10Days(accounts, date)}{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="second each flex3">
            <div className="more final flex3">
              <div className="flex1 bg-slate-200 p-2">
                <p className="h7 py-2">Total Students</p>
                <p className="h5"> {students ? students.length : "N/A"} </p>
              </div>

              <div className="flex1 bg-blue-200 p-2">
                <p className="h7 py-2">Total Staffs</p>
                <p className="h5"> {school.staffs.length} </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr style={{ margin: "20px 3%", color: "grey" }} />

      <div className="w-full flex1 flex-col">
        <p className="h6 w500 text-secondary text-center p-5 py-3 rounded-lg">
          {" "}
          Monthly Sales Data{" "}
        </p>

        <Graph
          categories={[
            "Baisakh",
            "Jestha",
            "Ashar",
            "Shrawan",
            "Bhadra",
            "Ashwin",
            "Kartik",
            "Mangsir",
            "Poush",
          ]}
          data={calculateMonthlyTotals(accounts)}
        />
      </div>
      <hr />

      <div className="w-full py-3 flex1 flex-column">
        <p className="h6 w500 text-secondary text-center p-5 py-3 rounded-lg">
          {" "}
          Daily Sales Data{" "}
        </p>

        <div className="calendar-summary">
          <div className="calendar">
            <div className="flex1 justify-end">
              <div className="top flex3 w-[340px]">
                <h4 className="h5 w600">
                  {shortMonths[calenderDate.month - 1]} {calenderDate.year}{" "}
                </h4>
                <div className="arrows flex1">
                  <FontAwesomeIcon
                    className="me-3"
                    icon={faCaretLeft}
                    onClick={() => {
                      setCalenderDate((prevDate) => ({
                        ...prevDate,
                        month: prevDate.month === 1 ? 1 : prevDate.month - 1,
                      }));
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    onClick={() => {
                      setCalenderDate((prevDate) => ({
                        ...prevDate,
                        month: prevDate.month === 12 ? 12 : prevDate.month + 1,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="days custom-scrollbar">
              {[...Array(32)].map((_, i) => (
                <div
                  key={i}
                  className={`numbersHere ${
                    i === calenderDate.day - 1 ? "selected" : ""
                  }`}
                  onClick={() => {
                    setCalenderDate((prevDate) => ({
                      ...prevDate,
                      day: i + 1,
                    }));
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="summary">
            <div className="summary-card flex1 present bg-gray-200">
              <div className="flex1 mr-[20px]">
                <div className="left flex1 mr-[6px]">
                  <FontAwesomeIcon icon={faMoneyCheckDollar} />
                </div>
                <div className="right">
                  <h3 className="h6 w500">Rs. {todaySales}</h3>
                  <p className="h7 w500">Total Sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
