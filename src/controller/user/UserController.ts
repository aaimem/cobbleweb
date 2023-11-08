import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user/UserService";
import { HttpCode } from "../../errors/AppError";
const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.register(req.body);
      return res.status(HttpCode.CREATED).send({
        message: "User successfully created!",
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      //handle login logic
    } catch (error) {
      next(error);
    }
  }
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      //handle login logic
    } catch (error) {
      next(error);
    }
  }
}
