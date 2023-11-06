import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async register({ firstName, lastName, email, password, role }) {
    try {
      //handle register logic
    } catch (error) {
      //handle error
    }
  }
  async login({ email, password }) {
    try {
      //handle login logic
    } catch (error) {
      //handle error
    }
  }
  async user({ userId }) {
    try {
      //handle user logic
    } catch (error) {
      //handle error
    }
  }
}
