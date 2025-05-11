/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import Loading from "../../../components/student/Loading";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Accounts = () => {
  const { backendUrl, getToken, isEducator, userData } = useContext(AppContext);

  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/allUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter out the educator's account if isEducator is true and userData is available
      const filteredAccounts =
        isEducator && userData
          ? data.filter((account) => account._id !== userData._id) // Filter by _id
          : data;

      setAccounts(filteredAccounts);
      setLoading(false);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu tài khoản: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchAccounts();
    }
  }, [isEducator, userData]); // Added userData to dependencies

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="text-lg font-bold mb-10">Danh sách tài khoản</h2>
        <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <div className="w-full overflow-x-auto">
            <table className="md:table-auto table-fixed w-full overflow-hidden border-collapse">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center">#</th>
                  <th className="px-4 py-3 font-semibold">Thông tin</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Khóa học
                  </th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts &&
                  accounts.map((account, index) => (
                    <tr
                      key={account._id}
                      className="border-b border-gray-500/20 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-center">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={account.imageUrl}
                            alt={account.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                          <span className="font-medium">{account.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 truncate">
                        {account.email}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {account.enrolledCourses
                            ? account.enrolledCourses.length
                            : 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        {formatDate(account.createdAt)}
                      </td>
                    </tr>
                  ))}

                {(!accounts || accounts.length === 0) && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Không có dữ liệu tài khoản nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
