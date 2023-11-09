import { AppError, HttpCode } from "../../errors/AppError";
import * as bcrypt from "bcrypt";

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[0-9]).{6,50}$/;

export class ValidationService {
  validateRegisterBody({
    firstName = "",
    lastName = "",
    email = "",
    password = "",
  }: Errors) {
    let error = "";
    const minLength = 2;
    const maxLength = 25;
    const firstNameRegex = new RegExp(`^[a-zA-Z]{${minLength},${maxLength}}$`);
    const lastNameRegex = new RegExp(`^[a-zA-Z]{${minLength},${maxLength}}$`);
    if (!passwordRegex.test(password))
      error =
        "Password should be minimum 6 characters and maximum 50 characters with 1 number.";
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

  validateLoginBody({ email = "", password = "" }) {
    let error = "";
    if (!passwordRegex.test(password))
      error = "Password should be minimum 6 characters with 1 number.";
    if (!emailRegex.test(email)) error = "Invalid email format.";
    if (error)
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
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
