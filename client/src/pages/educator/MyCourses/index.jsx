/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../../components/student/Loading";
import { FaEye, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import CustomPagination from "../../../components/educator/CustomPagination";

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [sorting, setSorting] = useState([]);

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

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  const handleDeleteClick = (courseId) => {
    setSelectedCourseId(courseId);
    setShowConfirmModal(true);
  };

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
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Link
              to={`/educator/update-course/${row.original._id}`}
              className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 text-xs"
            >
              <FaEye />
            </Link>
            <button
              onClick={() => handleDeleteClick(row.original._id)}
              className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600 text-xs"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [currency]
  );

  const table = useReactTable({
    data: courses,
    columns,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // If courses are not loaded yet
  if (!courses.length) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <Link to={`/educator/add-course`}>
          <button className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
            Thêm khóa học
          </button>
        </Link>

        <div className="flex justify-between">
          <h2 className="text-lg font-bold">Danh sách khóa học</h2>
          {/* Rows per page controls */}
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="rowsPerPage" className="text-sm">
                Hiển thị:
              </label>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[5, 10, 15, 20, 25].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize} dòng
                  </option>
                ))}
              </select>
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

          {/* Custom Pagination */}
          <CustomPagination table={table} />
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
              Bạn có chắc muốn xóa khóa học &quot;
              <span className="font-bold">
                {courses.find((c) => c._id === selectedCourseId)?.courseTitle}
              </span>
              &quot; không?
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
