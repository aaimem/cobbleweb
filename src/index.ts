import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { User } from "./entity/User";

require("dotenv").config();
const port = process.env.SERVER_PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json());
    app.listen(port);
    console.log(
      `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`
    );
  })
  .catch((error) => console.log(error));
