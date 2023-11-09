import * as jwt from "jsonwebtoken";

export class JWTService {
  async generateAuthToken({ id, email }: { id: number; email: string }) {
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    return token;
  }
}
