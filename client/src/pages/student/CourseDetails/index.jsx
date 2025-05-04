import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../components/student/Navbar";
import Footer from "../../../components/student/Footer";
import Loading from "../../../components/student/Loading";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { FaAngleDown, FaPlayCircle, FaStar } from "react-icons/fa";
import humanizeDuration from "humanize-duration";
import { CiClock1 } from "react-icons/ci";
import { LuAlarmClock } from "react-icons/lu";
import { FaBookOpenReader } from "react-icons/fa6";
import BackToTop from "../../../components/client/BackToTop";
import YouTube from "react-youtube";
import { Helmet } from "react-helmet";
import { Button } from "antd";
import "./CourseDetails.scss";
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

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const [showFullDescription, setShowFullDescription] = useState(false);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Đăng nhập để mua khóa học");
      }
      if (isAlreadyEnrolled) {
        return toast.warn("Đã mua");
      }
      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <>
      <Helmet>
        <title>{courseData.courseTitle}</title>
      </Helmet>
      <Navbar />
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 "></div>
        {/* Left column */}
        <div className="flex-[6] w-full z-10 text-gray-500">
          <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>
          {/* <p
            className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p> */}

          {/* review and rating */}
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {" "}
                  {i < Math.floor(calculateRating(courseData)) ? (
                    <FaStar className="text-yellow-cs" />
                  ) : (
                    <FaStar className="text-gray-300" />
                  )}
                </span>
              ))}
            </div>
            <p className="text-blue-600">
              {courseData.courseRatings.length} Đánh giá
              {/* {courseData.courseRatings.length > 1 ? "ratings" : "rating"}) */}
            </p>
            <p>
              {courseData.enrolledStudents.length} học viên
              {/* {courseData.enrolledStudents.length > 1 ? "students" : "student"} */}
            </p>
          </div>
          <p className="text-sm">
            Khóa học của{" "}
            <span className="text-blue-600 underline">B2HTV Academy</span>
          </p>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">
              Giới thiệu khóa học
            </h3>
            {/* <p
              className="pt-3 "
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            ></p> */}
            <div className="pt-3">
              <div
                dangerouslySetInnerHTML={{
                  __html: showFullDescription
                    ? courseData.courseDescription
                    : courseData.courseDescription.slice(0, 300) + "...",
                }}
              />
              {courseData.courseDescription.length > 300 && (
                <button
                  className="text-blue-600 mt-2 underline text-sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
            </div>
          </div>
          <div className="pb-10 mb-10 text-gray-800">
            <h2 className="text-xl font-semibold">Nội dung khóa học</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-blue-2 text-white"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <FaAngleDown
                        className={`transform transition-transform ${
                          openSections[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="font-medium md:text-base text-sm">
                        {index + 1}. {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} bài giảng -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <FaPlayCircle className="w-4 h-4 mt-1" />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>
                              {index + 1}.{i + 1}. {lecture.lectureTitle}
                            </p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Học thử
                                </p>
                              )}
                              <p>
                                {vietnameseHumanizer(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-[4] w-full z-10 md:sticky md:top-5 pb-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] p-">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img
              className="w-full h-72 object-cover"
              src={courseData.courseThumbnail}
              alt=""
            />
          )}

          <div className="p-3">
            <div className="flex items-center gap-2">
              <LuAlarmClock className="w-4 text-red-500" />
              <p className="text-red-500">
                <span className="font-medium">5 ngày</span> còn lại cho mức giá
                này!
              </p>
            </div>
            <div className="flex gap-3 items-center pt-2 justify-between">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(0)}{" "}
                {currency}
              </p>
              <div>
                <p className="md:text-lg text-gray-500 line-through">
                  {courseData.coursePrice} {currency}
                </p>
                <p className="md:text-lg text-gray-500">
                  {courseData.discount} %
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-cs" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <CiClock1 />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <FaBookOpenReader />
                <p>{calculateNoOfLectures(courseData)} bài giảng</p>
              </div>
            </div>

            <Button
              onClick={enrollCourse}
              className={`courseDetails__button w-full font-semibold text-base text-white bg-blue-2 ${
                isAlreadyEnrolled && " isAlreadyEnrolled"
              }`}
            >
              {isAlreadyEnrolled ? "Đã mua" : "Đăng ký ngay"}
            </Button>

            {/* <button className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button> */}

            <div className="mt-5">
              <p>What's in the course</p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Lifetime access with free updates</li>
                <li>Lifetime access with free updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
