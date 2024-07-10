import { Request, Response, Router } from "express";
import * as AccountController from "../controller/account-controller.js";
import * as HealthController from "../controller/health-controller.js";
import { UserController } from "../controller/user-controller.js";
import path from "path";
import multer from "multer";

const router = Router();
const upload = multer();


router.get("/", (_: Request, res: Response) => {
  res.sendFile(path.join("public", "index.html"));
});

// BUSINESS
router.post("/accounts", AccountController.createAccount);
router.get("/accounts", AccountController.findAllAccounts);
router.get("/accounts/:id", AccountController.getOneAccountById);
router.post("/accounts/transfer", AccountController.transfer);

// USER

router.post("/users", UserController.create);
router.get("/users", UserController.findAll);
router.get("/users/:id", UserController.getOneAccountById);
router.delete("/users", UserController.deleteAllUsers);
router.delete("/users/:userId", UserController.deleteUser);

// MONITORING

router.get("/health", HealthController.health);

// FILES
router.post("/upload", upload.single("file"), UserController.uploadFile);

export default router;
