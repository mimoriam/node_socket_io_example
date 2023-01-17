import { Router } from "express";
import { protect } from "../middleware/authHandler";
import {
  acceptFriend,
  inviteFriend,
  rejectFriend,
} from "../controllers/friend-invite.controller";

const router = Router();

router.post("/invite", protect, inviteFriend);
router.post("/accept", protect, acceptFriend);
router.post("/reject", protect, rejectFriend);

export { router };
