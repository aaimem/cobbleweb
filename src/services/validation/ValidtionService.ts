import { AppError, HttpCode } from "../../errors/AppError";

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const minLength = 2;
const maxLength = 25;
const firstNameRegex = new RegExp(`^[a-zA-Z]{${minLength},${maxLength}}$`);
const lastNameRegex = new RegExp(`^[a-zA-Z]{${minLength},${maxLength}}$`);
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

    if (!passwordRegex.test(password))
      error =
        "Password should be minimum 6 characters, maximum 50 characters and contains 1 number.";

    if (!emailRegex.test(email)) error = "Invalid email formatting.";

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
}
