import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import { GET_ACCOUNTS } from "../../../redux/HomeSlice";
import Graph from "../../basicComponents/Graph";
import { parseDate } from "../../../tools/dateTool";
import { 
  faMoneyCheckDollar, 
  faCaretLeft, 
  faCaretRight,
  faUsers,
  faUserTie,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AnalyticsOverview = () => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state.Other.date);
  const accounts = useSelector((state) => state.Home.accounts);
  const school = useSelector((state) => state.Home.school.payload);
  const students = useSelector((state) => state.Students.students.payload);

  const [calenderDate, setCalenderDate] = useState(parseDate(date));
  const [todaySales, setTodaySales] = useState(0);

  const shortMonths = [
    "Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra",
    "Ashwin", "Kartik", "Mangsir", "Poush", "Magh",
    "Falgun", "Chaitra"
  ];

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

  useEffect(() => {
    if (accounts.length === 0) {
      axios.get(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/accounts/info`,
        {
          params: {},
          withCredentials: true,
        }
      )
        .then((response) => {
          if (response.data.success) {
            const paymentData = response.data.data.paymentHistory.map(
              (ind, index) => ({
                sn: index + 1,
                date: formatDateToString(ind.date),
                amount: ind.amount,
                approvedBy: school.staffs.find(
                  (sta) => sta._id === ind.approvedBy
                ).name,
                method: ind.method,
                time: convertTo12Hour(ind.time),
                student: students.find((sta) => sta._id === ind.student)?.name || "N/A",
              })
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

  function getTotalAmountLast10Days(accounts, today) {
    const todayDate = new Date(today);
    const tenDaysAgo = new Date(todayDate);
    tenDaysAgo.setDate(todayDate.getDate() - 10);

    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    return accounts
      .filter((account) => {
        const accountDate = parseDate(account.date);
        return accountDate >= tenDaysAgo && accountDate <= todayDate;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
  }

  const calculateMonthlyTotals = (accounts) => {
    const monthlyTotals = Array(12).fill(0);
    accounts.forEach((account) => {
      const { month } = parseDate(account.date);
      monthlyTotals[month - 1] += account.amount;
    });
    return monthlyTotals;
  };

  useEffect(() => {
    function calculateTotalSales(accountsss, calendarDate) {
      const targetDate = {
        year: calendarDate.year,
        month: calendarDate.month,
        day: calendarDate.day,
      };

      return accountsss.reduce((total, accountxx) => {
        const parsedDate = parseDate(accountxx.date);
        if (
          targetDate.year === parsedDate.year &&
          targetDate.month === parsedDate.month &&
          targetDate.day === parsedDate.day
        ) {
          return total + parseInt(accountxx.amount);
        }
        return total;
      }, 0);
    }
    setTodaySales(calculateTotalSales(accounts, calenderDate));
  }, [calenderDate, accounts]);

  return (
    <div className="min-h-screen md:bg-gray-50 sm:p-0 md:p-6 rounded-md">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>
        <p className="text-sm text-gray-600 w500 bg-gray-100 rounded-md p-3 mt-2">Today : {date}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Fees Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FontAwesomeIcon icon={faMoneyCheckDollar} className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Fees Collected</p>
              <p className="text-xl font-bold text-gray-800">
                Nrs. {accounts.reduce((acc, curr) => acc + curr.amount, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Last 10 Days Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last 10 Days</p>
              <p className="text-xl font-bold text-gray-800">
                Nrs. {getTotalAmountLast10Days(accounts, date)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Students Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FontAwesomeIcon icon={faUsers} className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-xl font-bold text-gray-800">
                {students ? students.length : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Staff Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FontAwesomeIcon icon={faUserTie} className="text-orange-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-xl font-bold text-gray-800">
                {school.staffs.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Sales Graph */}
      <div className="bg-white rounded-xl shadow-sm sm:p-0 md:p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Monthly Sales Data</h2>
        <Graph
          categories={shortMonths}
          data={calculateMonthlyTotals(accounts)}
        />
      </div>

      {/* Daily Sales Calendar */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Daily Sales Data</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {shortMonths[calenderDate.month - 1]} {calenderDate.year}
              </h3>
              <div className="flex space-x-4">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => {
                    setCalenderDate((prevDate) => ({
                      ...prevDate,
                      month: prevDate.month === 1 ? 1 : prevDate.month - 1,
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faCaretLeft} />
                </button>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => {
                    setCalenderDate((prevDate) => ({
                      ...prevDate,
                      month: prevDate.month === 12 ? 12 : prevDate.month + 1,
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faCaretRight} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {[...Array(32)].map((_, i) => (
                <button
                  key={i}
                  className={`
                    aspect-square rounded-lg p-2 text-center
                    hover:bg-blue-50 transition-colors
                    ${i === calenderDate.day - 1 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "bg-gray-50"}
                  `}
                  onClick={() => {
                    setCalenderDate((prevDate) => ({
                      ...prevDate,
                      day: i + 1,
                    }));
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Summary */}
          <div className="flex-1 bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <FontAwesomeIcon icon={faMoneyCheckDollar} className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">Rs. {todaySales}</p>
                <p className="text-gray-600">Total Sales for Selected Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;