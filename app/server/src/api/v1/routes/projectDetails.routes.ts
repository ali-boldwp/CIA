import { Router } from "express";
import * as projectDetailsController from "../controllers/projectDetails.controller";
import * as projectCostsController from "../controllers/projectCosts.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Role } from "../../../constants/roles";
import { upload } from "../../../middlewares/upload.middleware";

const router = Router();

// CREATE
router.post(
    "/",
    auth,
    upload.array("attachments", 10),
    projectDetailsController.createProjectDetails
);

// GET ALL
router.get(
    "/",
    auth,
    // authorizeRoles(Role.ADMIN, Role.MANAGER),
    projectDetailsController.getAllProjectDetails
);

// GET ONE
router.get(
    "/:id",
    auth,
    projectDetailsController.getProjectDetailsById
);

// UPDATE BASIC DETAILS
router.put(
    "/:id",
    auth,
    projectDetailsController.updateProjectDetails
);

// DELETE
router.delete(
    "/:id",
    auth,
    authorizeRoles(Role.ADMIN, Role.MANAGER),
    projectDetailsController.deleteProjectDetails
);

// COST PAGE: GET
router.get(
    "/:id/costs",
    auth,
    projectCostsController.getProjectCosts
);

// COST PAGE: UPDATE
router.put(
    "/:id/costs",
    auth,
    projectCostsController.updateProjectCosts
);

export default router;
