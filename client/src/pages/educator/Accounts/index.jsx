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

const Accounts = () => {
  const { backendUrl, getToken, isEducator, userData, currency } =
    useContext(AppContext);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [sorting, setSorting] = useState([]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/allUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredAccounts =
        isEducator && userData
          ? data.filter((account) => account._id !== userData._id)
          : data;

      setAccounts(filteredAccounts);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu tài khoản: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchAccounts();
    }
  }, [isEducator, userData]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleToggleLock = (account) => {
    setSelectedAccount(account);
    setShowConfirmModal(true);
  };

  const confirmToggleLock = async () => {
    if (!selectedAccount) return;

    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/educator/updateUserLockStatus`,
        {
          userId: selectedAccount._id,
          isLocked: !selectedAccount.isLocked,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setAccounts(
          accounts.map((acc) =>
            acc._id === selectedAccount._id
              ? { ...acc, isLocked: !selectedAccount.isLocked }
              : acc
          )
        );

        toast.success(
          selectedAccount.isLocked
            ? "Đã mở khóa tài khoản thành công"
            : "Đã khóa tài khoản thành công"
        );
      } else {
        toast.error(data.message || "Lỗi khi cập nhật trạng thái tài khoản");
      }
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    } finally {
      setShowConfirmModal(false);
      setSelectedAccount(null);
    }
  };

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
        accessorKey: "name",
        header: "Thông tin",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <img
              src={row.original.imageUrl}
              alt={row.original.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600 truncate">{getValue()}</span>
        ),
      },
      {
        accessorKey: "enrolledCourses",
        header: "Khóa học",
        accessorFn: (row) => row.enrolledCourses?.length || 0,
        cell: ({ getValue }) => (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: "Tổng chi tiêu",
        cell: ({ getValue }) =>
          `${getValue().toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })} ${currency}`,
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ getValue }) => formatDate(getValue()),
      },
      {
        id: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <button
            onClick={() => handleToggleLock(row.original)}
            className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
              row.original.isLocked
                ? "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
            }`}
          >
            {row.original.isLocked ? "Đã khóa" : "Hoạt động"}
          </button>
        ),
        enableSorting: false,
      },
    ],
    [currency]
  );

  // Table instance
  const table = useReactTable({
    data: accounts,
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

  // Modal confirmation popup
  const ConfirmationModal = () => {
    if (!showConfirmModal || !selectedAccount) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Xác nhận</h3>
          <p>
            {selectedAccount.isLocked
              ? `Bạn có muốn mở khóa tài khoản của ${selectedAccount.name} không?`
              : `Bạn có muốn khóa tài khoản của ${selectedAccount.name} không?`}
          </p>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={confirmToggleLock}
              className={`px-4 py-2 rounded-md text-white ${
                selectedAccount.isLocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {selectedAccount.isLocked ? "Mở khóa" : "Khóa"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        {accounts.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              {" "}
              <h2 className="text-lg font-bold mb-4">Danh sách tài khoản</h2>
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
            <div className="flex flex-col w-full overflow-hidden rounded-md ">
              <div className="w-full overflow-x-auto">
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
                      <tr
                        key={row.id}
                        className="border-b border-gray-500/20 hover:bg-gray-50"
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
              </div>
              <CustomPagination table={table} />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không có dữ liệu tài khoản nào
          </div>
        )}
      </div>
      <ConfirmationModal />
    </div>
  );
};

export default Accounts;
