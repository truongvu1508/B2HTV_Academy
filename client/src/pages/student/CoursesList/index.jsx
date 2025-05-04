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

  // Hàm lấy dữ liệu chi tiết cho tất cả khóa học
  const fetchDetailedCourses = async (courses) => {
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
      return detailedData.filter((data) => data !== null); // Loại bỏ dữ liệu lỗi
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      toast.error("Lỗi khi lấy dữ liệu khóa học");
      return [];
    }
  };

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      // Lọc khóa học theo input
      const filtered = input
        ? tempCourses.filter((item) =>
            item.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        : tempCourses;

      // Lấy dữ liệu chi tiết
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
          {filteredCourse.map((course, index) => (
            <CourseCard
              key={course._id} // Sử dụng _id thay vì index để đảm bảo key duy nhất
              course={course}
              courseData={detailedCourses[index]} // Truyền courseData
            />
          ))}
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

export default CoursesList;
