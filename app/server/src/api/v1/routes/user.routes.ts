import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";
import { Role } from "../../../constants/roles";
import {updateMyProfile} from "../controllers/user.controller";

const router = Router();

/* -------------------------
   PUBLIC ROUTES
-------------------------- */
// Login route ONLY for users with isLogin = true
router.post("/login", userController.login);


/* -------------------------
   ADMIN / MANAGER CAN CREATE USERS
-------------------------- */
router.post(
    "/",
    auth,
    // authorizeRoles(Role.ADMIN, Role.MANAGER),
    userController.createUser
);


/* -------------------------
   LOGGED-IN USER INFO
-------------------------- */
router.get("/me", auth, userController.getMe);


/* -------------------------
   ADMIN & MANAGER CAN SEE ALL USERS
-------------------------- */
router.get(
    "/",
    auth,
    // authorizeRoles(Role.ADMIN, Role.MANAGER),
    userController.getUsers
);

router.put(
    "/profile",
    auth,
    userController.updateMyProfile
);


/* -------------------------
   UPDATE USER
-------------------------- */
router.put(
    "/:id",
    auth,
    // authorizeRoles(Role.ADMIN, Role.MANAGER),
    userController.updateUser
);



/* -------------------------
   DELETE USER
-------------------------- */
router.delete(
    "/:id",
    auth,
    // authorizeRoles(Role.ADMIN),
    userController.deleteUser
);

export default router;
