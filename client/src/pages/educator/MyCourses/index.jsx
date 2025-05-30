/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../../components/student/Loading";
import { FaEye, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import CustomPagination from "../../../components/educator/CustomPagination";
import useDataTable from "../../../hooks/useDataTable";
import CustomSelect from "../../../components/CustomSelect";

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch educator courses
  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses);
      } else {
        throw new Error(data.message || "Không thể tải khóa học");
      }
    } catch (error) {
      toast.error("Lỗi khi tải khóa học: " + error.message);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setCategories(data.categories);
      } else {
        throw new Error(data.message || "Không thể tải danh mục");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh mục: " + error.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (isEducator) {
          await Promise.all([fetchEducatorCourses(), fetchCategories()]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isEducator]);

  // Delete course
  const deleteCourse = async () => {
    if (!selectedCourseId) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `${backendUrl}/api/educator/delete-course/${selectedCourseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setCourses(courses.filter((course) => course._id !== selectedCourseId));
        toast.success("Khóa học đã được xóa");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Xóa khóa học thất bại: " + error.message);
    } finally {
      setShowConfirmModal(false);
      setSelectedCourseId(null);
    }
  };

  const handleDeleteClick = (courseId) => {
    setSelectedCourseId(courseId);
    setShowConfirmModal(true);
  };

  // Filter courses by selected category
  const filteredCourses = useMemo(() => {
    if (!selectedCategory) {
      return courses;
    }
    return courses.filter(
      (course) => (course.category?._id || course.category) === selectedCategory
    );
  }, [courses, selectedCategory]);

  // Columns definition for react-table
  const columns = useMemo(
    () => [
      {
        accessorKey: "courseTitle",
        header: "Tất cả khóa học",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3 truncate">
            <div className="w-32 h-24 aspect-square overflow-hidden">
              <img
                src={row.original.courseThumbnail || "/placeholder-image.jpg"}
                alt="Course Image"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="truncate">{row.original.courseTitle}</span>
          </div>
        ),
      },
      {
        accessorKey: "category.name",
        header: "Danh mục",
        cell: ({ row }) => (
          <span className="truncate">
            {row.original.category?.name || "Không có danh mục"}
          </span>
        ),
      },
      {
        accessorKey: "revenue",
        header: "Doanh thu",
        accessorFn: (row) => {
          const revenue =
            row.enrolledStudents?.length === 0
              ? 0
              : row.enrolledStudents.length *
                (row.coursePrice * (1 - (row.discount || 0) / 100));
          return Math.round(revenue);
        },
        cell: ({ getValue }) =>
          `${getValue().toLocaleString("vi-VN")} ${currency}`,
      },
      {
        accessorKey: "enrolledStudents",
        header: "Học viên",
        accessorFn: (row) => row.enrolledStudents?.length || 0,
        cell: ({ getValue }) => getValue(),
      },
      {
        accessorKey: "createdAt",
        header: "Ngày đăng",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleDateString("vi-VN"),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Link
              to={`/educator/update-course/${row.original._id}`}
              className="text-blue-500 px-2 py-2 rounded hover:bg-blue-500 hover:text-white text-lg"
            >
              <FaEye />
            </Link>
            <button
              onClick={() => handleDeleteClick(row.original._id)}
              className="text-red-500 px-2 py-2 rounded hover:bg-red-500 hover:text-white text-lg"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [currency]
  );

  // Table instance
  const table = useDataTable({
    data: filteredCourses,
    columns,
    defaultPageSize: 5,
  });

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return <Loading />;
  }

  // Hiển thị thông báo nếu không có khóa học
  if (!courses.length) {
    return (
      <div className="flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
        <div className="w-full">
          <Link to="/educator/add-course">
            <button className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
              Thêm khóa học
            </button>
          </Link>
          <h2 className="text-lg font-bold">Danh sách khóa học</h2>
          <p className="text-sm text-gray-500 mt-4">
            Hiện tại không có khóa học nào.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <Link to="/educator/add-course">
          <button className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
            Thêm khóa học
          </button>
        </Link>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Danh sách khóa học</h2>
          <div className="flex items-center space-x-4">
            {/* Category filter combobox */}
            <div className="flex items-center space-x-2">
              <label htmlFor="categoryFilter" className="text-sm">
                Lọc theo danh mục:
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
                className="w-48"
                placeholder="Chọn danh mục"
              />
            </div>
            {/* Rows per page controls */}
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

        <div className="mt-4">
          {/* Table */}
          <table className="w-full bg-white border border-gray-500/20 text-left">
            <thead className="border-b border-gray-500/20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-sm font-semibold cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <FaSortUp className="ml-2" />,
                          desc: <FaSortDown className="ml-2" />,
                        }[header.column.getIsSorted()] ?? (
                          <FaSort className="ml-2 opacity-50" />
                        )}
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

          {filteredCourses.length === 0 && selectedCategory && (
            <p className="text-sm text-gray-500 mt-4">
              Không có khóa học nào thuộc danh mục đã chọn.
            </p>
          )}

          {filteredCourses.length > 0 && <CustomPagination table={table} />}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận xóa khóa học
            </h3>
            <p>
              Bạn có chắc muốn xóa khóa học "
              <span className="font-bold">
                {courses.find((c) => c._id === selectedCourseId)?.courseTitle}
              </span>
              " không?
            </p>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={deleteCourse}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
