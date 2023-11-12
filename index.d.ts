import { Request } from "express";

interface CustomRequest extends Request {
  jwtPayload?: any;
  file?: any;
}

export default CustomRequest;
