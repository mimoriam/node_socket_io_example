import { verify } from "jsonwebtoken";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "./asyncHandler";
import { AppDataSource } from "../app";
import { User } from "../models/User";

export const protect = asyncHandler(async (req, res, next) => {
  const userRepo = AppDataSource.getRepository(User);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET);

    // req.user = await User.findById(decoded.id);

    req.user = await userRepo.findOne({
      where: {
        id: decoded["id"],
      },
    });

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
