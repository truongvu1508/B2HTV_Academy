import React, { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";
import { FaBookOpenReader, FaUserGraduate } from "react-icons/fa6";
import CourseCardSkeleton from "../CourseCardSkeleton";

const CourseCard = ({ course, courseData, loading }) => {
  const {
    currency,
    calculateRating,
    calculateCourseDuration,
    calculateNoOfLectures,
  } = useContext(AppContext);
  if (loading) {
    return <CourseCardSkeleton />;
  }
  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="relative overflow-hidden rounded-lg flex flex-col h-full"
    >
      <div className="w-full h-80 overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-md border border-gray/20"
          src={course.courseThumbnail}
          alt={course.title || "Course thumbnail"}
        />
      </div>
      <div className="p-3 text-left flex-grow flex flex-col">
        <h3 className="text-base font-extrabold text-dark-1">
          {course.courseTitle}
        </h3>
        <p className="text-gray-500">B2HTV Academy</p>
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(calculateRating(course)) ? (
                  <FaStar className="text-yellow-cs" />
                ) : (
                  <FaStar className="text-gray-300" />
                )}
              </span>
            ))}
          </div>
          <p className="text-gray-500">({course.courseRatings.length})</p>
        </div>
        <div className="flex items-center text-sm md:text-default gap-4 pb-2 border-b border-gray md:pt-4 ">
          <div className="flex items-center gap-1">
            <FaUserGraduate className="mr-1" />
            <p>
              {courseData.enrolledStudents.length} học viên
              {/* {courseData.enrolledStudents.length > 1 ?  "students": "student"} */}
            </p>
          </div>
          <div className="h-4 w-px bg-gray-500/40"></div>
          <div className="flex items-center gap-1">
            <CiClock1 className="mr-1" />
            <p>{calculateCourseDuration(courseData)}</p>
          </div>
          <div className="h-4 w-px bg-gray-500/40"></div>
          <div className="flex items-center gap-1">
            <FaBookOpenReader className="mr-1" />
            <p>{calculateNoOfLectures(courseData)} bài giảng</p>
          </div>
        </div>
        {/* Push the price information to bottom with flex-grow */}
        <div className="flex justify-between mt-auto pt-3">
          <p className="text-base font-bold text-dark-1">
            {(
              course.coursePrice -
              (course.coursePrice * course.discount) / 100
            ).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            {currency}
          </p>
          <p className="line-through">
            {course.coursePrice.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            {currency}
          </p>
        </div>
      </div>
      <div className="absolute top-2 left-2 text-xs px-4 py-1 rounded-xl bg-blue-3 text-white font-semibold">
        Nổi bật
      </div>
      <div className="absolute top-2 right-2 text-xs px-4 py-1 rounded-xl bg-green-1 text-dark-1 font-semibold">
        {course.discount} %
      </div>
    </Link>
  );
};

export default CourseCard;
