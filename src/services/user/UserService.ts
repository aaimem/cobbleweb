import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { Client } from "../../entity/Client";
import { Photo } from "../../entity/Photo";
import { AppError, HttpCode } from "../../errors/AppError";
import { ValidationService } from "../validation/ValidtionService";
import { JWTService } from "../jwt/JWTService";
import bcrypt from "bcrypt";

interface RegisterUserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  photos: Photo[];
  avatar: string;
}

export class UserService {
  private validationService = new ValidationService();
  private jwtService = new JWTService();
  private userRepository = AppDataSource.getRepository(User);
  private clientRepository = AppDataSource.getRepository(Client);
  private photoRepository = AppDataSource.getRepository(Photo);

  async register({
    firstName,
    lastName,
    email,
    password,
    role,
    active,
    photos,
    avatar,
  }: RegisterUserProps) {
    try {
      this.validationService.validateRegisterBody({
        firstName,
        lastName,
        email,
        password,
        photos,
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
        password: bcrypt.hashSync(password, 10),
        role,
        active,
      });
      await this.userRepository.save(newUser);
      const clientPhotos = photos.map((photo: Photo) => {
        const photoObject = Object.assign(new Photo(), {
          name: photo.name,
          url: photo.url,
          user: newUser.id,
        });
        return photoObject;
      });
      await this.photoRepository.save(clientPhotos);
      const newClient = Object.assign(new Client(), {
        avatar,
        user: newUser.id,
        photos: clientPhotos,
      });
      const client = await this.clientRepository.save(newClient);
      return client;
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
