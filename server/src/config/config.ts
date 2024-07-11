import dotenv from "dotenv";

dotenv.config();

interface Env {
  PORT: number;
  DB_URL: string;
  MINIO_ROOT_USER: string;
  MINIO_ROOT_PASSWORD: string;
  MINIO_SERVER_PORT: number;
  MINIO_HOST: string;
  MINIO_BUCKET_NAME: string;
  MINIO_ENDPOINT: string;
}

const config = (): Env => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
    DB_URL: process.env.DB_URL ? process.env.DB_URL : "value_not_provided",
    MINIO_ROOT_USER: process.env.MINIO_ROOT_USER ? process.env.MINIO_ROOT_USER : "",
    MINIO_ROOT_PASSWORD: process.env.MINIO_ROOT_PASSWORD ? process.env.MINIO_ROOT_PASSWORD : "",
    MINIO_SERVER_PORT: process.env.MINIO_SERVER_PORT ? Number(process.env.MINIO_SERVER_PORT) : 9000,
    MINIO_HOST: process.env.MINIO_HOST ? process.env.MINIO_HOST : "",
    MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME ? process.env.MINIO_BUCKET_NAME : "",
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT ? process.env.MINIO_ENDPOINT : "localhost:9000",
  };
};

export default config;
