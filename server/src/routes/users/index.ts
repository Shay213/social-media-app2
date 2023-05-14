import { FastifyInstance } from "fastify";
import { getUser, getUserFriends, addRemoveFriend } from "./handlers.ts";
import {
  getUserSchema,
  getUserFriendsSchema,
  addRemoveFriendSchema,
} from "./schemas.ts";

export default async (fastify: FastifyInstance) => {
  fastify.get("/:id", { schema: getUserSchema }, getUser);
  fastify.get("/:id/friends", { schema: getUserFriendsSchema }, getUserFriends);
  fastify.patch(
    "/:id/:friendId",
    { schema: addRemoveFriendSchema },
    addRemoveFriend
  );
};
