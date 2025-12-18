import { Router } from "express";
import { downloadFile } from "../controllers/file.controller";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.get("/:filename", auth, downloadFile);

export default router;
