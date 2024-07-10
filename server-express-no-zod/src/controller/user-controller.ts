import { Request, Response } from "express";
import * as UserService from "../service/user-service.js";

export class UserController {
  static async create(req: Request, res: Response) {
    const result = await UserService.create(req.body);
    res.status(201).json(result);
  }
  static async findAll(req: Request, res: Response) {
    const accounts = await UserService.findAll();
    res.status(200).json(accounts);
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
}
 
// export const createAccount = async (req: Request, res: Response) => {
//   const result = await UserService.create(req.body);
//   res.status(201).json(result);
// };

// export const findAllAccounts = async (req: Request, res: Response) => {
//   const accounts = await UserService.findAll();
//   res.status(200).json(accounts);
// };

// export const getOneAccountById = async (req: Request, res: Response) => {
//   const id = String(req.params.id);
//   const result = await UserService.findById(id);

//   if (!result) {
//     res.status(404).send();
//   } else {
//     res.status(200).json(result);
//   }
// };
