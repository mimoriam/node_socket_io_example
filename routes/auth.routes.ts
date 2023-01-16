import { Router } from "express";
import { getMe, login, register } from "../controllers/auth.controller";
import { protect } from "../middleware/authHandler";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.get("/me", protect, getMe);
export { router };
