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

const CoursesList = () => {
  const { navigate, allCourses, backendUrl } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [detailedCourses, setDetailedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      const filtered = input
        ? tempCourses.filter((item) =>
            item.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        : tempCourses;

      fetchDetailedCourses(filtered).then((detailedData) => {
        setFilteredCourse(filtered);
        setDetailedCourses(detailedData);
      });
    }
  }, [allCourses, input, backendUrl]);

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

        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-8 text-gray-600">
            <p>{input}</p>
            <BiX
              className="cursor-pointer"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 my-16 gap-3 px-2 md:p-0">
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
