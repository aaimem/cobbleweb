export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface AppErrorArgs {
  httpCode: HttpCode;
  description: string;
  isOperational?: boolean;
}

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
