import { addNewConnectedUser } from "../serverStore";

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;

  addNewConnectedUser({
    socketId: socket.id,
    // Change the values below depending on the ID coming from JWT:
    userId: userDetails.id,
  });
};

export { newConnectionHandler };
