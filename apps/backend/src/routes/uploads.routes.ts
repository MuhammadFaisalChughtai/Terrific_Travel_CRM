import { Router } from 'express';
import multer from 'multer';
import { uploadSingle, uploadMultiple, getPresigned, deleteFile } from '../controllers/uploads.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public document streaming / viewer routes (browsers open PDFs and images in new tabs without Bearer headers)
router.get('/presigned/:bucket/:key(*)', getPresigned);
router.get('/view/:bucket/:key(*)', getPresigned);
router.get('/file/:bucket/:key(*)', getPresigned);
router.get('/:bucket(documents|invoices|users|hotels|tours|flights)/:key(*)', getPresigned);

// Protected routes (upload & delete require authentication)
router.post('/single', authMiddleware as any, upload.single('file'), uploadSingle);
router.post('/multiple', authMiddleware as any, upload.array('files', 10), uploadMultiple);
router.delete('/:id', authMiddleware as any, deleteFile);

export default router;
