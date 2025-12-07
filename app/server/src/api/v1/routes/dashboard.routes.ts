import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Role } from "../../../constants/roles";

const router = Router();

router.get("/stats", auth, dashboardController.getStats);


export default router;
