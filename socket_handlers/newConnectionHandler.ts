import { addNewConnectedUser } from "../serverStore";
import { updateFriendsPendingInvitations } from "./updates/friends";

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;

  addNewConnectedUser({
    socketId: socket.id,
    // Change the values below depending on the ID coming from JWT:
    userId: userDetails.id,
  });

  // Update pending friends invitations list
  updateFriendsPendingInvitations(userDetails.id);
};

export { newConnectionHandler };
