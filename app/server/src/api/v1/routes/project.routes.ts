import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { auth } from "../../../middlewares/auth.middleware";


const router = Router();


router.post(
    "/",
    auth,
    projectController.createProject
);


router.get(
    "/",
    auth,
    projectController.getAllProjects
);


router.get(
    "/:id",
    auth,
    projectController.getProjectById
);


router.put(
    "/:id",
    auth,
    projectController.updateProject
);


router.patch(
    "/:id/status",
    auth,

    projectController.updateProjectStatus
);


router.delete(
    "/:id",
    auth,
    projectController.deleteProject
);

export default router;
