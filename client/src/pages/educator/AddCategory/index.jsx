import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../../components/student/Loading";

const AddCategory = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý gửi biểu mẫu
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Tên danh mục là bắt buộc.");
      return;
    }

    if (!description.trim()) {
      toast.error("Mô tả danh mục là bắt buộc.");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-category`,
        { name, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        navigate("/educator/my-category");
      } else {
        throw new Error(data.message || "Tạo danh mục thất bại");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Dữ liệu không hợp lệ.");
      } else {
        toast.error("Tạo danh mục thất bại: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý hủy với xác nhận nếu có dữ liệu
  const handleCancel = () => {
    if (name.trim() || description.trim()) {
      if (window.confirm("Bạn có chắc muốn hủy? Dữ liệu sẽ không được lưu.")) {
        navigate("/educator/my-category");
      }
    } else {
      navigate("/educator/my-category");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <h2 className="text-lg font-bold mb-6">Thêm danh mục mới</h2>
        <div className="flex flex-col gap-5">
          {/* Tên danh mục */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tên danh mục
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên danh mục"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Mô tả danh mục */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Mô tả danh mục
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả danh mục"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 focus:ring-1 focus:ring-blue-500 resize-y min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          {/* Nút gửi */}
          <div className="flex gap-4 my-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-8 rounded disabled:bg-blue-300"
              disabled={isLoading}
            >
              Tạo danh mục
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 px-8 rounded disabled:bg-gray-200"
              disabled={isLoading}
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
