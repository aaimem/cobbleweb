import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
// import BadRequest from "../../errors/BadRequest";
import { AppError, HttpCode } from "../../errors/AppError";
// import NotFound from "../../errors/NotFound";
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

      const foundUser = await this.userRepository.findOneBy({ email });
      if (foundUser) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: "User with this email already exist!",
        });

        // throw new BadRequest("User with this email already exist!", "email");
      }

      if (firstName.length < 2 || lastName.length < 2) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description:
            "First name field and last name field should be minimum of 2 characters.",
        });
        // throw new BadRequest(
        //   "First name field and last name field should be minimum of 2 characters.",
        //   "name"
        // );
      }

      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }
  async login({ email, password }) {
    try {
      //handle login logi
    } catch (error) {
      //handle error
    }
  }

  async me({ email }: any) {
    try {
      const foundUser = await this.userRepository.findOneBy({ email });
      if (!foundUser) {
        // throw new AppError({
        //   httpCode: HttpCode.NOT_FOUND,
        //   description: "User doesn't exist!",
        // });
        throw new Error();
        // throw new NotFound("User doesn't exist!");
      }

      return foundUser;
    } catch (error) {
      throw error;
    }
  }
}
