import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import projectRequestRoutes from "./project.routes";
import createdProjectRoutes from "./createdProjects.routes";
import humintRoutes from "./humint.routes";
import projectDetailsRoutes from "./projectDetails.routes";
import taskRoutes from "./task.routes";
import chatRoutes from "./chat.routes";
import chapterRoutes from "./chapter.routes";
import requestedRoutes from "./requested.routes";
import clarificationRoutes from "./clarification.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/project-request", projectRequestRoutes);
router.use("/project", createdProjectRoutes);
router.use("/humint", humintRoutes);
router.use("/project-details", projectDetailsRoutes);
router.use("/task", taskRoutes);
router.use("/chats" , chatRoutes);
router.use("/chapter",chapterRoutes);
router.use("/" , requestedRoutes);
router.use("/" , clarificationRoutes);
router.use("/" , dashboardRoutes)

export default router;
