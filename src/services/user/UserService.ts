import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { AppError, HttpCode } from "../../errors/AppError";
import { UserProps } from "./user-model";
import { ValidationService } from "../validation/ValidtionService";

export class UserService {
  private validationService = new ValidationService();
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
      this.validationService.validateRegisterBody({
        firstName,
        lastName,
        email,
        password,
      });

      const user = Object.assign(new User(), {
        firstName,
        lastName,
        email,
        password,
        role,
        active,
      });

      const foundUser = await this.userRepository.findOneBy({ email });
      if (foundUser) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: "User with this email already exist!",
        });
      }

      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }
  async login({ email, password }) {
    try {
      //handle login logic
    } catch (error) {
      throw error;
    }
  }

  async me() {
    try {
      //handle user logic
    } catch (error) {
      throw error;
    }
  }
}
