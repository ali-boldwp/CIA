import { Router } from "express";
import * as auditLogController from "../controllers/auditLog.controller";
import { auth } from "../../../middlewares/auth.middleware";



const router = Router();


router.get("/:chatId", auth, auditLogController.getAuditLogs);

export default router;