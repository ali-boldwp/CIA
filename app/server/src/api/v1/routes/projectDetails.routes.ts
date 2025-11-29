import { Router } from "express";
import * as projectDetailsController from "../controllers/projectDetails.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Role } from "../../../constants/roles";
import { upload } from "../../../middlewares/upload.middleware";

const router = Router();

// CREATE ProjectDetails
router.post(
    "/",
    auth,
    upload.array("attachments", 10),
    projectDetailsController.createProjectDetails
);

// GET ALL (Admins & Managers only)
router.get(
    "/",
    auth,
    // authorizeRoles(Role.ADMIN, Role.MANAGER),
    projectDetailsController.getAllProjectDetails
);

// GET BY ID
router.get(
    "/:id",
    auth,
    projectDetailsController.getProjectDetailsById
);

// UPDATE ProjectDetails
router.put(
    "/:id",
    auth,
    projectDetailsController.updateProjectDetails
);

// DELETE ProjectDetails (Admins & Managers only)
router.delete(
    "/:id",
    auth,
    authorizeRoles(Role.ADMIN, Role.MANAGER),
    projectDetailsController.deleteProjectDetails
);

export default router;
