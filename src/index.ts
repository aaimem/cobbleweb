import * as express from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import { config } from "dotenv";
import errorHandler from "./middlewares/errorHandler";

config();
const port = parseInt(process.env.PORT, 10) || 3000;
const userRouter = require("./routes/user/user");

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json({ limit: "50mb" }));

    app.use("/api", userRouter);

    app.use(errorHandler);

    app.listen(port);
    console.log(
      `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`
    );
  })
  .catch((error) => console.log(error));
