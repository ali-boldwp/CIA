import { Router } from "express";
import * as observationController from "../controllers/observation.controller";
import { auth } from "../../../middlewares/auth.middleware";


const router = Router();


router.post("/", auth, observationController.createObservation);


router.get("/project/:id", auth, observationController.getObservationByProjectId);


export default router;