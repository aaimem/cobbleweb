import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user/UserService";
import { HttpCode } from "../../errors/AppError";
const userService = new UserService();
import CustomRequest from "../../../index";

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const client = await userService.register(req.body);
      if (client) {
        return res
          .status(HttpCode.CREATED)
          .send({ message: "User successfully created!" });
      }
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await userService.login(req.body);
      return res
        .status(HttpCode.OK)
        .send({ message: "Successfull login!", token });
    } catch (error) {
      next(error);
    }
  }
  async me(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const clientDetails = await userService.me(req.jwtPayload.id);
      return res.status(HttpCode.OK).send({ clientDetails });
    } catch (error) {
      next(error);
    }
  }
}
