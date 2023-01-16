import { Server } from "socket.io";

const registerSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected with socket_id: ${socket.id}`);
  });
};

export { registerSocketServer };
