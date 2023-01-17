import { removeConnectedUser } from "../serverStore";

const disconnectHandler = (socket) => {
  removeConnectedUser(socket.id);
};

export { disconnectHandler };
