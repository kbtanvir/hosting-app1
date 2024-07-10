import type { Router } from "express";
import { createRouter } from "../utils/create";
import {
  handleAddUser,
  handleDeleteUser,
  handleGetAllUser,
  handleGetOneUser,
  handleUpdateUser,
  userController,
} from "./controllers";

const userRouter = createRouter((router: Router) => {
  // router.get("/", userController.getAll);
  router.get("/", handleGetAllUser);
  router.post("/", handleAddUser);
  router.put("/", handleUpdateUser);

  router.get("/:id", handleGetOneUser);
  router.delete("/:id", handleDeleteUser);
});

export default userRouter;
