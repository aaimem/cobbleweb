import CustomError from "./customError";

class BadRequest extends CustomError {
  errorCode = 400;
  errorType = "BAD_REQUEST_ERROR";

  constructor(message: string, private property: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequest.prototype);
  }

  serializeErrors() {
    return [
      {
        errorCode: this.errorCode,
        message: this.message,
        property: this.property,
      },
    ];
  }
}

export default BadRequest;
