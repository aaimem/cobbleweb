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

interface LoginUserProps {
  email: string;
  password: string;
}

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
    photos,
  }: RegisterUserProps) {
    this.validationService.validateRegisterBody({
      firstName,
      lastName,
      email,
      password,
      photos,
    });
  }

  async createUser({
    firstName,
    lastName,
    email,
    password,
    role,
    active,
  }: RegisterUserProps): Promise<User> {
    const newUser = Object.assign(new User(), {
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
      role,
      active,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async savePhotos(photos: Photo[], userId: number): Promise<Photo[]> {
    const clientPhotos = photos.map((photo: Photo) => {
      const photoObject = Object.assign(new Photo(), {
        name: photo.name,
        url: photo.url,
        user: userId,
      });
      return photoObject;
    });
    await this.photoRepository.save(clientPhotos);
    return clientPhotos;
  }

  async createClient(
    avatar: string,
    userId: number,
    clientPhotos: Photo[]
  ): Promise<Client> {
    const newClient = Object.assign(new Client(), {
      avatar,
      user: userId,
      photos: clientPhotos,
    });
    const client = await this.clientRepository.save(newClient);
    return client;
  }

  async register(reqBody: RegisterUserProps): Promise<Client> {
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

      const newUser = await this.createUser(reqBody);
      const clientPhotos = await this.savePhotos(reqBody.photos, newUser.id);
      const client = await this.createClient(
        reqBody.avatar,
        newUser.id,
        clientPhotos
      );

      return client;
    } catch (error) {
      throw error;
    }
  }

  validateLoginBody({ email, password }) {
    this.validationService.validateLoginBody({
      email,
      password,
    });
  }

  async login({ email, password }: LoginUserProps) {
    try {
      this.validateLoginBody({ email, password });

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
