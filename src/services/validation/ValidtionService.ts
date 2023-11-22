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
    const errors = [];

    if (!firstNameRegex.test(firstName))
      errors.push({
        field: "firstName",
        message: "(Min: 2 chars, Max: 25 chars)",
      });

    if (!lastNameRegex.test(lastName))
      errors.push({
        field: "lastName",
        message: "(Min: 2 chars, Max: 25 chars)",
      });

    if (!emailRegex.test(email))
      errors.push({ field: "email", message: "Invalid email." });

    if (!passwordRegex.test(password))
      errors.push({
        field: "password",
        message: "(Min: 6 chars, max: 50 chars, At least contains 1 number)",
      });

    if (photos.length < 4) {
      errors.push({
        field: "photos",
        message: "At least 4 photos are required during registration.",
      });
    } else {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (!photo.name.trim() || !photo.url.trim()) {
          errors.push({
            field: `name is required`,
            message: "url is required.",
          });
        }
      }
    }

    if (errors.length > 0)
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        errors: errors,
      });
  }

  validateLoginBody({ email = "", password = "" }: LoginUser) {
    const errors = [];

    if (!emailRegex.test(email))
      errors.push({ field: "email", message: "Invalid email." });

    if (!passwordRegex.test(password))
      errors.push({
        field: "password",
        message: "(Min: 6 chars, max: 50 chars, At least contains 1 number)",
      });

    if (errors.length > 0)
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        errors: errors,
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
