import { UserService } from "../services/UserService";
const userService = new UserService();

export class UserController {
  async register(req, res, next) {
    try {
      //handle register logic
      await userService.register(req.body);
    } catch (error) {
      //handle error
    }
  }
  async login(req, res, next) {
    try {
      //handle login logic
      await userService.login(req.body);
    } catch (error) {
      //handle error
    }
  }
  async user(req, res, next) {
    try {
      //handle user logic
      await userService.user(req);
    } catch (error) {
      //handle error
    }
  }
}
