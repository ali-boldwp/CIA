import { Router } from "express";
import * as chapterController from "../controllers/chapter.controller"
import { auth } from "../../../middlewares/auth.middleware";
// import { authorizeRoles } from "../../../middlewares/role.middleware";
// import { Role } from "../../../constants/roles";

const router = Router();

router.post("/", auth, chapterController.createChapter);

router.get("/", auth, chapterController.getAllChapter);
//
// router.get("/:id", auth, chapterController.getHumintById);
//
router.put("/:id", auth, chapterController.updateChapter);
//
// router.patch("/:id/status", auth, chapterController.updateHumintStatus);
//
// router.delete(
//     "/:id",
//     auth,
//     // authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
//     chapterController.deleteHumint
// );

export default router;
