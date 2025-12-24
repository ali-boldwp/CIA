import { Router } from "express";
import * as foamFieldsController from "../controllers/foamFields.controller";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.post("/", auth, foamFieldsController.createFoamField);
router.get("/by-task/:id", auth, foamFieldsController.getFoamFieldsByTaskId);
router.put("/:id", auth, foamFieldsController.updateFoamField);
router.delete("/:id", auth, foamFieldsController.deleteFoamField);

export default router;
