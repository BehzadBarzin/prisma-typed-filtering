import { Router } from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
} from "../controllers/category";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.post("/", createCategory);
categoryRouter.patch("/:id", updateCategory);

export { categoryRouter };
