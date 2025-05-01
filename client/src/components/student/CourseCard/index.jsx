import React, { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-500/30 overflow-hidden rounded-lg flex flex-col h-full"
    >
      {/* Fixed height for the image container */}
      <div className="w-full h-80 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={course.courseThumbnail}
          alt={course.title || "Course thumbnail"}
        />
      </div>
      <div className="p-3 text-left flex-grow flex flex-col">
        <h3 className="text-base font-semibold">B2HTV Academy</h3>
        <p className="text-gray-500">{course.educator.name}</p>
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
        {/* Push the price information to bottom with flex-grow */}
        <div className="flex justify-between mt-auto pt-3">
          <p className="text-base font-bold text-dark-1">
            {(
              course.coursePrice -
              (course.coursePrice * course.discount) / 100
            ).toFixed(2)}{" "}
            {currency}
          </p>
          <p className="line-through">
            {course.coursePrice} {currency}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
