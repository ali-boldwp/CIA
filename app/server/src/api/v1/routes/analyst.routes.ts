import { Router } from "express";
import * as analystController from "../controllers/analyst.controller";
import { auth } from "../../../middlewares/auth.middleware";
// import { authorizeRoles } from "../../../middlewares/role.middleware";
// import { Role } from "../../../constants/roles";

const router = Router();

// Create
router.post("/", auth, analystController.createAnalyst);

// Get all
router.get("/", auth, analystController.getAllAnalysts);

// Get one by ID
router.get("/:id", auth, analystController.getAnalystById);

// Update
router.put("/:id", auth, analystController.updateAnalyst);

// Delete
router.delete(
    "/:id",
    auth,
    // authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
    analystController.deleteAnalyst
);

export default router;
