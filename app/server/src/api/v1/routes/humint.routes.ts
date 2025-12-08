import { Router } from "express";
import * as clarificationController from "../controllers/clarification.controller";
import { auth } from "../../../middlewares/auth.middleware";
import * as humintController from "../controllers/humint.controller";
// import { authorizeRoles } from "../../../middlewares/role.middleware";
// import { Role } from "../../../constants/roles";

const router = Router();

// ----------------------
// CRUD ROUTES
// ----------------------
router.post("/", auth, humintController.createHumint);

router.get("/", auth, humintController.getAllHumints);

router.get("/:id", auth, humintController.getHumintById);

router.put("/:id", auth, humintController.updateHumint);

// router.patch("/:id/status", auth, humintController.updateHumintStatus);

router.delete(
    "/:id",
    auth,

    humintController.deleteHumint
);

// ----------------------
// WORKFLOW ROUTES (from your UI flow)
// ----------------------

// Analyst: Submit request → Pending
router.patch("/:id/submit", auth, humintController.submitHumint);

// Manager: Approve
router.patch("/:id/approve", auth, humintController.approveHumint);

// Manager: Reject
router.patch("/:id/reject", auth, humintController.rejectHumint);

// Manager: Ask for clarification
router.patch("/:id/clarification", auth, humintController.clarificationHumint );

// After HUMINT operation complete
router.patch("/:id/complete", auth, humintController.completeHumint);






export default router;
