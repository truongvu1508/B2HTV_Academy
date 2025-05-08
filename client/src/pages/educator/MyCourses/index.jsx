/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import Loading from "../../../components/student/Loading";
import { FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      data.success && setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này không?")) {
      return;
    }

    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `${backendUrl}/api/educator/delete-course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setCourses(courses.filter((course) => course._id !== courseId));
        toast.success("Khóa học đã được xóa");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Xóa khóa học thất bại: " + error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

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
                  Tất cả khóa học
                </th>
                <th className="px-4 py-3 font-semibold truncate">Doanh thu</th>
                <th className="px-4 py-3 font-semibold truncate">Học viên</th>
                <th className="px-4 py-3 font-semibold truncate">Ngày đăng</th>
                <th className="px-4 py-3 font-semibold truncate"></th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="w-32 h-24 aspect-square overflow-hidden">
                      <img
                        src={course.courseThumbnail}
                        alt="Course Image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length === 0
                      ? `0 ${currency}`
                      : `${(
                          course.enrolledStudents.length *
                          (course.coursePrice *
                            (1 - (course.discount || 0) / 100))
                        ).toFixed(0)} ${currency}`}
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
                      <button
                        onClick={() => deleteCourse(course._id)}
                        className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600 text-xs"
                      >
                        <FaTrash />
                      </button>
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
