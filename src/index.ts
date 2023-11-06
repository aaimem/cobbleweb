import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { config } from "dotenv";

config();
const port = process.env.SERVER_PORT || 3000;
const userRouter = require("./routes/user");

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json({ limit: "50mb" }));

    //api routes
    app.use("/api", userRouter);

    app.listen(port);
    console.log(
      `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`
    );
  })
  .catch((error) => console.log(error));
