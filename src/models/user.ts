import { Photo } from "../entities/Photo";

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photos: Photo[];
  role?: string;
  active?: boolean;
  avatar?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
