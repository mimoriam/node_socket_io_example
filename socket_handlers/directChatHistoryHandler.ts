import { AppDataSource } from "../app";
import { Conversation } from "../models/Conversation";
import { updateChatHistory } from "./updates/chat";

const directChatHistoryHandler = async (socket, data) => {
  try {
    const conversationRepo = AppDataSource.getRepository(Conversation);

    const { id } = socket.user;
    const { receiverUserId } = data;

    const conversation = await conversationRepo.findOne({
      relations: {
        messages: true,
      },
      where: {
        // participantsId: Like(`%${id},${receiverUserId}%`),
        participantsId: `${id},${receiverUserId}`,
        messages: {
          type: "DIRECT",
        },
      },
    });

    if (conversation) {
      updateChatHistory(conversation.id.toString(), socket.id);
    }
  } catch (err) {
    console.log(err);
  }
};

export { directChatHistoryHandler };
