import { Router } from 'express';
import { getLeads, getLeadById, createLead, updateLead, deleteLead, handleInboundLeadWebhook } from '../controllers/leads.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Inbound webhook for Meta Lead Ads / n8n automation (secured by webhook secret token)
router.post('/webhook', handleInboundLeadWebhook);

// Protect all other lead routes with authentication middleware
router.use(authMiddleware as any);

router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
