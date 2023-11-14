import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Client } from "./entities/Client";
import { Photo } from "./entities/Photo";
import { config } from "dotenv";
config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Client, Photo],
  migrations: [],
  subscribers: [],
});
