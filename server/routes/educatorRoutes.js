import express from "express";
import {
  addCourse,
  deleteCourse,
  educatorDashboardData,
  getAllUsers,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateCourse,
  updateRoleToEducator,
  updateUserLockStatus,
  addCategory,
  updateCategory,
  deleteCategory,
  getEducatorCategories,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import { requireAuth } from "@clerk/express";

const educatorRouter = express.Router();

// Add Educator Role
educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);

// Update Course
educatorRouter.put(
  "/update-course/:courseId",
  upload.single("image"),
  protectEducator,
  updateCourse
);

//Delete Course
educatorRouter.delete(
  "/delete-course/:courseId",
  protectEducator,
  deleteCourse
);

// Category routes
educatorRouter.post("/add-category", protectEducator, addCategory);
educatorRouter.put("/update-category/:id", protectEducator, updateCategory);
educatorRouter.delete("/delete-category/:id", protectEducator, deleteCategory);
educatorRouter.get("/categories", protectEducator, getEducatorCategories);

educatorRouter.get("/courses", protectEducator, getEducatorCourses);

educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);
educatorRouter.get("/allUsers", requireAuth(), getAllUsers);

// Update user lock status route
educatorRouter.put(
  "/updateUserLockStatus",
  requireAuth(),
  updateUserLockStatus
);
export default educatorRouter;
