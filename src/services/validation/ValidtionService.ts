import { AppError } from "../../errors/AppError";
import { HttpCode } from "../../models/app-error";
import bcrypt from "bcrypt";
import { RegisterUser, LoginUser } from "../../models/user";

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 25;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[0-9]).{6,50}$/;
const firstNameRegex = new RegExp(
  `^[a-zA-Z]{${MIN_NAME_LENGTH},${MAX_NAME_LENGTH}}$`
);
const lastNameRegex = new RegExp(
  `^[a-zA-Z]{${MIN_NAME_LENGTH},${MAX_NAME_LENGTH}}$`
);

export class ValidationService {
  validateRegisterBody({
    firstName = "",
    lastName = "",
    email = "",
    password = "",
    photos = [],
  }: RegisterUser) {
    let error = "";
    if (photos.length < 4) {
      error = "At least 4 photos are required during registration.";
    }
    if (!passwordRegex.test(password))
      error =
        "Password should be minimum 6 characters to maximum 50 characters long and 1 number.";
    if (!emailRegex.test(email)) error = "Invalid email format.";
    if (!lastNameRegex.test(lastName))
      error =
        "Last name should be minimum 2 characters and maximum 25 characters.";
    if (!firstNameRegex.test(firstName))
      error =
        "First name should be minimum 2 characters and maximum 25 characters.";
    if (error)
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: error,
      });
  }

  validateLoginBody({ email = "", password = "" }: LoginUser) {
    let error = "";
    if (!passwordRegex.test(password))
      error = "Password should be minimum 6 characters and 1 number.";
    if (!emailRegex.test(email)) error = "Invalid email format.";
    if (error)
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description: error,
      });
  }

  async comparePassword(password: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch)
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description: "Invalid password. Please try again.",
      });
  }
}
