import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import Category from "../models/Category.js";
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
      return res
        .status(400)
        .json({ success: false, message: "Ảnh không được đính kèm" });
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

    // Kiểm tra các trường bắt buộc
    const { courseTitle, coursePrice, category } = parsedCourseData;
    if (!courseTitle || !coursePrice || !category) {
      return res.status(400).json({
        success: false,
        message: "Tiêu đề, giá và danh mục là bắt buộc",
      });
    }

    // Kiểm tra danh mục
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res
        .status(400)
        .json({ success: false, message: "ID danh mục không hợp lệ" });
    }
    const categoryDoc = await Category.findOne({
      _id: category,
      educator: educatorId,
    });
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: "Danh mục không tồn tại hoặc bạn không có quyền",
      });
    }

    // Gán educator và tạo khóa học
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);

    // Tải ảnh lên Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "course_thumbnails",
    });
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();
    res.json({ success: true, message: "Đã thêm khóa học", course: newCourse });
  } catch (error) {
    console.error("Lỗi thêm khóa học:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ: " + error.message });
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

    // Normalize courseContent to ensure lectureUrl is optional
    if (parsedCourseData.courseContent) {
      parsedCourseData.courseContent = parsedCourseData.courseContent.map(
        (chapter) => ({
          chapterId: chapter.chapterId,
          chapterTitle: chapter.chapterTitle,
          chapterOrder: chapter.chapterOrder,
          chapterContent: chapter.chapterContent.map((lecture) => ({
            lectureId: lecture.lectureId,
            lectureTitle: lecture.lectureTitle,
            lectureDuration: lecture.lectureDuration,
            lectureUrl: lecture.lectureUrl || "", // Normalize to empty string
            isPreviewFree: lecture.isPreviewFree || false,
            lectureOrder: lecture.lectureOrder,
          })),
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
    if (course.educator !== educatorId) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền cập nhật khóa học này",
      });
    }

    // Kiểm tra danh mục nếu được cập nhật
    if (parsedCourseData.category) {
      if (!mongoose.Types.ObjectId.isValid(parsedCourseData.category)) {
        return res
          .status(400)
          .json({ success: false, message: "ID danh mục không hợp lệ" });
      }
      const categoryDoc = await Category.findOne({
        _id: parsedCourseData.category,
        educator: educatorId,
      });
      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Danh mục không tồn tại hoặc bạn không có quyền",
        });
      }
      course.category = parsedCourseData.category;
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

    // Save updated course with relaxed validation
    await course.save({ validateModifiedOnly: true });

    res.json({ success: true, message: "Khóa học đã được cập nhật", course });
  } catch (error) {
    console.error("Lỗi cập nhật khóa học:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ: " + error.message });
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
    if (course.educator !== educatorId) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền xóa khóa học này" });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({ success: true, message: "Khóa học đã được xóa" });
  } catch (error) {
    console.error("Lỗi xóa khóa học:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ: " + error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator }).populate(
      "category",
      "name"
    );

    res.json({ success: true, courses });
  } catch (error) {
    console.error("Lỗi lấy khóa học:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ: " + error.message });
  }
};

// Get Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const timeFrame = req.query.timeFrame || "month"; // Lấy timeFrame từ query params, mặc định là "month"
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

    // Generate sales data based on timeFrame
    const salesByTimeFrame = await generateSalesByTimeFrame(
      purchases,
      timeFrame
    );

    // For Courses
    const enrollmentByMonth = await generateEnrollmentData(courses);

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
        totalStudents,
        salesByMonth: salesByTimeFrame, // Đổi tên để phù hợp với frontend
        enrollmentByMonth,
      },
    });
  } catch (error) {
    console.error("Error in educatorDashboardData:", error);
    res.json({ success: false, message: error.message });
  }
};

