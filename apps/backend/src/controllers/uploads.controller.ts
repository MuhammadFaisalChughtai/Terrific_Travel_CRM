import path from 'path';
import { Request, Response } from 'express';
import { uploadsService } from '../services/uploads.service';
import { minioService } from '../services/minio.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { logger } from '../config';

export const uploadSingle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await uploadsService.uploadSingle(req.user!.id, req.file);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const uploadMultiple = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const result = await uploadsService.uploadMultiple(req.user!.id, files);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const getPresigned = asyncHandler(async (req: Request, res: Response) => {
  const { bucket } = req.params;
  const rawKey = req.params.key || (req.params as any)[0];

  if (!bucket || !rawKey) {
    return res.status(400).json({ success: false, message: 'Bucket and key are required' });
  }

  // If programmatic client explicitly requests JSON with presigned URL
  if (req.query.format === 'json') {
    const result = await uploadsService.getPresigned(bucket, rawKey);
    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  let decodedKey = rawKey;
  try {
    decodedKey = decodeURIComponent(rawKey);
  } catch {
    decodedKey = rawKey;
  }

  try {
    const stat = await minioService.statObject(bucket, decodedKey);
    const stream = await minioService.getObjectStream(bucket, decodedKey);

    const ext = path.extname(decodedKey).toLowerCase();
    let contentType = stat.metaData?.['content-type'] || 'application/octet-stream';
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.svg') {
      contentType = 'image/svg+xml';
    }

    const filename = path.basename(decodedKey);
    const isDownload = req.query.download === 'true';

    res.setHeader('Content-Type', contentType);
    if (stat.size) {
      res.setHeader('Content-Length', stat.size);
    }
    res.setHeader(
      'Content-Disposition',
      `${isDownload ? 'attachment' : 'inline'}; filename="${encodeURIComponent(filename)}"`
    );
    res.setHeader('Cache-Control', 'public, max-age=86400');

    stream.on('error', (streamErr: any) => {
      logger.error(`Error streaming object (${bucket}/${decodedKey}):`, streamErr);
      if (!res.headersSent) {
        res.status(500).send('Error streaming file');
      }
    });

    stream.pipe(res);
  } catch (err: any) {
    logger.warn(`Could not stream file directly (${bucket}/${decodedKey}): ${err.message || err}`);
    if (err.code === 'NoSuchKey' || err.code === 'NotFound') {
      return res.status(404).send('Document not found');
    }

    // Fallback: try generating a presigned URL redirect
    try {
      const { url } = await uploadsService.getPresigned(bucket, decodedKey);
      return res.redirect(url);
    } catch {
      return res.status(404).send('Document not found or inaccessible');
    }
  }
});

export const deleteFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await uploadsService.delete(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});
