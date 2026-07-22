import { Router } from 'express';
import { getLeads, getLeadById, createLead, updateLead, deleteLead } from '../controllers/leads.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protect all lead routes with authentication middleware
router.use(authMiddleware as any);

router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
