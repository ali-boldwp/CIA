import { Router } from "express";
import * as chapterController from "../controllers/chapter.controller"
import { auth } from "../../../middlewares/auth.middleware";


const router = Router();

router.post("/", auth, chapterController.createChapter);

router.get("/", auth, chapterController.getAllChapter);

router.get("/:id" , auth , chapterController.getChapterById);

router.get("/:projectId", auth, chapterController.getChapterByProjectId);

router.put("/:id", auth, chapterController.updateChapter);


export default router;
