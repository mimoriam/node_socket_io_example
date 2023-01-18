import { Server } from "socket.io";
import { verifyTokenSocket } from "./middleware/authHandlerSocket";
import { newConnectionHandler } from "./socket_handlers/newConnectionHandler";
import { disconnectHandler } from "./socket_handlers/disconnectHandler";
import { getOnlineUsers, setSocketServerInstance } from "./serverStore";
import { instrument } from "@socket.io/admin-ui";

const registerSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://admin.socket.io",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Using manually created socket instance here:
  setSocketServerInstance(io);

  instrument(io, {
    auth: false,
    mode: "development",
  });

  io.use((socket, next) => {
    verifyTokenSocket(socket, next);
  });

  const emitOnlineUsers = () => {
    const onlineUsers = getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  io.on("connection", (socket) => {
    // console.log(`User connected with socket_id: ${socket.id}`);

    // Make a new connection on a new User:
    newConnectionHandler(socket, io);
    emitOnlineUsers();

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  // Emit online users every 2 secs:
  setInterval(() => {
    emitOnlineUsers();
  }, 1000 * 2);
};

export { registerSocketServer };
