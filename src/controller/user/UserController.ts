import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user/UserService";
import { HttpCode } from "../../errors/AppError";
import CustomRequest from "../../../index";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.register(req.body);
      return res
        .status(HttpCode.CREATED)
        .send({ message: "User successfully created!" });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await userService.login(req.body);
      return res
        .status(HttpCode.OK)
        .send({ message: "Successful login!", token });
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
