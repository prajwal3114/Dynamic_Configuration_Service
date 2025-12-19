import express from "express";
import { evaluate } from "../controllers/evaluate.controller.js";

const router = express.Router();

router.post("/:projectId/:flagKey", evaluate);

export default router;
