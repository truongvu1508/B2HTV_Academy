/* eslint-disable react-hooks/exhaustive-deps */
import { AppContext } from "../../../context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../CourseCard";
import { toast } from "react-toastify";
import axios from "axios";

const CoursesSection = () => {
  const { allCourses, backendUrl } = useContext(AppContext);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [detailedCourses, setDetailedCourses] = useState([]);

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
      return detailedData.filter((data) => data !== null);
    } catch (error) {
      toast.error({ success: false, message: error.message });
      return [];
    }
  };

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const topCourses = allCourses.slice(0, 3);
      setFilteredCourses(topCourses);
      fetchDetailedCourses(topCourses).then((detailedData) => {
        setDetailedCourses(detailedData);
      });
    }
  }, [allCourses, backendUrl]);

  return (
    <div className="py-16 md:px-40 px-8 text-center">
      <h2 className="text-3xl font-bold text-dark-1 mb-3">Khóa học nổi bật</h2>
      <p className="text-sm md:text-base text-dark-1">
        Những khóa học nổi bật dành cho lập trình viên! Học kiến thức chuyên
        sâu, công nghệ hiện đại, thực hành dự án thực tế từ chuyên gia, sẵn sàng
        bứt phá trong sự nghiệp công nghệ!
      </p>

      <div className="grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4">
        {filteredCourses.length > 0 &&
        detailedCourses.length === filteredCourses.length ? (
          filteredCourses.map((course, index) => (
            <CourseCard
              key={course._id}
              course={course}
              courseData={detailedCourses[index]}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">Đang tải khóa học...</p>
        )}
      </div>

      <Link
        to={"/course-list"}
        onClick={() => scrollTo(0, 0)}
        className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded"
      >
        Xem tất cả khóa học
      </Link>
    </div>
  );
};

export default CoursesSection;
