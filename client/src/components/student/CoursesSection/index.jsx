import { AppContext } from "../../../context/AppContext";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../CourseCard";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-16 md:px-40 px-8 text-center">
      <h2 className="text-3xl font-medium text-gray-800 mb-3">
        Khóa học nổi bật
      </h2>
      <p className="text-sm md:text-base text-gray-500">
        Những khóa học nổi bật dành cho lập trình viên! Học kiến thức chuyên
        sâu, công nghệ hiện đại, thực hành dự án thực tế từ chuyên gia, sẵn sàng
        bứt phá trong sự nghiệp công nghệ!
      </p>
      <div className="grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4">
        {allCourses && Array.isArray(allCourses) && allCourses.length > 0 ? (
          allCourses
            .slice(0, 4)
            .map((course, index) => (
              <CourseCard key={course._id || index} course={course} />
            ))
        ) : (
          <p>Không có khóa học nào</p>
        )}
      </div>
      <Link
        to={"/course-list"}
        onClick={() => scrollTo(0, 0)}
        className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded"
      >
        Show all courses
      </Link>
    </div>
  );
};

export default CoursesSection;
