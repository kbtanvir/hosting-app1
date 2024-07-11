import { Client as MinioClient } from "minio";
import config from "../config/config.js";

const MINIO_HOST = config().MINIO_HOST;
const MINIO_SERVER_PORT = config().MINIO_SERVER_PORT;
const MINIO_ACCESS_KEY = config().MINIO_ROOT_USER;
const MINIO_SECRET_KEY = config().MINIO_ROOT_PASSWORD;
const MINIO_BUCKET_NAME = config().MINIO_BUCKET_NAME;

const minioClient = new MinioClient({
  endPoint: MINIO_HOST,
  port: MINIO_SERVER_PORT,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
  useSSL: false,
});

(async () => {
  const bucketExists = await minioClient.bucketExists(MINIO_BUCKET_NAME!);
  if (!bucketExists) {
    await minioClient.makeBucket(MINIO_BUCKET_NAME!, "us-east-1");
  }
})();

export { minioClient, MINIO_BUCKET_NAME };
