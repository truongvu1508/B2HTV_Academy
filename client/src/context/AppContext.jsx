/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

// Cấu hình humanizeDuration cho tiếng Việt
const vietnameseHumanizer = humanizeDuration.humanizer({
  language: "vi",
  languages: {
    vi: {
      h: () => " giờ",
      m: () => " phút",
    },
  },
  delimiter: " ",
  spacer: "",
});

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLockNotified, setIsLockNotified] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch All Courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch UserData
  const fetchUserData = async () => {
    if (user?.publicMetadata.role === "educator") {
      setIsEducator(true);
    }
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        if (data.user.isLocked && !isLockNotified) {
          toast.error(
            <div className="flex items-start space-x-3 p-1">
              <div className="flex-1 text-center">
                <div className="font-bold text-red-700 text-base mb-1">
                  Tài khoản bị khóa
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  Vui lòng liên hệ admin qua số điện thoại{" "}
                  <a
                    href="tel:0987654321"
                    className="font-semibold text-blue-600 hover:text-blue-800 underline"
                  >
                    0987654321
                  </a>{" "}
                  để được hỗ trợ.
                </div>
              </div>
            </div>,
            {
              position: "top-center",
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className:
                "bg-gradient-to-r from-red-50 to-red-100 border border-red-200 shadow-xl rounded-xl",
              bodyClassName: "p-0",
              progressClassName: "bg-gradient-to-r from-red-400 to-red-600",
            }
          );
          setIsLockNotified(true);
          setTimeout(async () => {
            await signOut();
            navigate("/");
          }, 5000);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Function to calculate average rating of course
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length);
  };

  // Function to Calculate Course Chapter Time
  const calculateChapterTime = (chapter) => {
    let time = 0;

    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return vietnameseHumanizer(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to Calculate Course duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );

    return vietnameseHumanizer(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to No of Lectures in the course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;

    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  //Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/user/enrolled-courses",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
