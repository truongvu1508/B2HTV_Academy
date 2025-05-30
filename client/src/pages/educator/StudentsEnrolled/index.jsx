/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import Loading from "../../../components/student/Loading";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import CustomPagination from "../../../components/educator/CustomPagination";
import useDataTable from "../../../hooks/useDataTable";
import CustomSelect from "../../../components/CustomSelect";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
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

  // Filter enrolled students by selected category
  const filteredEnrolledStudents = useMemo(() => {
    if (!selectedCategory) return enrolledStudents;
    return enrolledStudents.filter(
      (student) => student.course?.category?._id === selectedCategory
    );
  }, [enrolledStudents, selectedCategory]);

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
              {selectedCategory ? (
                <span>
                  Hiển thị {filteredEnrolledStudents.length} học viên
                  {categories.find((cat) => cat._id === selectedCategory)
                    ?.name &&
                    ` trong danh mục "${
                      categories.find((cat) => cat._id === selectedCategory)
                        .name
                    }"`}
                </span>
              ) : (
                <span>Tổng cộng {enrolledStudents.length} học viên</span>
              )}
            </div>

            {filteredEnrolledStudents.length === 0 && selectedCategory ? (
              <div className="text-center py-8">
                Không có học viên nào trong danh mục "
                {categories.find((cat) => cat._id === selectedCategory)?.name ||
                  "đã chọn"}
                ".
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
