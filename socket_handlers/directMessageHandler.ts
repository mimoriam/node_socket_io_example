import { AppDataSource } from "../app";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import { Like } from "typeorm";

const directMessageHandler = async (socket, data) => {
  // Message event should be of type:
  // 42["direct-message", {"receiverUserId": "2", "content": "message1"}]

  // on the client side with event emitted of type "direct-message":
  // sendDirectMessage({receiverUserId: id, content: message});
  try {
    const messageRepo = AppDataSource.getRepository(Message);
    const conversationRepo = AppDataSource.getRepository(Conversation);

    const { id } = socket.user;
    console.log(socket.user);
    const { receiverUserId, content } = data;

    // New message:
    const message = await messageRepo.create({
      content: content,
      author: id,
      type: "DIRECT",
    });

    await messageRepo.save(message);

    // Find if conversation exists between two users - if not, create:
    const conversation = await conversationRepo.findOne({
      where: {
        // participantsId: Like(`%${id},${receiverUserId}%`),
        participantsId: `${id},${receiverUserId}`,
      },
    });

    console.log(conversation);

    if (conversation) {
      conversation.messages.push(message);
      await conversationRepo.save(conversation);
    } else {
      const newConversation = await conversationRepo.create({
        messages: [message],
        participants: [socket.user, receiverUserId],
        participantsId: [id, receiverUserId],
      });

      await conversationRepo.save(newConversation);
    }
  } catch (err) {
    console.log(err);
  }
};

export { directMessageHandler };
