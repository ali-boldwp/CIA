import { Router } from "express";
import * as analystExpanseController from "../controllers/analystExpanse.controller";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.get("/total-salary",auth, analystExpanseController.getAnalystsFinalSalary);

router.get("/:projectId/analyst-expanse", analystExpanseController.getProjectAnalystExpanse);


export default router;