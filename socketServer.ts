import { Server } from "socket.io";
import { verifyTokenSocket } from "./middleware/authHandlerSocket";
import { newConnectionHandler } from "./socket_handlers/newConnectionHandler";
import { disconnectHandler } from "./socket_handlers/disconnectHandler";

const registerSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    verifyTokenSocket(socket, next);
  });

  io.on("connection", (socket) => {
    console.log(`User connected with socket_id: ${socket.id}`);

    // Make a new connection on a new User:
    newConnectionHandler(socket, io);

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });
};

export { registerSocketServer };
