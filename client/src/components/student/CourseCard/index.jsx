import React from "react";

const CourseCard = ({ course }) => {
  return (
    <div>
      <img src={course.courseThumbnail} alt="" />
      <div>
        <h3>{course.courseTitle}</h3>
        <p>{course.educator.name}</p>
        <div>
          <p>4.5</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
