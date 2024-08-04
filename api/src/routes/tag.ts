import { Router } from "express";
import { getTags, getTag, createTag, updateTag } from "../controllers/tag";

const tagRouter = Router();

tagRouter.get("/", getTags);
tagRouter.get("/:id", getTag);
tagRouter.post("/", createTag);
tagRouter.patch("/:id", updateTag);

export { tagRouter };
