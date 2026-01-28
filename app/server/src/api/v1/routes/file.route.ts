import { Router } from "express";
import {downloadFile, uploadEditorImage} from "../controllers/file.controller";
import { auth } from "../../../middlewares/auth.middleware";
import {upload} from "../../../middlewares/upload.middleware";

const router = Router();
router.post("/editorjs/image", auth, upload.single("image"), uploadEditorImage);

router.get("/:filename", auth, downloadFile);

export default router;
