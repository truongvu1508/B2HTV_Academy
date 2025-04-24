import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../../components/student/Loading";
import { FaEye } from "react-icons/fa";

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    setCourses(allCourses);
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, [allCourses]);

  return courses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full ">
        <Link to={`/educator/add-course`}>
          <button className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
            Thêm khóa học
          </button>
        </Link>

        <h2 className="text-lg font-medium"> Danh sách khóa học</h2>
        <div>
          <table className="md:table-auto table-fixed w-full overflow-hidden border border-gray-500/20 border-collapse mt-10 bg-white">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">
                  All Courses
                </th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">
                  Published On
                </th>
                <th className="px-4 py-3 font-semibold truncate">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={course.courseThumbnail}
                      alt="Course Image"
                      className="w-16"
                    />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {Math.floor(
                      course.enrolledStudents.length * course.coursePrice -
                        (course.discount * course.coursePrice) / 100
                    )}{" "}
                    {currency}
                  </td>
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Link
                        to={`/educator/update-course/${course._id}`}
                        className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 text-xs"
                      >
                        <FaEye />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
