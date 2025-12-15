import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",login)
router.get("/test", protect, (req, res) => {
  res.json({
    userId: req.user.id
  });
});

export default router;
