import { Router } from "express";
import * as createdProjectController from "../controllers/createdProjects.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Role } from "../../../constants/roles";
import { upload } from "../../../middlewares/upload.middleware";

const router = Router();


router.post(
    "/",
    auth,
    upload.array("files", 10),
    createdProjectController.createProject
);


router.get(
    "/:projectId/financial-states",
    createdProjectController.projectFinancialSummary
);

router.get(
    "/",
    auth,
    createdProjectController.getAllProjects
);


router.get(
    "/:id",
    auth,
    createdProjectController.getProjectById
);


router.put(
    "/:id",
    auth,
    createdProjectController.updateProject
);


router.delete(
    "/:id",
    auth,
    authorizeRoles(Role.ADMIN, Role.MANAGER),
    createdProjectController.deleteProject
);

router.put("/:id/editable", auth, createdProjectController.updateEditableStatus);

router.put("/:id/status", auth, createdProjectController.updateProjectStatus);



router.get("/analysts/progress", auth, createdProjectController.getAnalystsProgress);

export default router;
