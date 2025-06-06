import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { CourseProgress } from "../models/CourseProgress.js";

// Cap nhat vai tro thanh giao vien
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

// Them khoa hoc
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

    // Parse du lieu khoa hoc tu JSON
    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu khóa học không hợp lệ" });
    }

    // Kiem tra cac truong bat buoc
    const { courseTitle, coursePrice, category } = parsedCourseData;
    if (!courseTitle || !coursePrice || !category) {
      return res.status(400).json({
        success: false,
        message: "Tiêu đề, giá và danh mục là bắt buộc",
      });
    }

    // Kiem tra danh muc co hop le va thuoc giao vien khong
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

    // Gan ID giao vien va tao khoa hoc moi
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

// Cap nhat khoa hoc
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    // Kiem tra ID khoa hoc hop le
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID khóa học không hợp lệ" });
    }

    // Parse du lieu khoa hoc
    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu khóa học không hợp lệ" });
    }

    // Chuan hoa noi dung khoa hoc, dam bao lectureUrl khong bat buoc
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
            lectureUrl: lecture.lectureUrl || "",
            isPreviewFree: lecture.isPreviewFree || false,
            lectureOrder: lecture.lectureOrder,
          })),
        })
      );
    }

    // Tim khoa hoc trong DB
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khóa học" });
    }

    // Kiem tra quyen so huu khoa hoc
    if (course.educator !== educatorId) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền cập nhật khóa học này",
      });
    }

    // Kiem tra danh muc neu duoc cap nhat
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

    // Cap nhat cac truong cua khoa hoc
    course.courseTitle = parsedCourseData.courseTitle || course.courseTitle;
    course.courseDescription =
      parsedCourseData.courseDescription || course.courseDescription;
    course.coursePrice = parsedCourseData.coursePrice ?? course.coursePrice;
    course.discount = parsedCourseData.discount ?? course.discount;
    course.courseContent =
      parsedCourseData.courseContent || course.courseContent;

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

    await course.save({ validateModifiedOnly: true });

    res.json({ success: true, message: "Khóa học đã được cập nhật", course });
  } catch (error) {
    console.error("Lỗi cập nhật khóa học:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ: " + error.message });
  }
};

// Xoa khoa hoc
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.auth.userId;

    // Kiem tra ID khoa hoc hop le
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID khóa học không hợp lệ" });
    }

    // Tim khoa hoc
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khóa học" });
    }

    // Kiem tra quyen so huu
    if (course.educator !== educatorId) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền xóa khóa học này" });
    }

    await Course.findByIdAndDelete(courseId);

    res.json({ success: true, message: "Khóa học đã được xóa" });
  } catch (error) {
    console.error("Lỗi xóa khóa học:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ: " + error.message });
  }
};

// Lay danh sach khoa hoc cua giao vien
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    // Tim khoa hoc va populate ten danh muc
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

// Lay du lieu dashboard giao vien
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const timeFrame = req.query.timeFrame || "month";
    const pieChartType = req.query.pieChartType || "course";

    // Tim tat ca khoa hoc cua giao vien
    const courses = await Course.find({ educator }).populate(
      "category",
      "name"
    );
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // Tinh tong doanh thu tu giao dich
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Tinh tong so hoc vien
    const allStudentIds = new Set();
    courses.forEach((course) => {
      course.enrolledStudents.forEach((studentId) => {
        allStudentIds.add(studentId.toString());
      });
    });
    const totalStudents = allStudentIds.size;

    // Lay du lieu hoc vien da ghi danh
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

    // Tao du lieu doanh thu theo khung thoi gian
    const salesByTimeFrame = await generateSalesByTimeFrame(
      purchases,
      timeFrame
    );

    // Tao du lieu ghi danh theo loai bieu do
    const enrollmentByChart = await generateEnrollmentData(
      courses,
      pieChartType
    );

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
        totalStudents,
        salesByMonth: salesByTimeFrame,
        enrollmentByMonth: enrollmentByChart,
      },
    });
  } catch (error) {
    console.error("Error in educatorDashboardData:", error);
    res.json({ success: false, message: error.message });
  }
};

