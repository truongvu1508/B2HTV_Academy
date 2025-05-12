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

// Custom Pagination Component
const CustomPagination = ({ table }) => {
  const pageNumbers = [];
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  // Generate page numbers to display
  const generatePageNumbers = () => {
    if (totalPages <= 5) {
      // If total pages are 5 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // More complex pagination logic
      if (currentPage <= 3) {
        // If current page is near the beginning
        pageNumbers.push(1, 2, 3, 4, -1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        // If current page is near the end
        pageNumbers.push(
          1,
          -1,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // Current page is in the middle
        pageNumbers.push(
          1,
          -1,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          -1,
          totalPages
        );
      }
    }
  };

  generatePageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {pageNumbers.map((pageNumber, index) =>
        pageNumber === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="px-4 py-2 text-sm text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={pageNumber}
            onClick={() => table.setPageIndex(pageNumber - 1)}
            className={`px-4 py-2 text-sm font-medium border rounded-md 
              ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white border-blue-500"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
              }`}
          >
            {pageNumber}
          </button>
        )
      )}

      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

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
        cell: ({ getValue }) => `${getValue().toFixed(0)} ${currency}`,
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

  // Table instance
  const table = useReactTable({
    data: courses,
    columns,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10, // Mặc định 10 dòng trên 1 trang
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
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <Link to={`/educator/add-course`}>
          <button className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
            Thêm khóa học
          </button>
        </Link>

        <h2 className="text-lg font-bold">Danh sách khóa học</h2>

        <div className="mt-4">
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

          {/* Table */}
          <table className="w-full border border-gray-500/20 text-left">
            <thead className="bg-gray-100 border-b border-gray-500/20">
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
