import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { Client } from "../../entities/Client";
import { Photo } from "../../entities/Photo";
import { AppError } from "../../errors/AppError";
import { HttpCode } from "../../models/app-error";
import { ValidationService } from "../validation/ValidtionService";
import { JWTService } from "../jwt/JWTService";
import { RegisterUser, LoginUser } from "../../models/user";
import bcrypt from "bcrypt";

export class UserService {
  private validationService = new ValidationService();
  private jwtService = new JWTService();
  private userRepository = AppDataSource.getRepository(User);
  private clientRepository = AppDataSource.getRepository(Client);
  private photoRepository = AppDataSource.getRepository(Photo);

  validateRegisterBody({
    firstName,
    lastName,
    email,
    password,
    role,
    photos,
  }: RegisterUser) {
    this.validationService.validateRegisterBody({
      firstName,
      lastName,
      email,
      password,
      role,
      photos,
    });
    const allowedProperties = [
      "firstName",
      "lastName",
      "email",
      "password",
      "photos",
      "avatar",
      "active",
      "role",
    ];
    const receivedProperties = Object.keys(arguments[0]);

    const invalidProperties = receivedProperties.filter(
      (prop) => !allowedProperties.includes(prop)
    );

    if (invalidProperties.length > 0) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: `Invalid properties in the request: ${invalidProperties.join(
          ", "
        )}`,
      });
    }
  }

  async createUser({
    firstName,
    lastName,
    email,
    password,
    role,
    active,
  }: RegisterUser): Promise<User> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = Object.assign(new User(), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      role: role,
      active: active,
    });
    await this.userRepository.save(user);
    return user;
  }

  async savePhotos(photos: Photo[], userId: number): Promise<Photo[]> {
    const photo = photos.map((photo: Photo) => {
      const photoObject = Object.assign(new Photo(), {
        name: photo.name,
        url: photo.url,
        user: userId,
      });
      return photoObject;
    });
    await this.photoRepository.save(photo);
    return photo;
  }

  async createClient(
    avatar: string,
    userId: number,
    photos: Photo[]
  ): Promise<Client> {
    const client = Object.assign(new Client(), {
      avatar: avatar,
      user: userId,
      photos: photos,
    });
    await this.clientRepository.save(client);
    return client;
  }

  async register(reqBody: RegisterUser): Promise<Client> {
    try {
      this.validateRegisterBody(reqBody);

      const foundUser = await this.userRepository.findOneBy({
        email: reqBody.email,
      });
      if (foundUser) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: "User with this email already exists!",
        });
      }

      const user = await this.createUser(reqBody);
      const photos = await this.savePhotos(reqBody.photos, user.id);
      const client = await this.createClient(reqBody.avatar, user.id, photos);

      return client;
    } catch (error) {
      throw error;
    }
  }

  validateLoginBody({ email, password }: LoginUser) {
    const allowedProperties = ["email", "password"];
    const receivedProperties = Object.keys(arguments[0]);

    const invalidProperties = receivedProperties.filter(
      (prop) => !allowedProperties.includes(prop)
    );

    if (invalidProperties.length > 0) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: `Invalid properties in the request: ${invalidProperties.join(
          ", "
        )}`,
      });
    }

    this.validationService.validateLoginBody({
      email,
      password,
    });
  }

  async login({ email, password }: LoginUser) {
    this.validateLoginBody({ email, password });
    try {
      const user = await this.userRepository.findOneBy({
        email,
      });
      if (!user) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: "User doesn't exist!",
        });
      }

      await this.validationService.comparePassword(password, user.password);
      const token = await this.jwtService.generateAuthToken({
        id: user.id,
        email: user.email,
      });

      return token;
    } catch (error) {
      throw error;
    }
  }

  async me(id: number) {
    try {
      const client = await this.clientRepository.findOneBy({ id });
      const user = await this.userRepository.findOneBy({ id });
      const { password, ...rest } = user;
      const clientDetails = {
        ...rest,
        ...client,
      };
      return clientDetails;
    } catch (error) {
      throw error;
    }
  }
}
