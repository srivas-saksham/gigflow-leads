import { Router } from 'express';
import { register, login, getMe, createStaffUser, listUsers, updateUser, deleteUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/staff', protect, adminOnly, createStaffUser);
router.get('/users', protect, adminOnly, listUsers);
router.put('/users/:id', protect, adminOnly, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;