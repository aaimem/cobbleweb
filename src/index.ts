import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import { config } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
const port = parseInt(process.env.PORT, 10) || 3000;
const userRouter = require("./routes/user/user");
const photosRouter = require("./routes/photos/photos");
config();

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json({ limit: "100mb" }));

    app.use("/api", userRouter);
    app.use("/api/photos", photosRouter);
    app.use(errorHandler);

    app.listen(port);
    console.log(
      `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`
    );
  })
  .catch((error) => console.log(error));
