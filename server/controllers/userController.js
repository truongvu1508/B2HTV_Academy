import Stripe from "stripe";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";

// Lay thong tin nguoi dung
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId).select("name email isLocked");
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Lay danh sach khoa hoc da ghi danh
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    // Tim nguoi dung va populate danh sach khoa hoc da ghi danh
    const userData = await User.findById(userId).populate("enrolledCourses");

    // if (!userData) {
    //   return res.json({ success: false, message: "Không tìm thấy người dùng" });
    // }

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    // res.json({ success: false, message: error.message });
  }
};

// Mua khoa hoc
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);
    if (!userData || !courseData) {
      return res.json({ success: false, message: "Không tìm thấy dữ liệu" });
    }

    // Tao du lieu giao dich
    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(0),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // Khoi tao Stripe
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // Tao line items cho Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: newPurchase.amount,
        },
        quantity: 1,
      },
    ];

    // Tao phien thanh toan Stripe
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Cap nhat tien do hoc tap
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId, completed } = req.body;
    // Tim tien do cua khoa hoc
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      // Neu bai giang da hoan thanh, tra ve thong bao
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({ success: true, message: "Bài giảng đã hoàn thành" });
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      // Tao tien do moi neu chua co
      await CourseProgress.create({
        userId,
        courseId,
        completed: completed || false,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Cập nhật tiến trình" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Lay tien do hoc tap
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Them danh gia khoa hoc
export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Không hợp lệ" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Không tìm thấy khóa học." });
    }

    const user = await User.findById(userId);

    // Tim nguoi dung va kiem tra da mua khoa hoc chua
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "Người dùng không mua khóa học này",
      });
    }

    // Kiem tra danh gia da ton tai
    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();
    return res.json({ success: true, message: "Đã thêm đánh giá" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
