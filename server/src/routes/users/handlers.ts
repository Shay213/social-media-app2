import { RouteHandler } from "fastify";
import type { getUserParams, AddRemoveFriendParams } from "./schemas";

export const getUser: RouteHandler<{ Params: getUserParams }> = async (
  req,
  reply
) => {
  const { id } = req.params;
  try {
    const user = await req.server.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        _count: { select: { friends: true } },
      },
    });
    return reply.code(200).send({
      user,
      friendsCount: user?._count.friends ?? 0,
    });
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};

export const getUserFriends: RouteHandler<{ Params: getUserParams }> = async (
  req,
  reply
) => {
  const { id } = req.params;

  try {
    const user = await req.server.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        friends: true,
      },
    });
    return reply.code(200).send(user?.friends);
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};

export const addRemoveFriend: RouteHandler<{
  Params: AddRemoveFriendParams;
}> = async (req, reply) => {
  const { id, friendId } = req.params;
  try {
    const user = await req.server.prisma.user.findUnique({
      where: { id },
      include: {
        friends: { where: { id: friendId } },
      },
    });
    const friend = await req.server.prisma.user.findUnique({
      where: { id: friendId },
      include: {
        friends: { where: { id } },
      },
    });

    if (!friend || !user)
      return req.server.handleErr(reply, "User or friend doesn't exist", 404);

    if (!user?.friends.length) {
      // CREATE FRIEND RECORDS FOR BOTH USERS
      await req.server.prisma.friend.create({
        data: {
          id: friendId,
          firstName: friend.firstName,
          lastName: friend.lastName,
          location: friend.location,
          occupation: friend.occupation,
          picturePath: friend.picturePath,
          user: { connect: { id } },
        },
      });
      await req.server.prisma.friend.create({
        data: {
          id,
          firstName: user.firstName,
          lastName: user.lastName,
          location: user.location,
          occupation: user.occupation,
          picturePath: user.picturePath,
          user: { connect: { id: friendId } },
        },
      });
    } else {
      await req.server.prisma.friend.delete({
        where: { id },
      });
      await req.server.prisma.friend.delete({
        where: { id: friendId },
      });
    }

    const updatedUser = await req.server.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        friends: true,
      },
    });
    return reply.code(200).send(updatedUser?.friends);
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};
