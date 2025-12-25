import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Role } from "../../../constants/roles";

const router = Router();




router.post("/", auth, taskController.createTask);


router.get("/", auth, taskController.getAllTasks);

router.get("/:id", auth, taskController.getTaskById);

router.get("/:id/view", auth, taskController.getTask);

router.patch("/:id", auth, taskController.updateTask);

router.delete("/:id" , auth , taskController.deleteTask);

// ⭐ START TASK
router.post("/:id/start", auth, taskController.startTask);

// ⭐ PAUSE TASK
router.post("/:id/pause", auth, taskController.pauseTask);

// ⭐ RESUME TASK
router.post("/:id/resume", auth, taskController.resumeTask);

// ⭐ COMPLETE TASK
router.post("/:id/complete", auth, taskController.completeTask);


export default router;
