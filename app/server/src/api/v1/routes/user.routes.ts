import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { authorizeRoles } from '../../../middlewares/role.middleware';
import { Role } from '../../../constants/roles';

const router = Router();

/* Logged-in user profile */
router.get('/me', auth, userController.getMe );

/* Admin / super_admin only */
router.get(
    '/',
    auth,
    authorizeRoles(Role.ADMIN, Role.SUPER_ADMIN),
    userController.getUsers
);

export default router;
