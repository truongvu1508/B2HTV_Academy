/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import Loading from "../../../components/student/Loading";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Accounts = () => {
  const { backendUrl, getToken, isEducator, userData, currency } =
    useContext(AppContext);

  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

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
        // Update local state
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
                    Tổng chi tiêu
                  </th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
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
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded">
                          {account.enrolledCourses
                            ? account.enrolledCourses.length
                            : 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        <span className="bg-green-100 text-green-500 text-xs font-medium px-3 py-1 rounded">
                          {account.totalSpent.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }) || 0}{" "}
                          {currency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        {formatDate(account.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleToggleLock(account)}
                          className={`text-white text-xs font-medium px-3 py-1 rounded transition-colors ${
                            account.isLocked
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {account.isLocked ? "Đã khóa" : "Hoạt động"}
                        </button>
                      </td>
                    </tr>
                  ))}

                {(!accounts || accounts.length === 0) && (
                  <tr>
                    <td
                      colSpan="7"
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
      <ConfirmationModal />
    </div>
  );
};

export default Accounts;
