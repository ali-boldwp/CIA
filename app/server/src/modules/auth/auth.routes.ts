// apps/server/src/modules/auth/auth.routes.ts
import { Router } from "express";
import * as authController from "./auth.controller";
import { authGuard } from "../../middleware/authGuard";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authGuard, authController.me);

export default router;