// Tao du lieu ghi danh cho bieu do
const generateEnrollmentData = async (courses, chartType = "course") => {
  if (chartType === "category") {
    // Nhom theo danh muc
    const categoryData = {};

    courses.forEach((course) => {
      const categoryName = course.category?.name || "Không có danh mục";
      const enrollmentCount = course.enrolledStudents.length;

      if (categoryData[categoryName]) {
        categoryData[categoryName] += enrollmentCount;
      } else {
        categoryData[categoryName] = enrollmentCount;
      }
    });

    // Chuyen thanh mang cho bieu do
    return Object.keys(categoryData).map((categoryName) => ({
      type: categoryName,
      value: categoryData[categoryName],
    }));
  } else {
    // Nhom theo khoa hoc
    return courses.map((course) => ({
      type: course.courseTitle,
      value: course.enrolledStudents.length,
    }));
  }
};

// Tao du lieu doanh thu theo khung thoi gian
const generateSalesByTimeFrame = async (purchases, timeFrame) => {
  const currentYear = new Date().getFullYear(); // Lay nam hien tai

  if (timeFrame === "month") {
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
        const monthIndex = purchaseDate.getMonth();
        months[monthIndex].sales += purchase.amount;
      }
    });

    return months;
  } else if (timeFrame === "quarter") {
    const quarters = [
      { quarter: "Q1", sales: 0 },
      { quarter: "Q2", sales: 0 },
      { quarter: "Q3", sales: 0 },
      { quarter: "Q4", sales: 0 },
    ];

    const completedPurchases = purchases.filter(
      (p) => p.status === "completed"
    );

    // Tinh doanh thu theo quy
    completedPurchases.forEach((purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      const purchaseYear = purchaseDate.getFullYear();
      const month = purchaseDate.getMonth();

      if (purchaseYear === currentYear) {
        const quarterIndex = Math.floor(month / 3);
        quarters[quarterIndex].sales += purchase.amount;
      }
    });

    return quarters;
  } else if (timeFrame === "year") {
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

// const generateEnrollmentData = async (courses) => {
//   return courses.map((course) => ({
//     type: course.courseTitle,
//     value: course.enrolledStudents.length,
//   }));
// };

// Lay du lieu hoc vien ghi danh
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    // Tim khoa hoc cua giao vien va populate danh muc
    const courses = await Course.find({ educator }).populate(
      "category",
      "name description"
    );
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate({
        path: "courseId",
        select: "courseTitle category courseContent",
        populate: {
          path: "category",
          select: "name description",
        },
      });

    // Lay du lieu tien do hoc tap
    const courseProgressData = await CourseProgress.find({
      courseId: { $in: courseIds.map((id) => id.toString()) },
    });

    // Tao map de tra cuu tien do nhanh
    const progressMap = new Map();
    courseProgressData.forEach((progress) => {
      const key = `${progress.userId}-${progress.courseId}`;
      progressMap.set(key, progress);
    });

    // Tao danh sach hoc vien ghi danh
    const enrolledStudents = purchases.map((purchase) => {
      const progressKey = `${purchase.userId._id}-${purchase.courseId._id}`;
      const progress = progressMap.get(progressKey);

      // Tinh tong so bai giang
      let totalLectures = 0;
      if (purchase.courseId.courseContent) {
        purchase.courseId.courseContent.forEach((chapter) => {
          if (chapter.chapterContent) {
            totalLectures += chapter.chapterContent.length;
          }
        });
      }

      // Tinh so bai giang da hoan thanh va ty le tien do
      const completedLectures = progress ? progress.lectureCompleted.length : 0;
      const progressPercentage =
        totalLectures > 0
          ? Math.round((completedLectures / totalLectures) * 100)
          : 0;

      return {
        student: purchase.userId,
        courseTitle: purchase.courseId.courseTitle,
        course: {
          _id: purchase.courseId._id,
          courseTitle: purchase.courseId.courseTitle,
          category: purchase.courseId.category,
        },
        purchaseDate: purchase.createdAt,
        progress: {
          completed: progress ? progress.completed : false,
          completedLectures,
          totalLectures,
          progressPercentage,
        },
      };
    });

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    console.error("Error in getEnrolledStudentsData:", error);
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

    // Tao map de tra cuu tong chi tieu
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

// Cap nhat trang thai khoa tai khoan
export const updateUserLockStatus = async (req, res) => {
  try {
    const { userId, isLocked } = req.body;

    // Kiem tra userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không được cung cấp",
      });
    }

    // Kiem tra userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

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

// Lay danh muc cua giao vien
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

// Them danh muc
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

// Cap nhat danh muc
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

// Xoa danh muc
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
