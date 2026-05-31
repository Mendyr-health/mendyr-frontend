import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { createChildLogger } from "./logger";

const log = createChildLogger("storage");

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin",
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET = process.env.S3_BUCKET || "mendyr-uploads";

/**
 * Upload a file to S3/MinIO.
 * Returns the storage key (path) for later retrieval.
 */
export async function uploadFile(
  file: Buffer | Uint8Array,
  options: {
    fileName: string;
    mimeType: string;
    folder?: string; // e.g. "nurse-documents", "avatars"
  }
): Promise<{ key: string; url: string }> {
  const ext = options.fileName.split(".").pop() || "bin";
  const key = `${options.folder || "uploads"}/${nanoid(16)}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: options.mimeType,
    })
  );

  log.info({ key, size: file.length }, "File uploaded");

  return {
    key,
    url: `${process.env.S3_ENDPOINT}/${BUCKET}/${key}`,
  };
}

/**
 * Generate a presigned URL for downloading a file (valid 1 hour).
 */
export async function getPresignedUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn });
}

/**
 * Delete a file from S3/MinIO.
 */
export async function deleteFile(key: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
  log.info({ key }, "File deleted");
}

export { s3, BUCKET };
