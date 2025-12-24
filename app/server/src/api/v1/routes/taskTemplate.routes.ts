import { Router } from "express";
import * as taskTemplateController from "../controllers/taskTemplate.controller";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.post("/", auth, taskTemplateController.createTaskTemplate);
router.get("/by-chapter/:id", auth, taskTemplateController.getTaskTemplatesByChapterId);
router.put("/:id", auth, taskTemplateController.updateTaskTemplate);
router.delete("/:id", auth, taskTemplateController.deleteTaskTemplate);

export default router;
