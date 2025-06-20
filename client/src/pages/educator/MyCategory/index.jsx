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
        size: 200, // Fixed width
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <span className="truncate font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        size: 300, // Fixed width for description
        cell: ({ getValue }) => {
          const description = getValue() || "Không có mô tả";
          return (
            <div className="max-w-xs group relative">
              <span className="truncate block text-sm text-gray-700">
                {description}
              </span>
              {/* Tooltip hiển thị full text khi hover */}
              {description && description.length > 50 && (
                <div className="absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 max-w-sm break-words shadow-lg">
                  {description}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        size: 120, // Fixed width
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600">
            {new Date(getValue()).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        size: 100, // Fixed width for actions
        cell: ({ row }) => (
          <div className="flex space-x-2 justify-end">
            <Link
              to={`/educator/update-category/${row.original._id}`}
              className="text-blue-500 px-2 py-2 rounded hover:bg-blue-500 hover:text-white text-lg transition-colors"
            >
              <FaEye />
            </Link>
            <button
              onClick={() => handleDeleteClick(row.original._id)}
              className="text-red-500 px-2 py-2 rounded hover:bg-red-500 hover:text-white text-lg transition-colors"
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

        <div className="mt-4 overflow-x-auto">
          {/* Bảng với responsive wrapper */}
          <div className="min-w-full">
            <table className="w-full bg-white border border-gray-500/20 text-left table-fixed">
              <colgroup>
                <col className="w-1/4 min-w-[150px]" /> {/* Tên danh mục */}
                <col className="w-2/5 min-w-[200px]" /> {/* Mô tả */}
                <col className="w-1/6 min-w-[120px]" /> {/* Ngày tạo */}
                <col className="w-1/6 min-w-[100px]" /> {/* Actions */}
              </colgroup>
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
                  <tr
                    key={row.id}
                    className="border-b border-gray-500/20 hover:bg-gray-50"
                  >
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
          </div>

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
              <button>
                onClick={deleteCategory}
                className="px-4 py-2 bg-red-600 text-white rounded-md
                hover:bg-red-700"
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCategory;
