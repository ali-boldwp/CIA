import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { upload } from "../../../middlewares/upload.middleware";




const router = Router();


router.post(
    "/",
    auth,
    upload.array("files", 10),
    projectController.requestProject
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

router.put(
    "/:id/approve",
    auth,
    projectController.approveProject
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