// Generate sales data by time frame (month, quarter, year)
const generateSalesByTimeFrame = async (purchases, timeFrame) => {
  const currentYear = new Date().getFullYear();

  if (timeFrame === "month") {
    // Initialization for months
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

    const completedPurchases = purchases.filter(
      (p) => p.status === "completed"
    );

    completedPurchases.forEach((purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      const purchaseYear = purchaseDate.getFullYear();

      if (purchaseYear === currentYear) {
        const monthIndex = purchaseDate.getMonth(); // 0-11
        months[monthIndex].sales += purchase.amount;
      }
    });

    return months;
  } else if (timeFrame === "quarter") {
    // Initialization for quarters
    const quarters = [
      { quarter: "Q1", sales: 0 }, // Jan-Mar
      { quarter: "Q2", sales: 0 }, // Apr-Jun
      { quarter: "Q3", sales: 0 }, // Jul-Sep
      { quarter: "Q4", sales: 0 }, // Oct-Dec
    ];

    const completedPurchases = purchases.filter(
      (p) => p.status === "completed"
    );

    completedPurchases.forEach((purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      const purchaseYear = purchaseDate.getFullYear();
      const month = purchaseDate.getMonth(); // 0-11

      if (purchaseYear === currentYear) {
        const quarterIndex = Math.floor(month / 3); // 0-3
        quarters[quarterIndex].sales += purchase.amount;
      }
    });

    return quarters;
  } else if (timeFrame === "year") {
    // Initialization for years (current year only for simplicity)
    const years = [{ year: currentYear.toString(), sales: 0 }];

    const completedPurchases = purchases.filter(
      (p) => p.status === "completed"
    );

    completedPurchases.forEach((purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      const purchaseYear = purchaseDate.getFullYear();

      if (purchaseYear === currentYear) {
        years[0].sales += purchase.amount;
      }
    });

    return years;
  }

  return [];
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

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "_id name email imageUrl enrolledCourses createdAt updatedAt isLocked"
    );

    const purchaseAggregates = await Purchase.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    const purchaseMap = new Map(
      purchaseAggregates.map((purchase) => [
        purchase._id.toString(),
        purchase.totalSpent,
      ])
    );

    const usersWithTotalSpent = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      enrolledCourses: user.enrolledCourses,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isLocked: user.isLocked,
      totalSpent: purchaseMap.get(user._id.toString()) || 0,
    }));

    res.json(usersWithTotalSpent);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách người dùng",
      error: error.message,
    });
  }
};

// Update User Lock Status
export const updateUserLockStatus = async (req, res) => {
  try {
    const { userId, isLocked } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không được cung cấp",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Update the isLocked status
    user.isLocked = isLocked;
    await user.save();

    return res.json({
      success: true,
      message: isLocked
        ? "Đã khóa tài khoản người dùng thành công"
        : "Đã mở khóa tài khoản người dùng thành công",
    });
  } catch (error) {
    console.error("Error in updateUserLockStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái khóa tài khoản",
      error: error.message,
    });
  }
};

// Get Educator Category
export const getEducatorCategories = async (req, res) => {
  try {
    const educator = req.auth.userId;
    if (!educator) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy ID giáo viên" });
    }
    const categories = await Category.find({ educator });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const educator = req.auth.userId;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Tên danh mục là bắt buộc" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Danh mục đã tồn tại" });
    }

    const newCategory = await Category.create({
      name,
      description,
      educator,
    });
    res.json({
      success: true,
      message: "Đã thêm danh mục",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const educator = req.auth.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID danh mục không hợp lệ" });
    }

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Tên danh mục là bắt buộc" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy danh mục" });
    }

    // Kiểm tra quyền giáo viên
    if (category.educator !== educator) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền cập nhật danh mục này",
      });
    }

    const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Danh mục đã tồn tại" });
    }

    category.name = name || category.name;
    category.description =
      description !== undefined ? description : category.description;

    await category.save();
    res.json({ success: true, message: "Đã cập nhật danh mục", category });
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ: " + error.message });
  }
};
// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const educator = req.auth.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID danh mục không hợp lệ" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy danh mục" });
    }

    // Kiểm tra quyền giáo viên
    if (category.educator !== educator) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền xóa danh mục này" });
    }

    const courseCount = await Course.countDocuments({ category: id });
    if (courseCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa danh mục vì có khóa học đang sử dụng",
      });
    }

    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: "Đã xóa danh mục" });
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ: " + error.message });
  }
};
