/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/student/Navbar";
import Footer from "../../../components/student/Footer";
import SearchBar from "../../../components/student/SearchBar";
import { AppContext } from "../../../context/AppContext";
import { useParams } from "react-router-dom";
import CourseCard from "../../../components/student/CourseCard";
import { BiX } from "react-icons/bi";
import BackToTop from "../../../components/client/BackToTop";
import { Helmet } from "react-helmet";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets";

const CoursesList = () => {
  const { navigate, allCourses, backendUrl } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [detailedCourses, setDetailedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(`${backendUrl}/api/category`);
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error("Lỗi khi tải danh mục");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      toast.error("Lỗi khi tải danh mục");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchDetailedCourses = async (courses) => {
    setLoading(true);
    try {
      const courseDataPromises = courses.map((course) =>
        axios.get(`${backendUrl}/api/course/${course._id}`)
      );
      const responses = await Promise.all(courseDataPromises);
      const detailedData = responses.map((res) => {
        if (res.data.success) {
          return res.data.courseData;
        } else {
          toast.error(res.data.message);
          return null;
        }
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return detailedData.filter((data) => data !== null);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      toast.error("Lỗi khi lấy dữ liệu khóa học");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cho phep chon nhieu danh muc
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Xoa loc
  const clearAllFilters = () => {
    setSelectedCategories([]);
    if (input) {
      navigate("/course-list");
    }
  };

  const filterCourses = (courses) => {
    let filtered = courses.slice();

    // Loc theo Search
    if (input) {
      filtered = filtered.filter((item) =>
        item.courseTitle.toLowerCase().includes(input.toLowerCase())
      );
    }

    // Loc theo danh muc da chon
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((course) =>
        selectedCategories.includes(course.category?._id || course.category)
      );
    }

    return filtered;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const filtered = filterCourses(allCourses);

      fetchDetailedCourses(filtered).then((detailedData) => {
        setFilteredCourse(filtered);
        setDetailedCourses(detailedData);
      });
    }
  }, [allCourses, input, selectedCategories, backendUrl]);

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Danh mục";
  };

  return (
    <>
      <Helmet>
        <title>Khóa học</title>
      </Helmet>
      <Navbar />
      <div className="relative md:px-10 px-8 pb-8 pt-10 text-left">
        <p className="text-gray-500 pb-10">
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>{" "}
          / <span>Danh sách khóa học</span>
        </p>

        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Danh sách khóa học
            </h1>
          </div>
          <SearchBar data={input} />
        </div>

        {(input || selectedCategories.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-8 mb-4">
            {input && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span>Tìm kiếm: {input}</span>
                <BiX
                  className="cursor-pointer hover:bg-blue-200 rounded-full"
                  onClick={() => navigate("/course-list")}
                />
              </div>
            )}

            {selectedCategories.map((categoryId) => (
              <div
                key={categoryId}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                <span>{getCategoryName(categoryId)}</span>
                <BiX
                  className="cursor-pointer hover:bg-green-200 rounded-full"
                  onClick={() => handleCategoryToggle(categoryId)}
                />
              </div>
            ))}

            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Left Sidebar - Category Filter */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 lg:sticky lg:top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Lọc theo danh mục
              </h3>

              {loadingCategories ? (
                <div className="text-center py-4 text-gray-500">
                  Đang tải danh mục...
                </div>
              ) : categories.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category._id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryToggle(category._id)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Không có danh mục nào
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Courses */}
          <div className="flex-1 min-w-0">
            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <CourseCard key={`skeleton-${index}`} loading={true} />
                  ))
              ) : filteredCourse.length > 0 ? (
                filteredCourse.map((course, index) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    courseData={detailedCourses[index]}
                    loading={false}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 flex flex-col items-center">
                  <img src={assets.nodata} alt="" />
                  <p className="text-lg text-gray-600">
                    Không tìm thấy khóa học nào phù hợp.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

export default CoursesList;
