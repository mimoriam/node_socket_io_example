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

const updateFriends = async (userId) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const receiverList = getActiveConnections(userId);

    if (receiverList.length > 0) {
      const user = await userRepo.findOne({
        where: {
          id: userId,
        },
        select: {
          id: true,
          friends: true,
        },
      });

      if (user) {
        const friendsList = user.friends;

        const io = getSocketServerInstance();

        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("friends-list", {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export { updateFriendsPendingInvitations, updateFriends };
