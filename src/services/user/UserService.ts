import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { AppError, HttpCode } from "../../errors/AppError";
import { UserProps } from "./user-model";
import { ValidationService } from "../validation/ValidtionService";
import { JWTService } from "../jwt/JWTService";
import * as bcrypt from "bcrypt";

export class UserService {
  private validationService = new ValidationService();
  private jwtService = new JWTService();
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

      const foundUser = await this.userRepository.findOneBy({ email });
      if (foundUser) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: "User with this email already exist!",
        });
      }

      const newUser = Object.assign(new User(), {
        firstName,
        lastName,
        email,
        password,
        role,
        active,
      });

      const hashedPassword: string = await bcrypt.hash(password, 10);
      newUser.password = hashedPassword;
      const user = await this.userRepository.save(newUser);

      const token = await this.jwtService.generateAuthToken({
        id: newUser.id,
        email: newUser.email,
      });

      return { user, token };
    } catch (error) {
      throw error;
    }
  }
  async login({ email, password }) {
    try {
      this.validationService.validateLoginBody({
        email,
        password,
      });

      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: "User doesn't exist!",
        });
      }

      this.validationService.comparePassword(password, user.password);
      const token = await this.jwtService.generateAuthToken({
        id: user.id,
        email: user.email,
      });

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  async me(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
