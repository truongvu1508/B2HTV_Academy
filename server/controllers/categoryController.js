import Category from "../models/Category.js";
import Course from "../models/Course.js";
import mongoose from "mongoose";

// Lay tat ca danh muc
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().select(
      "name description _id createdAt updatedAt"
    );
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lay danh muc theo ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID danh mục không hợp lệ" });
    }

    const category = await Category.findById(id).select(
      "name description _id createdAt updatedAt"
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy danh mục" });
    }

    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lay danh muc theo khoa
export const getCategoriesWithCourseCount = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "category",
          as: "courses",
        },
      },
      {
        $addFields: {
          courseCount: { $size: "$courses" },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          courseCount: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.json({
      success: true,
      categories,
      message: "Lấy danh sách danh mục với số lượng khóa học thành công",
    });
  } catch (error) {
    console.error("Error fetching categories with course count:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
