import CustomError from "./customError";

class NotFound extends CustomError {
  errorCode = 404;
  errorType = "NOT_FOUND_ERROR";

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFound.prototype);
  }

  serializeErrors() {
    return [
      {
        errorCode: this.errorCode,
        message: this.message,
      },
    ];
  }
}

export default NotFound;
