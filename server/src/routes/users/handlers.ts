import { RouteHandler } from "fastify";
import type { getUserParams } from "./schemas.ts";

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
    const friends = req.server.prisma.friend.findMany({
      where: {
        user: { id },
      },
    });
    return reply.code(200).send(friends);
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};

export const addRemoveFriend: RouteHandler = async (req, reply) => {};
