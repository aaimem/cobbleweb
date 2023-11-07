import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { UserProps } from "./user-model";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async register({
    firstName,
    lastName,
    email,
    password,
    role,
    active,
  }: UserProps) {
    try {
      const user = Object.assign(new User(), {
        firstName,
        lastName,
        email,
        password,
        role,
        active,
      });

      return this.userRepository.save(user);
    } catch (error) {
      //handle error
      console.log("user create error");
    }
  }
  async login({ email, password }) {
    try {
      //handle login logic
    } catch (error) {
      //handle error
    }
  }
  async me() {
    try {
      //handle user logic
    } catch (error) {
      //handle error
    }
  }
}
