import { Router } from "express";
import { auth } from "../../../middlewares/auth.middleware";
import * as humintExpanseController from "../controllers/humintExpanse.controller";

const router = Router();

// CREATE
router.post("/", auth, humintExpanseController.createHumintExpanse);

// GET ALL
router.get("/", auth, humintExpanseController.getAllHumintExpenses);

// GET ONE
router.get("/:id", auth, humintExpanseController.getHumintExpenseById);

// UPDATE
router.put("/:id", auth, humintExpanseController.updateHumintExpense);

// DELETE
router.delete("/:id", auth, humintExpanseController.deleteHumintExpense);

// TOTAL (EUR / RON / USD)
router.get("/totals/grouped", auth, humintExpanseController.getHumintTotal);

export default router;
