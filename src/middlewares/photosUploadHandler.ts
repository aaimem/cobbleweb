import { Response, NextFunction } from "express";
import CustomRequest from "../../index";

export const photosUploadHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      const boundary = req.headers["content-type"].split("boundary=")[1];
      const parts = data.split(`--${boundary}`);
      const fileData = parts[1];
      req.file = fileData;
      next();
    });
  } else {
    next();
  }
};
