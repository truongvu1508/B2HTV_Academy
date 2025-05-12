/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Loading from "../../../components/student/Loading";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import CustomPagination from "../../../components/educator/CustomPagination";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);

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
    }
  }, [isEducator]);

  // Columns definition for react-table
  const columns = useMemo(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row, table }) =>
          table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
          row.index +
          1,
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
        accessorKey: "purchaseDate",
        header: "Ngày đăng ký",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
    ],
    []
  );

  // Table instance
  const table = useReactTable({
    data: enrolledStudents,
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        {enrolledStudents.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              {" "}
              <h2 className="text-lg font-bold mb-4">Danh sách học viên</h2>
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
          </>
        ) : (
          <div className="text-center py-8">Không có học viên nào đăng ký.</div>
        )}
      </div>
    </div>
  );
};

export default StudentsEnrolled;
