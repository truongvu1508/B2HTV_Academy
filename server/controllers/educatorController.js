// Cập nhật hàm educatorDashboardData để thêm dữ liệu cho biểu đồ
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

    // Tạo dữ liệu cho biểu đồ doanh thu theo tháng
    const salesByMonth = await generateSalesByMonth(purchases);

    // Tạo dữ liệu cho biểu đồ phân bố học viên theo khóa học
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

// Hàm tạo dữ liệu doanh thu theo tháng
const generateSalesByMonth = async (purchases) => {
  const currentYear = new Date().getFullYear();

  // Khởi tạo mảng với 12 tháng
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

  // Chỉ xử lý các giao dịch hoàn thành
  const completedPurchases = purchases.filter((p) => p.status === "completed");

  // Tính tổng doanh thu cho mỗi tháng
  completedPurchases.forEach((purchase) => {
    const purchaseDate = new Date(purchase.createdAt);
    const purchaseYear = purchaseDate.getFullYear();

    // Chỉ tính cho năm hiện tại
    if (purchaseYear === currentYear) {
      const monthIndex = purchaseDate.getMonth(); // 0-11
      months[monthIndex].sales += purchase.amount;
    }
  });

  return months;
};

// Hàm tạo dữ liệu phân bố học viên theo khóa học
const generateEnrollmentData = async (courses) => {
  return courses.map((course) => ({
    type: course.courseTitle,
    value: course.enrolledStudents.length,
  }));
};
