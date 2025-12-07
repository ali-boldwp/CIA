import { Router } from "express";
import * as clarificationController from "../controllers/clarification.controller";
import { auth } from "../../../middlewares/auth.middleware";
import * as humintController from "../controllers/humint.controller";
import {getClarificationHumintById} from "../controllers/clarification.controller";


const router = Router();


router.post("/humint/clarification", auth, clarificationController.createClarification);

router.get("/humint/clarification/:id", auth, clarificationController.getClarificationHumintById);

export default router;