import { Request, Response, NextFunction } from "express";
import { AppError, HttpCode } from "../errors/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.httpCode).send({ error: err });
  }

  res.status(HttpCode.INTERNAL_SERVER_ERROR).send({
    error: {
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      message: "Something went wrong",
    },
  });
};
