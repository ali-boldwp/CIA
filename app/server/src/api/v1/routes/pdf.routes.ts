import { generatePdf } from "../controllers/pdf.controller";
import {upload} from "../../../middlewares/upload.middleware";
import {Router} from "express";

const router = Router();

router.post("/generate", upload.array("files"), generatePdf);

export default router;


