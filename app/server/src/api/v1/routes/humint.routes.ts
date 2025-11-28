import { Router } from "express";
import * as humintController from "../controllers/humint.controller";
import { auth } from "../../../middlewares/auth.middleware";
// import { authorizeRoles } from "../../../middlewares/role.middleware";
// import { Role } from "../../../constants/roles";

const router = Router();

router.post("/", auth, humintController.createHumint);

router.get("/", auth, humintController.getAllHumints);

router.get("/:id", auth, humintController.getHumintById);

router.put("/:id", auth, humintController.updateHumint);

router.patch("/:id/status", auth, humintController.updateHumintStatus);

router.delete(
    "/:id",
    auth,
    // authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
    humintController.deleteHumint
);

export default router;
