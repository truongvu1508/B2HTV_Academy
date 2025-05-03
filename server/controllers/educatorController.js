import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
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

    // Collect unique enrolled students
    // Step 1: Get all unique student IDs
    const allStudentIds = new Set();
    courses.forEach((course) => {
      course.enrolledStudents.forEach((studentId) => {
        allStudentIds.add(studentId.toString());
      });
    });

    // Step 2: Fetch student details
    const students = await User.find(
      { _id: { $in: Array.from(allStudentIds) } },
      "name imageUrl"
    );

    // Step 3: Create enrolledStudentsData with course titles
    const enrolledStudentsData = [];
    for (const student of students) {
      // Find courses this student enrolled in
      const enrolledCourses = courses
        .filter((course) => course.enrolledStudents.includes(student._id))
        .map((course) => course.courseTitle);

      enrolledStudentsData.push({
        student: {
          _id: student._id,
          name: student.name,
          imageUrl: student.imageUrl,
        },
        courseTitles: enrolledCourses, // List of course titles
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    console.error("Error in educatorDashboardData:", error);
    res.json({ success: false, message: error.message });
  }
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
