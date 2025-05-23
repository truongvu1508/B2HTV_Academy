import express from "express";
import {
  getAllCategories,
  getCategoryById,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);

export default categoryRouter;
