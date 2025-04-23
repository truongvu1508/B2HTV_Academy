import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import Quill from "quill";
import { FiUpload } from "react-icons/fi";
import { RiArrowDropDownLine, RiCloseFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import Loading from "../../../components/student/Loading"; // Assuming same Loading component as MyCourses

const UpdateCourse = () => {
  const { courseId } = useParams(); // Extract courseId from URL
  const navigate = useNavigate(); // For navigation
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

  // Fetch course data when component mounts
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch(`/api/courses/${courseId}`);
        // const data = await response.json();

        // Mock data aligned with MyCourses structure
        const data = {
          _id: courseId,
          courseTitle: "Introduction to JavaScript",
          courseDescription:
            "<p>Learn the basics of JavaScript programming</p>",
          coursePrice: 4000000,
          discount: 10,
          courseThumbnail: "https://example.com/thumbnail.jpg",
          chapters: [
            {
              chapterId: uniqid(),
              chapterTitle: "Introduction",
              chapterContent: [
                {
                  lectureId: uniqid(),
                  lectureTitle: "Welcome to JavaScript",
                  lectureDuration: "10",
                  lectureUrl: "https://example.com/video1",
                  isPreviewFree: true,
                  lectureOrder: 1,
                },
              ],
              collapsed: false,
              chapterOrder: 1,
            },
          ],
          enrolledStudents: [],
          createdAt: new Date().toISOString(),
        };

        // Update state with fetched data
        setCourseTitle(data.courseTitle);
        setCourseDescription(data.courseDescription);
        setCoursePrice(data.coursePrice);
        setDiscount(data.discount || 0); // Fallback for undefined discount
        setExistingImage(data.courseThumbnail);
        setChapters(data.chapters || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to load course data. Please try again.");
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // Initialize Quill editor and set content after data is loaded
  useEffect(() => {
    if (!isLoading && editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      // Set the editor content
      if (courseDescription) {
        try {
          quillRef.current.root.innerHTML = courseDescription;
        } catch (err) {
          console.error("Error setting Quill content:", err);
        }
      }

      // Add listener to update state when content changes
      quillRef.current.on("text-change", () => {
        setCourseDescription(quillRef.current.root.innerHTML);
      });
    }

    // Cleanup Quill instance on unmount
    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }
    };
  }, [isLoading, courseDescription]);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
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
      if (window.confirm("Are you sure you want to delete this chapter?")) {
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
      if (window.confirm("Are you sure you want to delete this lecture?")) {
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
    // Validate lecture details
    if (!lectureDetails.lectureTitle.trim()) {
      alert("Lecture title is required.");
      return;
    }
    if (
      !lectureDetails.lectureDuration ||
      isNaN(lectureDetails.lectureDuration)
    ) {
      alert("Valid lecture duration is required.");
      return;
    }
    if (!lectureDetails.lectureUrl.trim()) {
      alert("Lecture URL is required.");
      return;
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          if (isEditingLecture) {
            // Update existing lecture
            const updatedContent = [...chapter.chapterContent];
            updatedContent[currentLectureIndex] = {
              ...updatedContent[currentLectureIndex],
              ...lectureDetails,
            };
            return { ...chapter, chapterContent: updatedContent };
          } else {
            // Add new lecture
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

    // Reset popup and lecture details
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

    // Validate form
    if (!courseTitle.trim()) {
      setError("Course球员title is required.");
      return;
    }
    if (coursePrice < 0) {
      setError("Course price cannot be negative.");
      return;
    }
    if (discount < 0 || discount > 100) {
      setError("Discount must be between 0 and 100.");
      return;
    }
    if (!courseDescription.trim()) {
      setError("Course description is required.");
      return;
    }

    // Prepare form data for image upload
    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }

    // Course data to update
    const updatedCourseData = {
      courseTitle,
      courseDescription,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      chapters,
      courseThumbnail: image
        ? "will_be_replaced_by_uploaded_image_url"
        : existingImage,
    };

    try {
      // Replace with your actual API calls
      console.log("Updating course with data:", updatedCourseData);

      // Example API call for image upload
      // if (image) {
      //   const uploadResponse = await fetch('/api/upload', {
      //     method: 'POST',
      //     body: formData,
      //   });
      //   const uploadData = await uploadResponse.json();
      //   updatedCourseData.courseThumbnail = uploadData.imageUrl;
      // }

      // Example API call to update course
      // const response = await fetch(`/api/courses/${courseId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedCourseData),
      // });
      // if (!response.ok) throw new Error('Failed to update course');

      alert("Course updated successfully!");
      navigate("/educator/my-courses"); // Navigate back to MyCourses
    } catch (error) {
      console.error("Error updating course:", error);
      setError("Failed to update course. Please try again.");
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
          <p>Course Title</p>
          <input
            type="text"
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            placeholder="Enter title"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
          />
          <div className="flex flex-col gap-1">
            <p>Course Description</p>
            <div ref={editorRef}></div>
          </div>
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex flex-col gap-1">
              <p>Course Price</p>
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
              <p>Course Thumbnail</p>
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
                      alt="New thumbnail"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : existingImage ? (
                  <div className="flex items-center gap-2">
                    <img
                      className="max-h-10"
                      src={existingImage}
                      alt="Current thumbnail"
                    />
                    <span className="text-sm text-gray-500">(Current)</span>
                  </div>
                ) : null}
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p>Discount %</p>
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

          {/* Managing Chapters & Lectures */}
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
                    {chapter.chapterContent.length} Lectures
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
                          {lectureIndex + 1}. {lecture.lectureTitle} -{" "}
                          {lecture.lectureDuration} mins -{" "}
                          <a
                            href={lecture.lectureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            Link
                          </a>{" "}
                          - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
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
                            Edit
                          </button>
                          <RiCloseFill
                            onClick={() =>
                              handleLecture(
                                "remove",
                                chapter.chapterId,
                                lectureIndex
                              )
                            }
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                    <div
                      className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                      onClick={() => handleLecture("add", chapter.chapterId)}
                    >
                      <FaPlus className="mr-1" /> Add Lecture
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
            <FaPlus className="mr-1" /> Add Chapter
          </div>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white text-gray-700 p-6 rounded relative w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                  {isEditingLecture ? "Edit Lecture" : "Add Lecture"}
                </h2>
                <div className="mb-4">
                  <p>Lecture Title</p>
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
                    placeholder="Enter lecture title"
                  />
                </div>
                <div className="mb-4">
                  <p>Duration (minutes)</p>
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
                    placeholder="Enter duration"
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <p>Lecture URL</p>
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
                    placeholder="Enter URL"
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
                  <label htmlFor="isPreviewFree">Is Preview Free?</label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={addOrUpdateLecture}
                    type="button"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {isEditingLecture ? "Update" : "Add"}
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
                    Cancel
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
            UPDATE
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 px-8 rounded"
            onClick={() => navigate("/educator/my-courses")}
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;
