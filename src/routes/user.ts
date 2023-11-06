import { Router } from "express";
import { UserController } from "../controller/UserController";

const router = Router();
const userController = new UserController();

// @route POST /register
// @desc Users register
// @access Public
router.post("/register", (req, res, next) =>
  userController.register(req, res, next)
);

// @route POST /login
// @desc Users login
// @access Public
router.post("/login", (req, res, next) => userController.login(req, res, next));

// @route GET /users/me
// @desc User data
// @access Private
router.get("/users/me", (req, res, next) =>
  userController.user(req, res, next)
);

module.exports = router;
