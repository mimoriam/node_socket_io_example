import { verify } from "jsonwebtoken";
import { ErrorResponse } from "../utils/errorResponse";

const verifyTokenSocket = (socket, next) => {
  const token = socket.handshake.auth.token;

  // on the client side, use:
  // socket = io("http://localhost:5002", {
  //   auth: {
  //     token: jwtToken,
  //   },
  // });

  // On the Postman side:
  // ws://localhost:3000/socket.io/?EIO=4&transport=websocket
  // Message: 40{"token": "{{TOKEN}}"}

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  next();
};

export { verifyTokenSocket };
