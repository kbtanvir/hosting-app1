import { Request, Response } from "express";
import * as UserService from "../service/user-service.js";

import { Readable } from "stream";
import { minioClient, MINIO_BUCKET_NAME } from "../config/minio-client.js";

export class UserController {
  static async create(req: Request, res: Response) {
    const result = await UserService.create(req.body);
    res.status(201).json(result);
  }

  static async findAll(req: Request, res: Response) {
    const users = await UserService.findAll();
    res.status(200).json(users);
  }

  static async getOneAccountById(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await UserService.findById(id);

    if (!result) {
      res.status(404).send();
    } else {
      res.status(200).json(result);
    }
  }

  static async uploadFile(req: Request, res: Response) {
    const { username, email, subdomain } = req.body;
    const file = req.file;

    if (username && email && subdomain && file) {
      const filename = file.originalname;
      const objectName = `${subdomain}/${filename}`;
      const fileStream = Readable.from(file.buffer);

      await minioClient.putObject(MINIO_BUCKET_NAME!, objectName, fileStream, file.size, {
        "Content-Type": "text/html",
      });

      if (filename.toLowerCase() === "index.html") {
        await minioClient.putObject(MINIO_BUCKET_NAME!, `${subdomain}/index.html`, fileStream, file.size, {
          "Content-Type": "text/html",
        });
      }

      await UserService.create({ username, email, subdomain, status: "active" });
      res.status(201).json({ message: "File uploaded successfully" });
    } else {
      res.status(400).json({ message: "Invalid input" });
    }
  }

  static async deleteAllUsers(req: Request, res: Response) {
    const users = await UserService.findAll();

    for (const user of users) {
      const objectsToDelete = await minioClient.listObjectsV2(MINIO_BUCKET_NAME!, user.subdomain, true);
      for await (const obj of objectsToDelete) {
        await minioClient.removeObject(MINIO_BUCKET_NAME!, obj.name);
      }
    }

    await UserService.deleteAll();
    res.status(200).json({ message: "All users and their files deleted successfully" });
  }

  static async deleteUser(req: Request, res: Response) {
    const userId = req.params.userId;
    const user = await UserService.findById(userId as string);

    if (user) {
      const objectsToDelete = await minioClient.listObjectsV2(MINIO_BUCKET_NAME!, user.subdomain, true);
      for await (const obj of objectsToDelete) {
        await minioClient.removeObject(MINIO_BUCKET_NAME!, obj.name);
      }

      await UserService.deleteById(userId as string);
      res.status(200).json({ message: "User and their files deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
}
