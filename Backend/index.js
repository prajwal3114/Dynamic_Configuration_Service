import express from "express";
import dotenv from "dotenv";
import connectDB from "./Src/config/db.js";
import authRoutes from "./Src/routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
