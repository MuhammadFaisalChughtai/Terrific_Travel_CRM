import { minioClient, config, logger } from '../config';

export class MinioService {
  private readonly buckets = ['users', 'hotels', 'tours', 'flights', 'invoices', 'documents'];

  constructor() {
    this.initializeBuckets();
  }

  private async initializeBuckets() {
    for (const bucket of this.buckets) {
      try {
        const exists = await this.bucketExists(bucket);
        if (!exists) {
          await this.createBucket(bucket);
          logger.info(`Bucket "${bucket}" created.`);
          if (['users', 'hotels', 'tours'].includes(bucket)) {
            await this.setBucketPublicPolicy(bucket);
          }
        }
      } catch (err) {
        logger.error(`Error initializing bucket "${bucket}":`, err);
      }
    }
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    try {
      return await minioClient.bucketExists(bucketName);
    } catch {
      return false;
    }
  }

  async createBucket(bucketName: string): Promise<void> {
    await minioClient.makeBucket(bucketName, 'us-east-1');
  }

  private async setBucketPublicPolicy(bucketName: string): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
  }

  async uploadFile(bucketName: string, objectName: string, buffer: Buffer, size: number, mimetype: string): Promise<string> {
    await minioClient.putObject(bucketName, objectName, buffer, size, {
      'Content-Type': mimetype,
    });
    return this.getFileUrl(bucketName, objectName);
  }

  async uploadMultipleFiles(bucketName: string, files: { filename: string; buffer: Buffer; mimetype: string }[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const url = await this.uploadFile(bucketName, file.filename, file.buffer, file.buffer.length, file.mimetype);
      urls.push(url);
    }
    return urls;
  }

  getFileUrl(bucketName: string, objectName: string): string {
    if (['users', 'hotels', 'tours'].includes(bucketName)) {
      // Public buckets — rewrite docker-internal hostname to public URL
      // Dev:  http://localhost:9000/<bucket>/<object>
      // Prod: https://cdn.terrifictravel.co.uk/<bucket>/<object>
      return `${config.minio.publicUrl}/${bucketName}/${objectName}`;
    }
    return `/api/uploads/presigned/${bucketName}/${objectName}`;
  }

  async getPresignedUrl(bucketName: string, objectName: string): Promise<string> {
    let url = await minioClient.presignedGetObject(bucketName, objectName, 24 * 60 * 60);
    // The MinIO client signs the URL with the docker-internal hostname (e.g. minio:9000).
    // Replace it with the correct public-facing URL so browsers can access it.
    // Dev:  minio:9000  → localhost:9000
    // Prod: minio:9000  → cdn.terrifictravel.co.uk (no port)
    const publicUrl = new URL(config.minio.publicUrl);
    url = url.replace(/\/\/[^/]+\//, `//${publicUrl.host}/`);
    return url;
  }

  async getObjectStream(bucketName: string, objectName: string) {
    return minioClient.getObject(bucketName, objectName);
  }

  async statObject(bucketName: string, objectName: string) {
    return minioClient.statObject(bucketName, objectName);
  }

  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    await minioClient.removeObject(bucketName, objectName);
  }
}

export const minioService = new MinioService();
