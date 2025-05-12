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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

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

  const deleteCourse = async () => {
    if (!selectedCourseId) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `${backendUrl}/api/educator/delete-course/${selectedCourseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setCourses(courses.filter((course) => course._id !== selectedCourseId));
        toast.success("Khóa học đã được xóa");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Xóa khóa học thất bại: " + error.message);
    } finally {
      setShowConfirmModal(false);
      setSelectedCourseId(null);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  const handleDeleteClick = (courseId) => {
    setSelectedCourseId(courseId);
    setShowConfirmModal(true);
  };

  // Modal confirmation popup
  const ConfirmationModal = () => {
    if (!showConfirmModal || !selectedCourseId) return null;

    const course = courses.find((c) => c._id === selectedCourseId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Xác nhận xóa khóa học</h3>
          <p>
            Bạn có chắc muốn xóa khóa học &quot;
            <span className="font-bold">{course?.courseTitle}</span>&quot;
            không?
          </p>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={deleteCourse}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  };

  return courses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full ">
        <Link to={`/educator/add-course`}>
          <button className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
            Thêm khóa học
          </button>
        </Link>

        <h2 className="text-lg font-bold"> Danh sách khóa học</h2>
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
                        onClick={() => handleDeleteClick(course._id)}
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
      <ConfirmationModal />
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
