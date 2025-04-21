import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { dummyDashboardData } from "../../../assets/assets";
import Loading from "../../../components/student/Loading";
import { FaBook, FaMoneyCheckAlt, FaUser } from "react-icons/fa";
import "./Dashboard.scss";

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-72 rounded-md bg-white">
            <div className="flex items-center">
              <FaUser className="text-dark-2 text-3xl mr-[10px]" />
              <div>
                <p className="text-2xl font-medium text-gray-600">
                  {dashboardData.enrolledStudentsData.length}
                </p>
                <p className="text-base text-gray-500"> Học viên</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-72 rounded-md bg-white">
            <div className="flex items-center">
              <FaBook className="text-dark-2 text-3xl mr-[10px]" />
              <div>
                <p className="text-2xl font-medium text-gray-600">
                  {dashboardData.totalCourses}
                </p>
                <p className="text-base text-gray-500"> Khóa học</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-72 rounded-md bg-white">
            <div className="flex items-center">
              <FaMoneyCheckAlt className="text-dark-2 text-3xl mr-[10px]" />
              <div>
                <p className="text-2xl font-medium text-gray-600">
                  {dashboardData.totalEarnings} {currency}
                </p>
                <p className="text-base text-gray-500"> Doanh thu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
