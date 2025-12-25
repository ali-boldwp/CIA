import { Router } from "express";
import * as chapterController from "../controllers/chapter.controller";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.post("/", auth, chapterController.createChapter);

router.get("/", auth, chapterController.getAllChapter);

/* ✅ GET CHAPTER BY ID */
router.get("/:id", auth, chapterController.getChapterById);

/* ✅ GET CHAPTERS BY PROJECT */
router.get(
    "/by-project/:projectId",
    auth,
    chapterController.getChapterByProjectId
);

router.put("/:id", auth, chapterController.updateChapter);

export default router;
