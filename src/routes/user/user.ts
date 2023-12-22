import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../../controllers/user/UserController";
import { checkJWT } from "../../middlewares/checkJWT";
const userRouter = Router();
const userController = new UserController();

// @route POST /api/register
// @desc Users register
// @access Public
userRouter.post("/register", (req: Request, res: Response, next: NextFunction) =>
  userController.register(req, res, next)
);

// @route POST /api/login
// @desc Users login
// @access Public
userRouter.post("/login", (req: Request, res: Response, next: NextFunction) =>
  userController.login(req, res, next)
);

// @route GET /api/users/me
// @desc User data
// @access Private
userRouter.get(
  "/users/me",
  checkJWT,
  (req: Request, res: Response, next: NextFunction) =>
    userController.me(req, res, next)
);

export default userRouter;
