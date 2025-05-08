import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import Quill from "quill";
import { FiUpload } from "react-icons/fi";
import { RiArrowDropDownLine, RiCloseFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../../components/student/Loading";

const UpdateCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(null);
  const [isEditingLecture, setIsEditingLecture] = useState(false);
  const [error, setError] = useState("");
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${backendUrl}/api/course/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          const course = data.courseData;
          setCourseTitle(course.courseTitle);
          setCourseDescription(course.courseDescription);
          setCoursePrice(course.coursePrice);
          setDiscount(course.discount || 0);
          setExistingImage(course.courseThumbnail);
          setChapters(
            course.courseContent.map((chapter) => ({
              ...chapter,
              collapsed: false,
            }))
          );
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu khóa học: " + error.message);
        setError("Không thể tải dữ liệu khóa học. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, backendUrl, getToken]);

  // Initialize Quill editor
  useEffect(() => {
    if (!isLoading && editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      if (courseDescription) {
        quillRef.current.root.innerHTML = courseDescription;
      }

      quillRef.current.on("text-change", () => {
        setCourseDescription(quillRef.current.root.innerHTML);
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }
    };
  }, [isLoading, courseDescription]);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Nhập tên chương:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      if (window.confirm("Bạn có chắc muốn xóa chương này không?")) {
        setChapters(
          chapters.filter((chapter) => chapter.chapterId !== chapterId)
        );
      }
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setLectureDetails({
        lectureTitle: "",
        lectureDuration: "",
        lectureUrl: "",
        isPreviewFree: false,
      });
      setIsEditingLecture(false);
      setCurrentLectureIndex(null);
      setShowPopup(true);
    } else if (action === "remove") {
      if (window.confirm("Bạn có chắc muốn xóa bài giảng này không?")) {
        setChapters(
          chapters.map((chapter) => {
            if (chapter.chapterId === chapterId) {
              const updatedContent = chapter.chapterContent
                .filter((_, idx) => idx !== lectureIndex)
                .map((lecture, idx) => ({
                  ...lecture,
                  lectureOrder: idx + 1,
                }));
              return { ...chapter, chapterContent: updatedContent };
            }
            return chapter;
          })
        );
      }
    } else if (action === "edit") {
      const chapter = chapters.find((ch) => ch.chapterId === chapterId);
      if (chapter) {
        const lecture = chapter.chapterContent[lectureIndex];
        setLectureDetails({
          lectureTitle: lecture.lectureTitle,
          lectureDuration: lecture.lectureDuration,
          lectureUrl: lecture.lectureUrl,
          isPreviewFree: lecture.isPreviewFree,
        });
        setCurrentChapterId(chapterId);
        setCurrentLectureIndex(lectureIndex);
        setIsEditingLecture(true);
        setShowPopup(true);
      }
    }
  };

  const addOrUpdateLecture = () => {
    if (!lectureDetails.lectureTitle.trim()) {
      toast.error("Tiêu đề bài giảng là bắt buộc.");
      return;
    }
    if (
      !lectureDetails.lectureDuration ||
      isNaN(lectureDetails.lectureDuration)
    ) {
      toast.error("Thời lượng bài giảng phải là số hợp lệ.");
      return;
    }
    if (!lectureDetails.lectureUrl.trim()) {
      toast.error("URL bài giảng là bắt buộc.");
      return;
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          if (isEditingLecture) {
            const updatedContent = [...chapter.chapterContent];
            updatedContent[currentLectureIndex] = {
              ...updatedContent[currentLectureIndex],
              ...lectureDetails,
            };
            return { ...chapter, chapterContent: updatedContent };
          } else {
            const newLecture = {
              ...lectureDetails,
              lectureOrder:
                chapter.chapterContent.length > 0
                  ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                  : 1,
              lectureId: uniqid(),
            };
            return {
              ...chapter,
              chapterContent: [...chapter.chapterContent, newLecture],
            };
          }
        }
        return chapter;
      })
    );

    setShowPopup(false);
    setIsEditingLecture(false);
    setCurrentLectureIndex(null);
    setCurrentChapterId(null);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!courseTitle.trim()) {
      setError("Tiêu đề khóa học là bắt buộc.");
      return;
    }
    if (coursePrice < 0) {
      setError("Giá khóa học không thể âm.");
      return;
    }
    if (discount < 0 || discount > 100) {
      setError("Giảm giá phải từ 0 đến 100.");
      return;
    }
    if (!courseDescription.trim()) {
      setError("Mô tả khóa học là bắt buộc.");
      return;
    }
    if (!existingImage && !image) {
      setError("Hình thu nhỏ khóa học là bắt buộc.");
      return;
    }

    const courseData = {
      courseTitle,
      courseDescription,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseContent: chapters,
    };

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/educator/update-course/${courseId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/educator/my-courses");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Cập nhật khóa học thất bại: " + error.message);
      setError("Cập nhật khóa học thất bại. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleUpdateCourse}>
        <div className="flex flex-col gap-5">
          <p>Tiêu đề khóa học</p>
          <input
            type="text"
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            placeholder="Nhập tiêu đề"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
          />
          <div className="flex flex-col gap-1">
            <p>Mô tả khóa học</p>
            <div ref={editorRef}></div>
          </div>
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex flex-col gap-1">
              <p>Giá khóa học</p>
              <input
                type="number"
                onChange={(e) => setCoursePrice(e.target.value)}
                value={coursePrice}
                placeholder="0"
                min="0"
                className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
              />
            </div>
            <div className="flex md:flex-row flex-col items-center gap-3">
              <p>Hình thu nhỏ khóa học</p>
              <label
                htmlFor="thumbnailImage"
                className="flex items-center gap-3"
              >
                <FiUpload className="text-3xl cursor-pointer hover:text-gray-700" />
                <input
                  type="file"
                  id="thumbnailImage"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  hidden
                />
                {image ? (
                  <div className="flex items-center gap-2">
                    <img
                      className="max-h-10"
                      src={URL.createObjectURL(image)}
                      alt="Hình thu nhỏ mới"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="text-red-500 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                ) : existingImage ? (
                  <div className="flex items-center gap-2">
                    <img
                      className="max-h-10"
                      src={existingImage}
                      alt="Hình thu nhỏ hiện tại"
                    />
                    <span className="text-sm text-gray-500">(Hiện tại)</span>
                  </div>
                ) : null}
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p>Giảm giá (%)</p>
            <input
              onChange={(e) => setDiscount(e.target.value)}
              type="number"
              value={discount}
              placeholder="0"
              min="0"
              max="100"
              className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
            />
          </div>

          {/* Quản lý chương và bài giảng */}
          <div>
            {chapters.map((chapter, chapterIndex) => (
              <div
                key={chapter.chapterId}
                className="bg-white border rounded-lg mb-4"
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="flex items-center">
                    <RiArrowDropDownLine
                      onClick={() => handleChapter("toggle", chapter.chapterId)}
                      className={`text-2xl cursor-pointer transition-all ${
                        chapter.collapsed ? "-rotate-90" : ""
                      }`}
                    />
                    <span className="font-semibold">
                      {chapterIndex + 1}. {chapter.chapterTitle}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {chapter.chapterContent.length} Bài giảng
                  </span>
                  <RiCloseFill
                    className="cursor-pointer"
                    onClick={() => handleChapter("remove", chapter.chapterId)}
                  />
                </div>
                {!chapter.collapsed && (
                  <div className="p-4">
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div
                        key={lecture.lectureId}
                        className="flex justify-between items-center mb-2 p-2 hover:bg-gray-50 rounded"
                      >
                        <span>
                          {chapterIndex + 1}.{lectureIndex + 1}.{" "}
                          {lecture.lectureTitle} - {lecture.lectureDuration}{" "}
                          phút -{" "}
                          <a
                            href={lecture.lectureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            Liên kết
                          </a>{" "}
                          -{" "}
                          {lecture.isPreviewFree
                            ? "Xem trước miễn phí"
                            : "Trả phí"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleLecture(
                                "edit",
                                chapter.chapterId,
                                lectureIndex
                              )
                            }
                            className="text-blue-500 hover:underline"
                          >
                            Chỉnh sửa
                          </button>
                          <RiCloseFill
                            onClick={() =>
                              handleLecture(
                                "remove",
                                chapter.chapterId,
                                lectureIndex
                              )
                            }
                            className="cursor-pointer text-red-500"
                          />
                        </div>
                      </div>
                    ))}
                    <div
                      className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                      onClick={() => handleLecture("add", chapter.chapterId)}
                    >
                      <FaPlus className="mr-1" /> Thêm bài giảng
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
            onClick={() => handleChapter("add")}
          >
            <FaPlus className="mr-1" /> Thêm chương
          </div>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white text-gray-700 p-6 rounded relative w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                  {isEditingLecture ? "Chỉnh sửa bài giảng" : "Thêm bài giảng"}
                </h2>
                <div className="mb-4">
                  <p>Tiêu đề bài giảng</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-2 px-3"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureTitle: e.target.value,
                      })
                    }
                    placeholder="Nhập tiêu đề bài giảng"
                  />
                </div>
                <div className="mb-4">
                  <p>Thời lượng (phút)</p>
                  <input
                    type="number"
                    className="mt-1 block w-full border rounded py-2 px-3"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value,
                      })
                    }
                    placeholder="Nhập thời lượng"
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <p>URL bài giảng</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-2 px-3"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureUrl: e.target.value,
                      })
                    }
                    placeholder="Nhập URL"
                  />
                </div>
                <div className="flex gap-2 my-4 items-center">
                  <input
                    type="checkbox"
                    id="isPreviewFree"
                    className="w-4 h-4"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="isPreviewFree">Xem trước miễn phí?</label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={addOrUpdateLecture}
                    type="button"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {isEditingLecture ? "Cập nhật" : "Thêm"}
                  </button>
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      setIsEditingLecture(false);
                      setCurrentLectureIndex(null);
                      setCurrentChapterId(null);
                      setLectureDetails({
                        lectureTitle: "",
                        lectureDuration: "",
                        lectureUrl: "",
                        isPreviewFree: false,
                      });
                    }}
                    type="button"
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
                <RiCloseFill
                  onClick={() => {
                    setShowPopup(false);
                    setIsEditingLecture(false);
                    setCurrentLectureIndex(null);
                    setCurrentChapterId(null);
                    setLectureDetails({
                      lectureTitle: "",
                      lectureDuration: "",
                      lectureUrl: "",
                      isPreviewFree: false,
                    });
                  }}
                  className="absolute top-2 right-2 text-2xl cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 my-4">{error}</p>}
        <div className="flex gap-4 my-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-8 rounded"
          >
            CẬP NHẬT
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 px-8 rounded"
            onClick={() => navigate("/educator/my-courses")}
          >
            HỦY
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;
