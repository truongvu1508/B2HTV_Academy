import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import Quill from "quill";
import { FiUpload } from "react-icons/fi";
import { RiArrowDropDownLine, RiCloseFill } from "react-icons/ri";
import { FaPlus, FaEdit } from "react-icons/fa";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const navigate = useNavigate();

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showChapterPopup, setShowChapterPopup] = useState(false);
  const [showChapterEditPopup, setShowChapterEditPopup] = useState(false);
  const [showDeleteChapterModal, setShowDeleteChapterModal] = useState(false);
  const [showDeleteLectureModal, setShowDeleteLectureModal] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [isEditingLecture, setIsEditingLecture] = useState(false);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  // Initialize Quill editor
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      const handleTextChange = () => {
        // Update course description when Quill content changes
      };
      quillRef.current.on("text-change", handleTextChange);

      return () => {
        quillRef.current.off("text-change");
        quillRef.current = null;
      };
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      setChapterTitle("");
      setShowChapterPopup(true);
    } else if (action === "remove") {
      setSelectedChapterId(chapterId);
      setShowDeleteChapterModal(true);
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    } else if (action === "edit") {
      const chapter = chapters.find((ch) => ch.chapterId === chapterId);
      if (chapter) {
        setCurrentChapterId(chapterId);
        setChapterTitle(chapter.chapterTitle);
        setShowChapterEditPopup(true);
      }
    }
  };

  const addChapter = () => {
    if (chapterTitle.trim()) {
      const newChapter = {
        chapterId: uniqid(),
        chapterTitle,
        chapterContent: [],
        collapsed: false,
        chapterOrder:
          chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
      };
      setChapters([...chapters, newChapter]);
      setChapterTitle("");
      setShowChapterPopup(false);
      toast.success("Thêm chương mới thành công");
    } else {
      toast.error("Tên chương không được để trống");
    }
  };

  const handleEditChapterTitle = () => {
    if (!chapterTitle.trim()) {
      toast.error("Tên chương không được để trống");
      return;
    }

    setChapters(
      chapters.map((chapter) =>
        chapter.chapterId === currentChapterId
          ? { ...chapter, chapterTitle }
          : chapter
      )
    );

    setShowChapterEditPopup(false);
    setCurrentChapterId(null);
    setChapterTitle("");
    toast.success("Cập nhật tên chương thành công");
  };

  const confirmDeleteChapter = () => {
    if (!selectedChapterId) return;

    setChapters(
      chapters.filter((chapter) => chapter.chapterId !== selectedChapterId)
    );
    toast.success("Xóa chương thành công!");
    setShowDeleteChapterModal(false);
    setSelectedChapterId(null);
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
      const chapter = chapters.find((ch) => ch.chapterId === chapterId);
      if (chapter) {
        setSelectedLecture({
          chapterId,
          lectureIndex,
          lectureTitle: chapter.chapterContent[lectureIndex].lectureTitle,
        });
        setShowDeleteLectureModal(true);
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

  const confirmDeleteLecture = () => {
    if (!selectedLecture) return;

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === selectedLecture.chapterId) {
          const updatedContent = chapter.chapterContent
            .filter((_, idx) => idx !== selectedLecture.lectureIndex)
            .map((lecture, idx) => ({
              ...lecture,
              lectureOrder: idx + 1,
            }));
          return { ...chapter, chapterContent: updatedContent };
        }
        return chapter;
      })
    );
    toast.success("Xóa bài giảng thành công!");
    setShowDeleteLectureModal(false);
    setSelectedLecture(null);
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
            toast.success("Cập nhật bài giảng thành công!");
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
            toast.success("Thêm bài giảng thành công!");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseTitle.trim()) {
      toast.error("Tiêu đề khóa học là bắt buộc.");
      return;
    }
    if (coursePrice < 0) {
      toast.error("Giá khóa học không thể âm.");
      return;
    }
    if (discount < 0 || discount > 100) {
      toast.error("Giảm giá phải từ 0 đến 100.");
      return;
    }
    if (!quillRef.current.root.innerHTML.trim()) {
      toast.error("Mô tả khóa học là bắt buộc.");
      return;
    }
    if (!image) {
      toast.error("Hình ảnh khóa học là bắt buộc.");
      return;
    }

    const courseData = {
      courseTitle,
      courseDescription: quillRef.current.root.innerHTML,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseContent: chapters.map((chapter) => ({
        chapterId: chapter.chapterId,
        chapterTitle: chapter.chapterTitle,
        chapterContent: chapter.chapterContent,
        chapterOrder: chapter.chapterOrder,
      })),
    };

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("image", image);

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
        navigate("/educator/my-course");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Tạo khóa học thất bại: " + error.message);
    }
  };

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleSubmit}>
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
              <p>Ảnh</p>
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
                {image && (
                  <div className="flex items-center gap-2">
                    <img
                      className="max-h-10"
                      src={URL.createObjectURL(image)}
                      alt="Hình ảnh khóa học"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="text-red-500 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                )}
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

          {/* Chapters & Lectures */}
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
                  <div className="flex items-center gap-3">
                    <span className="text-green-500">
                      {chapter.chapterContent.length} Bài giảng
                    </span>
                    <div className="flex gap-1">
                      <FaEdit
                        className="cursor-pointer text-blue-500"
                        onClick={() => handleChapter("edit", chapter.chapterId)}
                        title="Chỉnh sửa tên chương"
                      />
                      <RiCloseFill
                        className="cursor-pointer text-red-500"
                        onClick={() =>
                          handleChapter("remove", chapter.chapterId)
                        }
                        title="Xóa chương"
                      />
                    </div>
                  </div>
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
                            Video
                          </a>{" "}
                          -{" "}
                          <span
                            className={
                              lecture.isPreviewFree
                                ? "text-green-500"
                                : "text-yellow-500"
                            }
                          >
                            {lecture.isPreviewFree ? "Miễn phí" : "Trả phí"}
                          </span>
                        </span>
                        <div className="flex gap-2">
                          <FaEdit
                            className="text-blue-500 cursor-pointer"
                            onClick={() =>
                              handleLecture(
                                "edit",
                                chapter.chapterId,
                                lectureIndex
                              )
                            }
                            title="Chỉnh sửa bài giảng"
                          />
                          <RiCloseFill
                            onClick={() =>
                              handleLecture(
                                "remove",
                                chapter.chapterId,
                                lectureIndex
                              )
                            }
                            className="cursor-pointer text-red-500"
                            title="Xóa bài giảng"
                          />
                        </div>
                      </div>
                    ))}
                    <div
                      className="inline-flex bg-gray-100 p-3 rounded cursor-pointer mt-2 items-center text-blue-500"
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
            className="flex justify-center items-center bg-blue-100 p-3 rounded-lg cursor-pointer"
            onClick={() => handleChapter("add")}
          >
            <FaPlus className="mr-1" /> Thêm chương
          </div>

          {/* Chapter Popup */}
          {showChapterPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Thêm chương mới</h3>
                  <RiCloseFill
                    onClick={() => {
                      setShowChapterPopup(false);
                      setChapterTitle("");
                    }}
                    className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên chương
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="Nhập tên chương"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowChapterPopup(false);
                      setChapterTitle("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={addChapter}
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chapter Edit Popup */}
          {showChapterEditPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white text-gray-700 p-6 rounded relative w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                  Chỉnh sửa tên chương
                </h2>
                <div className="mb-4">
                  <p>Tên chương</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-2 px-3"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="Nhập tên chương"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleEditChapterTitle}
                    type="button"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => {
                      setShowChapterEditPopup(false);
                      setCurrentChapterId(null);
                      setChapterTitle("");
                    }}
                    type="button"
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
                <RiCloseFill
                  onClick={() => {
                    setShowChapterEditPopup(false);
                    setCurrentChapterId(null);
                    setChapterTitle("");
                  }}
                  className="absolute top-2 right-2 text-2xl cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Lecture Popup */}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {isEditingLecture
                      ? "Chỉnh sửa bài giảng"
                      : "Thêm bài giảng"}
                  </h3>
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
                    className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề bài giảng
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời lượng (phút)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value,
                      })
                    }
                    placeholder="Nhập thời lượng bài giảng"
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL bài giảng
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureUrl: e.target.value,
                      })
                    }
                    placeholder="Nhập liên kết của bài giảng"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Xem trước miễn phí?
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
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
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={addOrUpdateLecture}
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {isEditingLecture ? "Cập nhật" : "Thêm bài giảng"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Chapter Confirmation Modal */}
          {showDeleteChapterModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Xác nhận xóa chương
                </h3>
                <p>
                  Bạn có chắc muốn xóa chương "
                  {
                    chapters.find((ch) => ch.chapterId === selectedChapterId)
                      ?.chapterTitle
                  }
                  " không?
                </p>
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteChapterModal(false);
                      setSelectedChapterId(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmDeleteChapter}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Lecture Confirmation Modal */}
          {showDeleteLectureModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Xác nhận xóa bài giảng
                </h3>
                <p>
                  Bạn có chắc muốn xóa bài giảng "
                  {selectedLecture?.lectureTitle}" không?
                </p>
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteLectureModal(false);
                      setSelectedLecture(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmDeleteLecture}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 my-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-8 rounded"
          >
            Tạo khóa học
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
