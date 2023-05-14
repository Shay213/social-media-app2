import { FastifyInstance } from "fastify";
import { register } from "./handlers.ts";
import { registerSchema, userSchema } from "./schemas.ts";

export default async (fastify: FastifyInstance) => {
  fastify.addSchema(userSchema);
  fastify.post("/register", { schema: registerSchema }, register);
};
