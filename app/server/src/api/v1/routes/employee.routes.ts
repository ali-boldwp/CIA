import { Router } from "express";
import * as employeeController from "../controllers/employee.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Role } from "../../../constants/roles";

const router = Router();

router.post("/", auth, employeeController.createEmployee);

router.get("/", auth, employeeController.getAllEmployees);

router.get("/:id", auth, employeeController.getEmployeeById);

router.put("/:id", auth, employeeController.updateEmployee);

router.delete(
    "/:id",
    auth,
    // authorizeRoles(Role.ADMIN, Role.MANAGER),
    employeeController.deleteEmployee
);

export default router;
