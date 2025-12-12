import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.get(
    "/getAllRequestedProjects",
    auth,
    projectController.getAllRequestedProjects
);

router.get(
    "/getRequestedProjectById/:id",
    auth,
    projectController.getRequestedProjectById
);

router.get(
    "/project-requests/sales",
    auth,
    projectController.getSalesRequestedProjects
);

export default router;