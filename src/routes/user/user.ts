import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../../controller/user/UserController";

const router = Router();
const userController = new UserController();

// @route POST /register
// @desc Users register
// @access Public
router.post("/register", (req: Request, res: Response, next: NextFunction) =>
  userController.register(req, res, next)
);

// @route POST /login
// @desc Users login
// @access Public
router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  userController.login(req, res, next)
);

// @route GET /users/me
// @desc User data
// @access Private
router.get("/users/me", (req: Request, res: Response, next: NextFunction) =>
  userController.me(req, res, next)
);

module.exports = router;
