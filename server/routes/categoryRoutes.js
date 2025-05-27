import express from "express";
import {
  getAllCategories,
  getCategoryById,
  getCategoriesWithCourseCount,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.get("/with-count", getCategoriesWithCourseCount);

export default categoryRouter;
