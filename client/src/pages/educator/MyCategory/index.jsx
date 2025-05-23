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

const MyCategory = () => {
  const { backendUrl, isEducator, getToken } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async () => {
    if (!selectedCategoryId) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `${backendUrl}/api/educator/delete-category/${selectedCategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setCategories(
          categories.filter((category) => category._id !== selectedCategoryId)
        );
        toast.success("Danh mục đã được xóa");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Xóa danh mục thất bại: " + error.message);
    } finally {
      setShowConfirmModal(false);
      setSelectedCategoryId(null);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchCategories();
    }
  }, [isEducator, backendUrl, getToken]);

  const handleDeleteClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowConfirmModal(true);
  };

  // Định nghĩa cột cho react-table
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Tên danh mục",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3 truncate">
            <span className="truncate hidden md:block">
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ getValue }) => (
          <span className="truncate">{getValue() || "Không có mô tả"}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Link
              to={`/educator/update-category/${row.original._id}`}
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
    []
  );

  // Tạo instance cho bảng
  const table = useDataTable({
    data: categories,
    columns,
    defaultPageSize: 5,
  });

  // Hiển thị loading nếu đang tải dữ liệu
  if (isLoading) {
    return <Loading />;
  }

  // Hiển thị thông báo nếu không có danh mục
  if (!categories.length) {
    return (
      <div className="flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
        <div className="w-full">
          <Link to="/educator/add-category">
            <button className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
              Thêm danh mục
            </button>
          </Link>
          <h2 className="text-lg font-bold">Danh sách danh mục</h2>
          <p className="text-sm text-gray-500 mt-4">
            Hiện tại không có danh mục nào.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <Link to="/educator/add-category">
          <button className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
            Thêm danh mục
          </button>
        </Link>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Danh sách danh mục</h2>
          {/* Điều khiển số dòng mỗi trang */}
          <div className="flex items-center space-x-2 mb-4">
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
          {/* Bảng */}
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

          {/* Phân trang tùy chỉnh */}
          <CustomPagination table={table} />
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận xóa danh mục
            </h3>
            <p>
              Bạn có chắc muốn xóa danh mục "
              <span className="font-bold">
                {categories.find((c) => c._id === selectedCategoryId)?.name}
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
                onClick={deleteCategory}
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

export default MyCategory;
