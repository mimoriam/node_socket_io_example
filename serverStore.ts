// This file will store all the data about connected users:

const connectedUsers = new Map();

const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
  console.log(connectedUsers);
};

const removeConnectedUser = (socketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log(connectedUsers);
  }
};

export { addNewConnectedUser, removeConnectedUser };
