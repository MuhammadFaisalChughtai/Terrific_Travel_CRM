import { Router } from 'express';
import {
  findAll,
  findOne,
  create,
  createFromBooking,
  updateStatus,
  update,
  remove,
} from '../controllers/issuance.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

router.get('/tickets', findAll);
router.get('/tickets/:id', findOne);
router.post('/tickets', create);
router.post('/tickets/from-booking/:bookingId', createFromBooking);
router.patch('/tickets/:id/status', updateStatus);
router.put('/tickets/:id', update);
router.delete('/tickets/:id', remove);

export default router;
