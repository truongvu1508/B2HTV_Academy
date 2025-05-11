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

educatorRouter.get("/courses", protectEducator, getEducatorCourses);

educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);
educatorRouter.get("/allUsers", requireAuth(), getAllUsers);
export default educatorRouter;
