import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import projectRequestRoutes from "./project.routes";
import createdProjectRoutes from "./createdProjects.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRequestRoutes);
router.use("/created-project", createdProjectRoutes);

export default router;
