import { Router } from "express";
import * as AccountController from "../controller/account-controller.js";
import * as HealthController from "../controller/health-controller.js";
import { UserController } from "../controller/user-controller.js";

const router = Router();
// bussiness
router.post("/accounts", AccountController.createAccount);
router.get("/accounts", AccountController.findAllAccounts);
router.get("/accounts/:id", AccountController.getOneAccountById);
router.post("/accounts/transfer", AccountController.transfer);

// users
router.post("/users", UserController.create);
router.get("/users", UserController.findAll);
router.get("/users/:id", UserController.getOneAccountById);

// monitoring
router.get("/health", HealthController.health);

export default router;
