import express from "express";
import { evaluate } from "../controllers/evaluate.controller.js";
import { evaluateBulk } from "../controllers/evaluateBulk.controller.js";

const router = express.Router();

router.post("/bulk/:projectId", evaluateBulk);

router.post("/:projectId/:flagKey", evaluate);

export default router;
