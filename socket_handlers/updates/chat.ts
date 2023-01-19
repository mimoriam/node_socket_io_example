import { AppDataSource } from "../../app";
import { Conversation } from "../../models/Conversation";
import {
  getActiveConnections,
  getSocketServerInstance,
} from "../../serverStore";

const updateChatHistory = async (
  conversationId,
  toSpecifiedSocketId = null
) => {
  const conversationRepo = AppDataSource.getRepository(Conversation);
  const conversation = await conversationRepo.findOne({
    relations: {
      messages: true,
      participants: true,
    },
    where: {
      id: conversationId,
    },
  });

  if (conversation) {
    const io = getSocketServerInstance();

    if (toSpecifiedSocketId) {
      return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
        messages: conversation.messages,
        participants: conversation.participants,
      });
    }

    // check if users of this conversation are online
    // if yes emit to them update of messages

    conversation.participants.forEach((userId) => {
      const activeConnections = getActiveConnections(userId.toString());

      activeConnections.forEach((socketId) => {
        io.to(socketId).emit("direct-chat-history", {
          messages: conversation.messages,
          participants: conversation.participants,
        });
      });
    });
  }
};

export { updateChatHistory };
