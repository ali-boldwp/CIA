import { Router } from "express";
import * as chapterTemplateController from "../controllers/chapterTemplate.controller";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();


router.post("/", auth, chapterTemplateController.createChapterTemplate);

router.get("/by-category/:id", auth, chapterTemplateController.getChaptersByCategoryId);


router.put("/:id", auth, chapterTemplateController.updateChapterTemplate);


router.delete("/:id", auth, chapterTemplateController.deleteChapterTemplate);

export default router;
