import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  exportCSV,
  submitLead,
} from '../controllers/leadController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly, staffOnly } from '../middleware/roleMiddleware';

const router = Router();

// public — homepage contact form
router.post('/submit', submitLead);

// protected routes — staff only (admin + sales), customers blocked
router.use(protect);
router.use(staffOnly);

router.get('/export', adminOnly, exportCSV);
router.get('/', getLeads);
router.post('/', createLead);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', adminOnly, deleteLead);

export default router;