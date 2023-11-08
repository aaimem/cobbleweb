import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user/UserService";
import BadRequest from "../../errors/BadRequest";
const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.register(req.body);
      return res.status(201).send({
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
      // const { token, user } = await userService.login(req.body);
      // const userInfo = {
      //   user: {
      //     email,
      //     name,
      //     podcast_username,
      //     user_id,
      //     created_at,
      //   },
      //   token: `Bearer ${token}`,
      // };
      // return res.status(200).send(userInfo);
    } catch (error) {
      // next(error);
    }
  }
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.me(req.query);
      return res.status(200).send({
        message: "User found!",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}
