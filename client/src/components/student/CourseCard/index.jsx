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
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
    >
      <img className="w-full" src={course.courseThumbnail} alt="" />
      <div className="p-3 text-left">
        <h3 className="text-base font-semibold">B2HTV Academy</h3>
        <p className="text-gray-500">{course.educator.name}</p>
        <div className="flex items-center space-x-2">
          {/* <p>{calculateRating(course)}</p> */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {" "}
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
        <div className="flex justify-between mt-2">
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
