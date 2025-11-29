import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import projectRequestRoutes from "./project.routes";
import createdProjectRoutes from "./createdProjects.routes";
import humintRoutes from "./humint.routes";
import employeeRoutes from "./employee.routes";
import analystRoutes from "./analyst.routes";
import projectDetailsRoutes from "./projectDetails.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRequestRoutes);
router.use("/created-project", createdProjectRoutes);
router.use("/humint" , humintRoutes);
router.use("/employees", employeeRoutes);
router.use("/analyst", analystRoutes);
router.use("/project-details", projectDetailsRoutes)

export default router;
