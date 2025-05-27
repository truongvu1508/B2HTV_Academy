/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/student/Navbar";
import Footer from "../../../components/student/Footer";
import SearchBar from "../../../components/student/SearchBar";
import { AppContext } from "../../../context/AppContext";
import { useParams } from "react-router-dom";
import CourseCard from "../../../components/student/CourseCard";
import { BiX, BiChevronDown } from "react-icons/bi";
import BackToTop from "../../../components/client/BackToTop";
import { Helmet } from "react-helmet";
import axios from "axios";
import { toast } from "react-toastify";

const CoursesList = () => {
  const { navigate, allCourses, backendUrl } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [detailedCourses, setDetailedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
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

  // Handle category filter toggle
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    if (input) {
      navigate("/course-list");
    }
  };

  // Filter courses based on search input and selected categories
  const filterCourses = (courses) => {
    let filtered = courses.slice();

    // Filter by search input
    if (input) {
      filtered = filtered.filter((item) =>
        item.courseTitle.toLowerCase().includes(input.toLowerCase())
      );
    }

    // Filter by selected categories
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
      <div className="relative md:px-36 px-8 pt-10 text-left">
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

        {/* Filter Section */}
        <div className="mt-8 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                disabled={loadingCategories}
              >
                <span className="text-gray-700">
                  {selectedCategories.length > 0
                    ? `Danh mục (${selectedCategories.length})`
                    : "Chọn danh mục"}
                </span>
                <BiChevronDown
                  className={`transition-transform ${
                    showCategoryFilter ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showCategoryFilter && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {loadingCategories ? (
                      <div className="p-4 text-center text-gray-500">
                        Đang tải danh mục...
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <label
                          key={category._id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category._id)}
                            onChange={() => handleCategoryToggle(category._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {category.name}
                          </span>
                        </label>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Không có danh mục nào
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {(selectedCategories.length > 0 || input) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mt-4">
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
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 my-16 gap-x-3 gap-y-10 px-2 md:p-0">
          {loading ? (
            // Display skeleton cards while loading
            Array(6)
              .fill(0)
              .map((_, index) => (
                <CourseCard key={`skeleton-${index}`} loading={true} />
              ))
          ) : filteredCourse.length > 0 ? (
            // Display actual course cards when data is available
            filteredCourse.map((course, index) => (
              <CourseCard
                key={course._id}
                course={course}
                courseData={detailedCourses[index]}
                loading={false}
              />
            ))
          ) : (
            // Display message when no courses match the search
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-600">
                Không tìm thấy khóa học nào phù hợp.
              </p>
              {(input || selectedCategories.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xóa bộ lọc và xem tất cả khóa học
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

export default CoursesList;
