import { Router } from 'express';
import multer from 'multer';
import { uploadSingle, uploadMultiple, getPresigned, deleteFile } from '../controllers/uploads.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Secure all upload routes
router.use(authMiddleware as any);

router.post('/single', upload.single('file'), uploadSingle);
router.post('/multiple', upload.array('files', 10), uploadMultiple);
router.get('/presigned/:bucket/:key', getPresigned);
router.delete('/:id', deleteFile);

export default router;
