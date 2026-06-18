import { prisma } from '../config';
import { minioService } from './minio.service';
import { BadRequestException, NotFoundException } from '../middleware/error.middleware';

export class UploadsService {
  async uploadSingle(userId: string, file: any) {
    if (!file) throw new BadRequestException('No file uploaded');

    const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMime.includes(file.mimetype)) {
      throw new BadRequestException('MIME type not allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    const key = `${Date.now()}-${file.originalname}`;
    const bucket = file.mimetype.startsWith('image/') ? 'users' : 'documents';

    const fileUrl = await minioService.uploadFile(
      bucket,
      key,
      file.buffer,
      file.size,
      file.mimetype,
    );

    const fileUpload = await prisma.fileUpload.create({
      data: {
        filename: file.originalname,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        bucket,
        key,
        userId,
      },
    });

    return {
      id: fileUpload.id,
      url: fileUrl,
      filename: fileUpload.filename,
    };
  }

  async uploadMultiple(userId: string, files: any[]) {
    if (!files || files.length === 0) throw new BadRequestException('No files uploaded');

    const results = [];
    for (const file of files) {
      const result = await this.uploadSingle(userId, file);
      results.push(result);
    }
    return results;
  }

  async getPresigned(bucket: string, key: string) {
    const url = await minioService.getPresignedUrl(bucket, key);
    return { url };
  }

  async delete(id: string) {
    const file = await prisma.fileUpload.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('File metadata not found');

    await minioService.deleteFile(file.bucket, file.key);
    await prisma.fileUpload.delete({ where: { id } });

    return { success: true };
  }
}

export const uploadsService = new UploadsService();
