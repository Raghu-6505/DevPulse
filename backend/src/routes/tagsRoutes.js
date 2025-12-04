import express from "express";
import {
  bulkAddTags,
  createTag,
  deleteTag,
  getTagById,
  getTags,
} from "../controllers/tags/tagsController.js";
import { adminMiddleware, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// create a new tag
router.post("/create-tag", protect, createTag);
router.get("/tags", getTags);
router.get("/tag/:id", getTagById);
router.delete("/tag/:id", protect, deleteTag);

router.post("/bulk-tags:id", protect, adminMiddleware, bulkAddTags);

export default router;
