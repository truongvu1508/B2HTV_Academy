/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../../components/student/Loading";

const UpdateCategory = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { categoryId } = useParams(); // Match route param name
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `${backendUrl}/api/educator/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );
        if (response.data.success) {
          const category = response.data.categories.find(
            (cat) => cat._id === categoryId
          );
          if (category) {
            setName(category.name);
            setDescription(category.description || "");
          } else {
            throw new Error("Danh mục không tồn tại.");
          }
        } else {
          throw new Error(response.data.message || "Không thể tải danh mục.");
        }
      } catch (error) {
        toast.error(
          "Lỗi khi tải danh mục: " +
            (error.response?.data?.message || error.message)
        );
        setError("Không thể tải danh mục. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, backendUrl, getToken]);

  // Handle form submission
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Tên danh mục là bắt buộc.");
      toast.error("Tên danh mục là bắt buộc.");
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/educator/update-category/${categoryId}`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/educator/my-category");
      } else {
        throw new Error(data.message || "Cập nhật danh mục thất bại");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Cập nhật danh mục thất bại";
      toast.error("Cập nhật danh mục thất bại: " + errorMessage);
      setError("Cập nhật danh mục thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
        <button
          onClick={() => navigate("/educator/my-category")}
          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleUpdateCategory}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tên danh mục
            </label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Nhập tên danh mục"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Mô tả danh mục
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder="Nhập mô tả danh mục"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 focus:ring-1 focus:ring-blue-500"
              rows="4"
            />
          </div>
        </div>
        {error && <p className="text-red-500 my-4">{error}</p>}
        <div className="flex gap-4 my-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-8 rounded"
          >
            CẬP NHẬT
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 px-8 rounded"
            onClick={() => navigate("/educator/my-category")}
          >
            HỦY
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;
