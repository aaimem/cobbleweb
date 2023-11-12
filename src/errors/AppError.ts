import { HttpCode, AppErrorArgs } from "../models/app-error";

export class AppError extends Error {
  public readonly httpCode: HttpCode;
  public readonly description: string;
  public readonly isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, AppError.prototype);

    this.description = args.description;
    this.httpCode = args.httpCode;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}
