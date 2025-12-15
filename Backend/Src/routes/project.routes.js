import express from "express";
import { createProject, getProjects } from "../controllers/project.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

/* Create Project */
router.post("/", protect, createProject);

router.get("/", protect, getProjects);
export default router;
