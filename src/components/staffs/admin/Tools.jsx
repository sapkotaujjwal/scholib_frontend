import  { useEffect, useState } from "react";
import "./tools.scss";
import MetaData from "../../layout/MetaData";
import { useSelector } from "react-redux";
import AnalyticsOverview from "./AnalyticsOverview";
import FeeStructure from "./FeeStructure";
import Classes from "./Classes";
import DailyActivities from "./DailyActivities";
import ExtraTools from "./ExtraTools";

const Tools = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="tools-admin2733 applyBootstrap">
      <MetaData title={`${user && user.role ? "Staff" : "Student"} || Tools`} />
      <div className="content-inside">
        <div className="flex flex-col p-4 bg-white shadow1 rounded-lg mx-[2%]">
          <p className="text-xl font-semibold text-[#133189]">Tools</p>
          <p className="text-sm text-gray-600">{school.name}</p>
        </div>

        {/* another navigation bar  */}

        <div className="admin-navbar-pro bg-white shadow1 rounded-lg overflow-x-auto my-4 py-3 mx-[2%]">
          <div className="flex items-center p-2 space-x-4">
            <div
              className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-200 whitespace-nowrap ${
                currentPage === 1
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(1)}
            >
              <p className="text-sm">Analytics Overview</p>
            </div>

            <div
              className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-200 whitespace-nowrap ${
                currentPage === 2
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(2)}
            >
              <p className="text-sm">Fee Structure</p>
            </div>

            <div
              className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-200 whitespace-nowrap ${
                currentPage === 3
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(3)}
            >
              <p className="text-sm">Classes & Courses</p>
            </div>

            <div
              className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-200 whitespace-nowrap ${
                currentPage === 4
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(4)}
            >
              <p className="text-sm">Daily Activity</p>
            </div>

            <div
              className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-200 whitespace-nowrap ${
                currentPage === 5
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(5)}
            >
              <p className="text-sm">Removed Members</p>
            </div>
          </div>
        </div>

        {/* rendering the components according to their order  */}

        <section className="PagesRendering">
          {currentPage && currentPage === 1 && <AnalyticsOverview />}
          {currentPage && currentPage === 2 && <FeeStructure />}
          {currentPage && currentPage === 3 && <Classes />}
          {currentPage && currentPage === 4 && <DailyActivities />}
          {currentPage && currentPage === 5 && <ExtraTools />}
        </section>
      </div>
    </div>
  );
};

export default Tools;
