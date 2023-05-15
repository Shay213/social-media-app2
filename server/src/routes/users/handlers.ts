import { RouteHandler } from "fastify";
import type { getUserParams, AddRemoveFriendParams } from "./schemas.ts";

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
    });
    return reply.code(200).send({ user });
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
        friends: {
          where: {
            id: friendId + id,
          },
        },
      },
    });
    const friend = await req.server.prisma.user.findUnique({
      where: { id: friendId },
      include: {
        friends: {
          where: {
            id: id + friendId,
          },
        },
      },
    });

    if (!friend || !user)
      return req.server.handleErr(reply, "User or friend doesn't exist", 404);

    if (!user?.friends.length) {
      // CREATE FRIEND RECORDS FOR BOTH USERS
      await req.server.prisma.user.update({
        where: { id },
        data: {
          friends: {
            create: {
              id: friendId + id,
              firstName: friend.firstName,
              lastName: friend.lastName,
              location: friend.location,
              occupation: friend.occupation,
            },
          },
        },
      });
      await req.server.prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            create: {
              id: id + friendId,
              firstName: user.firstName,
              lastName: user.lastName,
              location: user.location,
              occupation: user.occupation,
            },
          },
        },
      });
    } else {
      await req.server.prisma.friend.delete({
        where: { id: id + friendId },
      });
      await req.server.prisma.friend.delete({
        where: { id: friendId + id },
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
