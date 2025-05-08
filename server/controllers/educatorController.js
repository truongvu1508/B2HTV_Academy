import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import mongoose from "mongoose";
// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });
    res.json({
      success: true,
      message: "Đã cập nhật vai trò educator",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Ảnh không được đính kèm" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();
    res.json({ success: true, message: "Đã thêm khóa học" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update Course
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID khóa học không hợp lệ" });
    }

    // Parse courseData
    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu khóa học không hợp lệ" });
    }

    // Remove frontend-only fields (e.g., collapsed)
    if (parsedCourseData.courseContent) {
      parsedCourseData.courseContent = parsedCourseData.courseContent.map(
        (chapter) => ({
          chapterId: chapter.chapterId,
          chapterTitle: chapter.chapterTitle,
          chapterContent: chapter.chapterContent,
          chapterOrder: chapter.chapterOrder,
        })
      );
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khóa học" });
    }

    // Check educator ownership
    if (course.educator.toString() !== educatorId) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền cập nhật khóa học này",
      });
    }

    // Update course fields
    course.courseTitle = parsedCourseData.courseTitle || course.courseTitle;
    course.courseDescription =
      parsedCourseData.courseDescription || course.courseDescription;
    course.coursePrice = parsedCourseData.coursePrice ?? course.coursePrice;
    course.discount = parsedCourseData.discount ?? course.discount;
    course.courseContent =
      parsedCourseData.courseContent || course.courseContent;

    // Handle image upload
    if (imageFile) {
      try {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          folder: "course_thumbnails",
        });
        course.courseThumbnail = imageUpload.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res
          .status(500)
          .json({ success: false, message: "Lỗi khi tải ảnh lên" });
      }
    }

    // Save updated course
    await course.save();

    res.json({ success: true, message: "Khóa học đã được cập nhật" });
  } catch (error) {
    console.error("Error in updateCourse:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.auth.userId;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID khóa học không hợp lệ" });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khóa học" });
    }

    // Check educator ownership
    if (course.educator.toString() !== educatorId) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền xóa khóa học này" });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({ success: true, message: "Khóa học đã được xóa" });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // Calculate total earnings
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Collect unique enrolled student IDs for counting
    const allStudentIds = new Set();
    courses.forEach((course) => {
      course.enrolledStudents.forEach((studentId) => {
        allStudentIds.add(studentId.toString());
      });
    });
    const totalStudents = allStudentIds.size; // Count unique students

    // Collect enrolled students data (keep original logic)
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    // For Months
    const salesByMonth = await generateSalesByMonth(purchases);

    // For Courses
    const enrollmentByMonth = await generateEnrollmentData(courses);

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
        totalStudents,
        salesByMonth,
        enrollmentByMonth,
      },
    });
  } catch (error) {
    console.error("Error in educatorDashboardData:", error);
    res.json({ success: false, message: error.message });
  }
};

// revenue for months
const generateSalesByMonth = async (purchases) => {
  const currentYear = new Date().getFullYear();

  //initialization months
  const months = [
    { month: "T1", sales: 0 },
    { month: "T2", sales: 0 },
    { month: "T3", sales: 0 },
    { month: "T4", sales: 0 },
    { month: "T5", sales: 0 },
    { month: "T6", sales: 0 },
    { month: "T7", sales: 0 },
    { month: "T8", sales: 0 },
    { month: "T9", sales: 0 },
    { month: "T10", sales: 0 },
    { month: "T11", sales: 0 },
    { month: "T12", sales: 0 },
  ];

  const completedPurchases = purchases.filter((p) => p.status === "completed");

  completedPurchases.forEach((purchase) => {
    const purchaseDate = new Date(purchase.createdAt);
    const purchaseYear = purchaseDate.getFullYear();

    if (purchaseYear === currentYear) {
      const monthIndex = purchaseDate.getMonth(); // 0-11
      months[monthIndex].sales += purchase.amount;
    }
  });

  return months;
};

const generateEnrollmentData = async (courses) => {
  return courses.map((course) => ({
    type: course.courseTitle,
    value: course.enrolledStudents.length,
  }));
};

// Get Enrolled Students Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");
    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
