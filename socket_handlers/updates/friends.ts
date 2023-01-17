import { AppDataSource } from "../../app";
import { User } from "../../models/User";
import { FriendInvitation } from "../../models/FriendInvitation";
import {
  getActiveConnections,
  getSocketServerInstance,
} from "../../serverStore";

const updateFriendsPendingInvitations = async (userId) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const friendInviteRepo = AppDataSource.getRepository(FriendInvitation);
    const pendingInvitations = await friendInviteRepo.find({
      where: {
        receiverId: userId,
      },
    });

    // Find all active connections of specific userId
    const receiverList = getActiveConnections(userId);

    const io = getSocketServerInstance();

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-invitations", {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export { updateFriendsPendingInvitations };
