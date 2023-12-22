import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import 'dotenv/config';
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
const port = parseInt(process.env.PORT, 10) || 4000;
import userRouter from "./routes/user/user";
import photosRouter from "./routes/photos/photos";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json({ limit: "100mb" }));

    app.use("/api", userRouter);
    app.use("/api/photos", photosRouter);
    app.use(errorHandler);

    app.listen(port);
    console.log(
      `Express server has started on port ${port} 🚀`
    );
  })
  .catch((error) => console.log(error));
