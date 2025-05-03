import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../../components/student/Loading";
import { FaBook, FaMoneyCheckAlt, FaUser } from "react-icons/fa";
import "./Dashboard.scss";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5 items-center justify-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-72 rounded-md bg-white">
            <div className="flex items-center">
              <FaUser className="text-dark-2 text-3xl mr-[10px]" />
              <div>
                <p className="text-2xl font-medium text-gray-600">
                  {dashboardData.totalStudents}
                </p>
                <p className="text-base text-gray-500">Học viên</p>
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
                <p className="text-base text-gray-500">Khóa học</p>
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
                <p className="text-base text-gray-500">Doanh thu</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="pb-4 text-lg font-medium">Đăng ký gần đây</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                    #
                  </th>
                  <th className="px-4 py-3 font-semibold">Tên học viên</th>
                  <th className="px-4 py-3 font-semibold">Khóa học</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-500/20">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {index + 1}
                    </td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={item.student.imageUrl}
                        alt="Profile"
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
