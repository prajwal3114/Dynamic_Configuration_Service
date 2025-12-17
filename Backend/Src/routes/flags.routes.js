import express from "express";
import { protect } from "../middlewares/auth.middlewares.js";
import { createFlag,getFlags,updateFlag,archiveFlag } from "../controllers/flag.controller.js";

const router=express.Router();

router.post("/:projectId/flags",protect,createFlag);
router.get("/:projectId/flags",protect,getFlags);
router.patch("/:projectId/flags/:flagId",protect,updateFlag);
router.delete("/:projectId/flags/:flagId",protect,archiveFlag);

export default router;
