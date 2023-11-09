import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user/UserService";
import { HttpCode } from "../../errors/AppError";
const userService = new UserService();
import CustomRequest from "../../../index";

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await userService.register(req.body);
      const { password, ...rest } = user;
      const userDetails = {
        user: rest,
        token,
        message: "User successfully created!",
      };
      return res.status(HttpCode.CREATED).send(userDetails);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await userService.login(req.body);
      const { password, ...rest } = user;
      const userDetails = {
        user: rest,
        token,
        message: "Successfully login!",
      };
      return res.status(HttpCode.OK).send(userDetails);
    } catch (error) {
      next(error);
    }
  }
  async me(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.me(req.jwtPayload.id);
      return res.status(HttpCode.OK).send(user);
    } catch (error) {
      next(error);
    }
  }
}
