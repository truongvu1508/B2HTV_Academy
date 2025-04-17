import React, { useContext } from "react";
import { assets } from "../../../assets/assets";
import AppContext from "antd/es/app/context";

const CourseCard = ({ course }) => {
  const { currency } = useContext(AppContext);

  return (
    <div>
      <img src={course.courseThumbnail} alt="" />
      <div>
        <h3>{course.courseTitle}</h3>
        <p>{course.educator.name}</p>
        <div>
          <p>4.5</p>
          <div>
            {[...Array(5)].map((_, i) => (
              <img key={i} src={assets.star} alt="" />
            ))}
          </div>
          <p>22</p>
        </div>
        <p>
          {(
            course.coursePrice -
            (course.coursePrice * course.courseDiscount) / 100
          ).toFixed(0)}{" "}
          {currency}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
