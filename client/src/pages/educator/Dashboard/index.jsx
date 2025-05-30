/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../../components/student/Loading";
import {
  FaBook,
  FaMoneyCheckAlt,
  FaUser,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import "./Dashboard.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { Column, Pie } from "@ant-design/plots";
import BackToTop from "../../../components/client/BackToTop";
import CustomPagination from "../../../components/educator/CustomPagination";
import useDataTable from "../../../hooks/useDataTable";
import CustomSelect from "../../../components/CustomSelect";

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("month");
  const [pieChartType, setPieChartType] = useState("course");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeFrame, pieChartType },
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
    } finally {
      setLoading(false);
    }
  };

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
      fetchEducatorCourses();
    }
  }, [isEducator, timeFrame, pieChartType]);

  // Column configuration for Recent Enrollments table
  const enrollmentColumns = useMemo(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: "student.name",
        header: "Tên học viên",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <img
              src={row.original.student.imageUrl}
              alt="Profile"
              className="w-9 h-9 rounded-full"
            />
            <span className="truncate">{row.original.student.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "courseTitle",
        header: "Khóa học",
        cell: ({ getValue }) => <span className="truncate">{getValue()}</span>,
      },
    ],
    []
  );

  // Column configuration for Courses table
  const courseColumns = useMemo(
    () => [
      {
        accessorKey: "courseTitle",
        header: "Tất cả khóa học",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3 truncate">
            <div className="w-32 h-24 aspect-square overflow-hidden">
              <img
                src={row.original.courseThumbnail}
                alt="Course Image"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="truncate hidden md:block">
              {row.original.courseTitle}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "revenue",
        header: "Doanh thu",
        accessorFn: (row) => {
          const revenue =
            row.enrolledStudents.length === 0
              ? 0
              : row.enrolledStudents.length *
                (row.coursePrice * (1 - (row.discount || 0) / 100));
          return revenue;
        },
        cell: ({ getValue }) =>
          `${getValue().toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })} ${currency}`,
      },
      {
        accessorKey: "enrolledStudents",
        header: "Học viên",
        accessorFn: (row) => row.enrolledStudents.length,
        cell: ({ getValue }) => getValue(),
      },
      {
        accessorKey: "createdAt",
        header: "Ngày đăng",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
    ],
    [currency]
  );

  // Dang ky gan day
  const enrollmentTable = useDataTable({
    data: dashboardData?.enrolledStudentsData || [],
    columns: enrollmentColumns,
    defaultPageSize: 5,
  });

  // Danh sach khoa hoc
  const courseTable = useDataTable({
    data: courses,
    columns: courseColumns,
    defaultPageSize: 5,
  });

  // Column chart configuration
  const columnConfig = {
    data:
      salesData.length > 0
        ? salesData
        : timeFrame === "month"
        ? [
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
          ]
        : timeFrame === "quarter"
        ? [
            { quarter: "Q1", sales: 0 },
            { quarter: "Q2", sales: 0 },
            { quarter: "Q3", sales: 0 },
            { quarter: "Q4", sales: 0 },
          ]
        : [{ year: "2025", sales: 0 }],
    xField:
      timeFrame === "month"
        ? "month"
        : timeFrame === "quarter"
        ? "quarter"
        : "year",
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

  // Pie chart configuration
  const pieConfig = {
    appendPadding: 10,
    data:
      enrollmentData.length > 0
        ? enrollmentData
        : pieChartType === "course"
        ? [
            { type: "Khóa học A", value: 0 },
            { type: "Khóa học B", value: 0 },
            { type: "Khóa học C", value: 0 },
          ]
        : [
            { type: "Danh mục A", value: 0 },
            { type: "Danh mục B", value: 0 },
            { type: "Danh mục C", value: 0 },
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-8">
      <div className="space-y-5 w-full">
        <div className="flex flex-wrap gap-5 items-center justify-around">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-10 w-96 rounded-md bg-white">
            <div className="flex items-center">
              <FaUser className="text-dark-2 text-3xl mr-[20px]" />
              <div>
                <p className="text-2xl font-medium text-gray-600">
                  {dashboardData?.totalStudents || 0}
                </p>
                <p className="text-base text-gray-500">Học viên</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-10 w-96 rounded-md bg-white">
            <div className="flex items-center">
              <FaBook className="text-dark-2 text-3xl mr-[20px]" />
              <div>
                <p className="text-2xl font-medium text-gray-600">
                  {dashboardData?.totalCourses || 0}
                </p>
                <p className="text-base text-gray-500">Khóa học</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-10 w-96 rounded-md bg-white">
            <div className="flex items-center">
              <FaMoneyCheckAlt className="text-dark-2 text-3xl mr-[20px]" />
              <div>
                <p className="text-2xl font-medium text-gray-600">
                  {dashboardData?.totalEarnings.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }) || 0}{" "}
                  {currency}
                </p>
                <p className="text-base text-gray-500">Doanh thu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 w-full">
          <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">
                Phân bố học viên theo{" "}
                {pieChartType === "course" ? "khóa học" : "danh mục"}
              </h2>
              <div className="flex items-center space-x-2">
                <CustomSelect
                  value={pieChartType}
                  onChange={(e) => setPieChartType(e.target.value)}
                  options={[
                    { value: "course", label: "Khóa học" },
                    { value: "category", label: "Danh mục" },
                  ]}
                  label="Phân bố theo"
                  className="w-40"
                />
              </div>
            </div>
            <div className="h-80">
              <Pie {...pieConfig} />
            </div>
          </div>
          <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
            {dashboardData?.enrolledStudentsData.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="pb-4 text-lg font-medium">Đăng ký gần đây</h2>
                  <div className="flex items-center space-x-2">
                    <CustomSelect
                      value={enrollmentTable
                        .getState()
                        .pagination.pageSize.toString()}
                      onChange={(e) =>
                        enrollmentTable.setPageSize(Number(e.target.value))
                      }
                      options={[5, 10, 15, 20].map((pageSize) => ({
                        value: pageSize.toString(),
                        label: `${pageSize} dòng`,
                      }))}
                      className="w-32"
                    />
                  </div>
                </div>
                <div className="flex flex-col max-w-4xl w-full overflow-hidden rounded-md bg-white">
                  <table className="w-full bg-white border border-gray-500/20 text-left">
                    <thead className="border-b border-gray-500/20">
                      {enrollmentTable.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className={`px-4 py-3 text-sm font-semibold ${
                                header.id === "index" ? "text-center" : ""
                              } ${
                                header.column.getCanSort()
                                  ? "cursor-pointer"
                                  : ""
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div
                                className={`flex ${
                                  header.id === "index"
                                    ? "justify-center"
                                    : "items-center"
                                }`}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.column.getCanSort() &&
                                  ({
                                    asc: <FaSortUp className="ml-2" />,
                                    desc: <FaSortDown className="ml-2" />,
                                  }[header.column.getIsSorted()] ?? (
                                    <FaSort className="ml-2 opacity-50" />
                                  ))}
                              </div>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {enrollmentTable.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-500/20"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className={`px-4 py-3 text-sm ${
                                cell.column.id === "index" ? "text-center" : ""
                              }`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <CustomPagination table={enrollmentTable} />
                </div>
              </>
            ) : (
              <div className="text-center py-8">Không có đăng ký gần đây.</div>
            )}
          </div>
        </div>

        <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium mb-4">
              Doanh thu theo{" "}
              {timeFrame === "month"
                ? "tháng"
                : timeFrame === "quarter"
                ? "quý"
                : "năm"}
            </h2>{" "}
            <div className="flex justify-end mb-4">
              <CustomSelect
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                options={[
                  { value: "month", label: "Tháng" },
                  { value: "quarter", label: "Quý" },
                  { value: "year", label: "Năm" },
                ]}
                className="w-40"
              />
            </div>
          </div>
          <div className="h-80">
            <Column {...columnConfig} />
          </div>
        </div>

        <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
          {courses.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="pb-4 text-lg font-medium">Danh sách khóa học</h2>
                <div className="flex items-center space-x-2">
                  <CustomSelect
                    value={courseTable
                      .getState()
                      .pagination.pageSize.toString()}
                    onChange={(e) =>
                      courseTable.setPageSize(Number(e.target.value))
                    }
                    options={[5, 10, 15, 20].map((pageSize) => ({
                      value: pageSize.toString(),
                      label: `${pageSize} dòng`,
                    }))}
                    className="w-32"
                  />
                </div>
              </div>
              <div className="flex flex-col overflow-hidden rounded-md bg-white ">
                <table className="w-full bg-white border border-gray-500/20 text-left">
                  <thead className="border-b border-gray-500/20">
                    {courseTable.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className={`px-4 py-3 text-sm font-semibold ${
                              header.column.getCanSort() ? "cursor-pointer" : ""
                            }`}
                          >
                            <div className="flex items-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() &&
                                ({
                                  asc: <FaSortUp className="ml-2" />,
                                  desc: <FaSortDown className="ml-2" />,
                                }[header.column.getIsSorted()] ?? (
                                  <FaSort className="ml-2 opacity-50" />
                                ))}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {courseTable.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b border-gray-500/20">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3 text-sm">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <CustomPagination table={courseTable} />
              </div>
            </>
          ) : (
            <div className="text-center py-8">Không có khóa học nào.</div>
          )}
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default Dashboard;
