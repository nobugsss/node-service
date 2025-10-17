import { Router } from 'express';
import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
} from '../controllers/userController';
import {
	validate,
	validateQuery,
	userValidation,
	paginationValidation,
} from '../utils/validation';

const router: Router = Router();

// 用户路由
router.get('/users', validateQuery(paginationValidation), getUsers);
router.get('/users/:id', getUserById);
router.post('/users', validate(userValidation.create), createUser);
router.put('/users/:id', validate(userValidation.update), updateUser);
router.delete('/users/:id', deleteUser);

export default router;
