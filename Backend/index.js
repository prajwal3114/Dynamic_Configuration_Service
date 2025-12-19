import express from "express";
import dotenv from "dotenv";
import connectDB from "./Src/config/db.js";
import authRoutes from "./Src/routes/auth.routes.js";
import projectRoutes from "./Src/routes/project.routes.js";
import flagRoutes from "./Src/routes/flags.routes.js";
import evaluaterouter from "./Src/routes/evaluate.routes.js";
dotenv.config();

const app=express();

app.use(express.json());

/* optional debug */
app.use((req,res,next)=>{
  console.log("METHOD:",req.method);
  console.log("CONTENT-TYPE:",req.headers["content-type"]);
  console.log("BODY:",req.body);
  next();
});

/* DB */
connectDB();

/* ROUTES */
app.use("/auth",authRoutes);
app.use("/projects",projectRoutes);
app.use("/projects",flagRoutes);
app.use("/evaluate",evaluaterouter);
app.get("/",(req,res)=>{
  res.send("Hello, World!");
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`);
});
