import { asyncHandler } from "../middleware/asyncHandler";
import { AppDataSource } from "../app";
import { ErrorResponse } from "../utils/errorResponse";
import { User } from "../models/User";
import { FriendInvitation } from "../models/FriendInvitation";
import { updateFriendsPendingInvitations } from "../socket_handlers/updates/friends";

// @desc      Invite friend
// @route     POST /api/v1/friend-invite/invite
// @access    Private
const inviteFriend = asyncHandler(async (req, res, next) => {
  const userRepo = AppDataSource.getRepository(User);
  const friendInviteRepo = AppDataSource.getRepository(FriendInvitation);
  // User's email we would like to invite
  // Friend system is via email atm
  const { targetEmail } = req.body;

  const { id, email } = req.user;

  // Check if friend that we would like to invite is not User:
  if (email.toLowerCase() === targetEmail.toLowerCase()) {
    return next(
      new ErrorResponse("Sorry. You cannot become friend with yourself", 409)
    );
  }

  const targetUser = await userRepo.findOne({
    where: {
      email: targetEmail.toLowerCase(),
    },
  });

  if (!targetUser) {
    return next(
      new ErrorResponse(
        `Friend of ${targetEmail} has not been found. Please check mail address.`,
        404
      )
    );
  }

  // Check if invitation has been already sent:
  const invitationAlreadyReceived = await friendInviteRepo
    .createQueryBuilder("s")
    .select()
    .where("s.sender = :aId", { aId: id })
    .andWhere("s.receiver = :targetId", { targetId: targetUser.id })
    .getOne();

  if (invitationAlreadyReceived) {
    return next(new ErrorResponse("Invitation has been already sent", 409));
  }

  // Check if the user we would like to invite is already our friend:
  const userAlreadyFriends = targetUser.friendInvitationSent.find(
    (friendId) => friendId.toString() === id.toString()
  );

  if (userAlreadyFriends) {
    return next(
      new ErrorResponse("Friend already added. Please check friends list", 409)
    );
  }

  // Create new invitation in the DB:
  const newInvitation = new FriendInvitation();
  newInvitation.sender = id;
  newInvitation.receiver = targetUser;
  newInvitation.senderId = id;
  newInvitation.receiverId = targetUser.id;

  await friendInviteRepo.save(newInvitation);

  // if invitation has been successfully created we would like to update friends invitations if other user is online
  updateFriendsPendingInvitations(targetUser.id.toString());

  return res.status(201).json({
    message: "Invitation has been sent successfully!",
  });
});

// @desc      Accept friend request
// @route     POST /api/v1/friend-invite/accept
// @access    Private
const acceptFriend = asyncHandler(async (req, res, next) => {});

// @desc      Reject friend request
// @route     POST /api/v1/friend-invite/reject
// @access    Private
const rejectFriend = asyncHandler(async (req, res, next) => {
  try {
    const friendInviteRepo = AppDataSource.getRepository(FriendInvitation);
    const { id } = req.body;
    const { id: userId } = req.user;

    const invitationExists = await friendInviteRepo.findOne({
      where: {
        id: id,
      },
    });

    console.log(invitationExists);

    if (invitationExists) {
      await friendInviteRepo.delete(id);
    } else {
      return next(new ErrorResponse("Friend doesn't exist", 404));
    }

    updateFriendsPendingInvitations(userId);

    return res.status(200).json({
      message: "Invitation successfully rejected",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong please try again");
  }
});

export { inviteFriend, acceptFriend, rejectFriend };
