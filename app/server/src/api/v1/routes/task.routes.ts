import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Role } from "../../../constants/roles";

const router = Router();

// CREATE task
router.post("/", auth, taskController.createTask);

// LIST tasks
router.get(
    "/",
    auth,
    taskController.getAllTasks
);


router.get("/:id", auth, taskController.getTaskById);


router.put("/:id", auth, taskController.updateTask);


router.patch("/:id/finalize", auth, taskController.finalizeTask);


router.delete(
    "/:id",
    auth,
    // authorizeRoles(Role.ADMIN, Role.MANAGER),
    taskController.deleteTask
);

router.get(
    "/project/:projectId",
    auth,
    taskController.getTasksByProjectId
);


export default router;
