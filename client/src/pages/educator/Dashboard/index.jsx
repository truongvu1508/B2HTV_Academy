/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../../components/student/Loading";
import { FaBook, FaMoneyCheckAlt, FaUser } from "react-icons/fa";
import "./Dashboard.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { Column, Pie } from "@ant-design/plots";

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [courses, setCourses] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);

        if (data.dashboardData.salesByMonth) {
          setSalesData(data.dashboardData.salesByMonth);
        }

        if (data.dashboardData.enrollmentByMonth) {
          setEnrollmentData(data.dashboardData.enrollmentByMonth);
        }
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

  // Cấu hình biểu đồ cột
  const columnConfig = {
    data:
      salesData.length > 0
        ? salesData
        : [
            { month: "T1", sales: 0 },
            { month: "T2", sales: 0 },
            { month: "T3", sales: 0 },
            { month: "T4", sales: 0 },
            { month: "T5", sales: 0 },
            { month: "T6", sales: 0 },
            { month: "T7", sales: 0 },
            { month: "T8", sales: 0 },
            { month: "T9", sales: 0 },
            { month: "T10", sales: 0 },
            { month: "T11", sales: 0 },
            { month: "T12", sales: 0 },
          ],
    xField: "month",
    yField: "sales",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    color: "#1890ff",
    meta: {
      sales: {
        alias: `Doanh thu (${currency})`,
      },
    },
  };

  // Cấu hình biểu đồ tròn
  const pieConfig = {
    appendPadding: 10,
    data:
      enrollmentData.length > 0
        ? enrollmentData
        : [
            { type: "Khóa học A", value: 0 },
            { type: "Khóa học B", value: 0 },
            { type: "Khóa học C", value: 0 },
          ],
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [{ type: "element-active" }],
  };

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      data.success && setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-8">
      <div className="space-y-5 w-full">
        <div className="flex flex-wrap gap-5 items-center ">
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

        {/* Biểu đồ */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 w-full">
          <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
            <h2 className="text-lg font-medium mb-4">Doanh thu theo tháng</h2>
            <div className="h-80">
              <Column {...columnConfig} />
            </div>
          </div>

          <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
            <h2 className="text-lg font-medium mb-4">
              Phân bố học viên theo khóa học
            </h2>
            <div className="h-80">
              <Pie {...pieConfig} />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 w-full">
          <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
            <h2 className="pb-4 text-lg font-medium">Danh sách khóa học</h2>
            <div>
              <table className="md:table-auto table-fixed w-full overflow-hidden border border-gray-500/20 border-collapse mt-10 bg-white">
                <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold truncate">
                      Tất cả khóa học
                    </th>
                    <th className="px-4 py-3 font-semibold truncate">
                      Doanh thu
                    </th>
                    <th className="px-4 py-3 font-semibold truncate">
                      Học viên
                    </th>
                    <th className="px-4 py-3 font-semibold truncate">
                      Ngày đăng
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-500">
                  {courses.map((course) => (
                    <tr
                      key={course._id}
                      className="border-b border-gray-500/20"
                    >
                      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                        <div className="w-32 h-24 aspect-square overflow-hidden">
                          <img
                            src={course.courseThumbnail}
                            alt="Course Image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="truncate hidden md:block">
                          {course.courseTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {course.enrolledStudents.length === 0
                          ? `0 ${currency}`
                          : `${(
                              course.enrolledStudents.length *
                              (course.coursePrice *
                                (1 - (course.discount || 0) / 100))
                            ).toFixed(0)} ${currency}`}
                      </td>
                      <td className="px-4 py-3">
                        {course.enrolledStudents.length}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
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

        {/* <div>
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
        </div> */}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
