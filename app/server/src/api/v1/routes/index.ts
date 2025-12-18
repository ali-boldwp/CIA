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
import notificationRoutes from "./notification.routes";
import observationRoutes from "./observation.routes";
import analystExpanseRoutes from "./analystExpanse.routes";
import humintExpanseRoutes from "./humintExpanse.routes";
import auditLogRoutes from "./auditLog.routes";
import fileRoute from "./file.route";

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
router.use("/" , dashboardRoutes);
router.use("/notification" , notificationRoutes);
router.use("/observation" , observationRoutes);
router.use("/analyst" , analystExpanseRoutes);
router.use("/humint-expanse", humintExpanseRoutes);
router.use("/audit-logs" , auditLogRoutes);
router.use("/download", fileRoute)

export default router;
