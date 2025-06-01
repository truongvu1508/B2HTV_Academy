/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import Loading from "../../../components/student/Loading";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import CustomPagination from "../../../components/educator/CustomPagination";
import useDataTable from "../../../hooks/useDataTable";
import CustomSelect from "../../../components/CustomSelect";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [progressFilter, setProgressFilter] = useState(""); // New filter for progress
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/categories",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh mục");
    }
  };

  // Fetch enrolled students
  const fetchEnrolledStudents = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
      fetchCategories();
    }
  }, [isEducator]);

  // Filter enrolled students by selected category and progress
  const filteredEnrolledStudents = useMemo(() => {
    let filtered = enrolledStudents;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (student) => student.course?.category?._id === selectedCategory
      );
    }

    // Filter by progress
    if (progressFilter === "completed") {
      filtered = filtered.filter((student) => student.progress?.completed);
    } else if (progressFilter === "in-progress") {
      filtered = filtered.filter(
        (student) =>
          !student.progress?.completed &&
          student.progress?.progressPercentage > 0
      );
    } else if (progressFilter === "not-started") {
      filtered = filtered.filter(
        (student) => student.progress?.progressPercentage === 0
      );
    }

    return filtered;
  }, [enrolledStudents, selectedCategory, progressFilter]);

  // Progress status component
  const ProgressStatus = ({ progress }) => {
    if (!progress) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-300 h-2 rounded-full"
              style={{ width: "0%" }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">0%</span>
        </div>
      );
    }

    const { completed, progressPercentage, completedLectures, totalLectures } =
      progress;

    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          {completed ? (
            <FaCheckCircle className="text-green-500 text-sm" />
          ) : (
            <FaClock className="text-yellow-500 text-sm" />
          )}
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                completed
                  ? "bg-green-500"
                  : progressPercentage > 0
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium">{progressPercentage}%</span>
        </div>
        <div className="text-xs text-gray-500">
          {completedLectures}/{totalLectures} bài học
        </div>
      </div>
    );
  };

  // Columns definition for react-table
  const columns = useMemo(
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
              alt=""
              className="w-9 h-9 rounded-full"
            />
            <span className="truncate">{row.original.student.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "courseTitle",
        header: "Tên khóa học",
        cell: ({ getValue }) => <span className="truncate">{getValue()}</span>,
      },
      {
        accessorKey: "course.category.name",
        header: "Danh mục",
        cell: ({ row }) => (
          <span className="truncate">
            {row.original.course?.category?.name || "Không xác định"}
          </span>
        ),
      },
      {
        accessorKey: "progress.progressPercentage",
        header: "Tiến độ",
        cell: ({ row }) => <ProgressStatus progress={row.original.progress} />,
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.progress?.progressPercentage || 0;
          const b = rowB.original.progress?.progressPercentage || 0;
          return a - b;
        },
      },
      {
        accessorKey: "purchaseDate",
        header: "Ngày đăng ký",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
    ],
    []
  );

  // Table instance
  const table = useDataTable({
    data: filteredEnrolledStudents,
    columns,
    defaultPageSize: 5,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        {enrolledStudents.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold mb-4">Danh sách học viên</h2>
              <div className="flex items-center space-x-4">
                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="categoryFilter" className="text-sm">
                    Danh mục:
                  </label>
                  <CustomSelect
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      table.setPageIndex(0);
                    }}
                    options={[
                      { value: "", label: "Tất cả danh mục" },
                      ...categories.map((category) => ({
                        value: category._id,
                        label: category.name,
                      })),
                    ]}
                    className="min-w-[150px]"
                    placeholder="Chọn danh mục"
                  />
                </div>

                {/* Progress Filter */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="progressFilter" className="text-sm">
                    Tiến độ:
                  </label>
                  <CustomSelect
                    id="progressFilter"
                    value={progressFilter}
                    onChange={(e) => {
                      setProgressFilter(e.target.value);
                      table.setPageIndex(0);
                    }}
                    options={[
                      { value: "", label: "Tất cả tiến độ" },
                      { value: "completed", label: "Đã hoàn thành" },
                      { value: "in-progress", label: "Đang học" },
                      { value: "not-started", label: "Chưa bắt đầu" },
                    ]}
                    className="min-w-[140px]"
                    placeholder="Chọn tiến độ"
                  />
                </div>

                {/* Rows per page */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="rowsPerPage" className="text-sm">
                    Hiển thị:
                  </label>
                  <CustomSelect
                    value={table.getState().pagination.pageSize.toString()}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    options={[5, 10, 15, 20].map((pageSize) => ({
                      value: pageSize.toString(),
                      label: `${pageSize} dòng`,
                    }))}
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            {/* Results summary */}
            <div className="mb-4 text-sm text-gray-600">
              {selectedCategory || progressFilter ? (
                <span>
                  Hiển thị {filteredEnrolledStudents.length} học viên
                  {selectedCategory &&
                    categories.find((cat) => cat._id === selectedCategory)
                      ?.name &&
                    ` trong danh mục "${
                      categories.find((cat) => cat._id === selectedCategory)
                        .name
                    }"`}
                  {progressFilter && (
                    <>
                      {selectedCategory ? " và " : " "}
                      {progressFilter === "completed" && "đã hoàn thành"}
                      {progressFilter === "in-progress" && "đang học"}
                      {progressFilter === "not-started" && "chưa bắt đầu"}
                    </>
                  )}
                </span>
              ) : (
                <span>Tổng cộng {enrolledStudents.length} học viên</span>
              )}
            </div>

            {filteredEnrolledStudents.length === 0 &&
            (selectedCategory || progressFilter) ? (
              <div className="text-center py-8">
                Không có học viên nào phù hợp với bộ lọc đã chọn.
              </div>
            ) : (
              <div className="mt-4">
                <table className="w-full bg-white border border-gray-500/20 text-left">
                  <thead className="border-b border-gray-500/20">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className={`px-4 py-3 text-sm font-semibold ${
                              header.id === "index" ? "text-center" : ""
                            } ${
                              header.column.getCanSort() ? "cursor-pointer" : ""
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
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b border-gray-500/20">
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
                <CustomPagination table={table} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">Không có học viên nào đăng ký.</div>
        )}
      </div>
    </div>
  );
};

export default StudentsEnrolled;
