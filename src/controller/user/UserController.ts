import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user/UserService";
const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      //handle register logic
      const user = await userService.register(req.body);
      console.log("user", user);
      return res.status(200).json(user);
    } catch (error) {
      // next(new Error("error occured"));
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      //handle login logic
      await userService.login(req.body);
    } catch (error) {
      // next(new Error("error occured"));
    }
  }
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      //handle user logic
      await userService.me();
    } catch (error) {
      // next(new Error("error occured"));
    }
  }
}
