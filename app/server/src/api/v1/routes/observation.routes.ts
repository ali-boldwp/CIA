import { Router } from "express";
import * as observationController from "../controllers/observation.controller";
import { auth } from "../../../middlewares/auth.middleware";
import {getObservationProjectById} from "../controllers/observation.controller";



const router = Router();


router.post("/", auth, observationController.createObservation);


router.get("/project/:projectId", auth, observationController.getObservationProjectById);


export default router;