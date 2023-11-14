import { Router, Request, Response } from "express";
import { photosUploadHandler } from "../../middlewares/photosUploadHandler";
import { HttpCode } from "../../models/app-error";
import CustomRequest from "../../../index";
import fs from "fs";
import path from "path";
const router = Router();

// @route GET /api/photos
// @desc Photos
// @access Public
router.get("/", async (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "../../public", "index.html");
  fs.readFile(filePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
    if (err) {
      console.error(`Error reading file "${filePath}":`, err);
      if (err.code === "ENOENT") {
        return res.status(HttpCode.NOT_FOUND).json({
          httpCode: HttpCode.NOT_FOUND,
          error: "File not found.",
        });
      }
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        error: "Internal Server Error. Failed to read the file.",
      });
    }
    res.writeHead(HttpCode.OK, { "Content-Type": "text/html" });
    res.end(data);
  });
});

// @route POST /api/photos/upload
// @desc Upload photos
// @access Public
router.post(
  "/upload",
  photosUploadHandler,
  (req: CustomRequest, res: Response) => {
    const file = req.file;
    const fileNameRegex = /filename="(.+?)"/;
    const fileNameMatch = file.match(fileNameRegex);
    if (!fileNameMatch) {
      res.status(HttpCode.BAD_REQUEST).json({
        httpCode: HttpCode.BAD_REQUEST,
        error: "No files were uploaded.",
      });
      return res.end();
    }
    const fileName = fileNameMatch[1];
    const uploadPath = path.join(__dirname, "../../uploads", fileName);
    fs.writeFile(uploadPath, fileName, "binary", (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          return res.status(HttpCode.NOT_FOUND).json({
            httpCode: HttpCode.NOT_FOUND,
            error: "Uploads folder not found.",
          });
        }
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
      }
      res.status(HttpCode.OK).json({
        httpCode: HttpCode.OK,
        error: "File uploaded successfully!",
      });
      return res.end();
    });
  }
);

module.exports = router;
