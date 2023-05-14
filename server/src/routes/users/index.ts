import { FastifyInstance } from "fastify";
import { getUser, getUserFriends, addRemoveFriend } from "./handlers.ts";
import { getUserSchema } from "./schemas.ts";

export default async (fastify: FastifyInstance) => {
  fastify.get("/:id", { schema: getUserSchema }, getUser);
};
