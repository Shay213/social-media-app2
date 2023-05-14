import { FastifyInstance } from "fastify";
import { register, login } from "./handlers.ts";
import { registerSchema, loginSchema } from "./schemas.ts";

export default async (fastify: FastifyInstance) => {
  fastify.post("/register", { schema: registerSchema }, register);
  fastify.post("/login", { schema: loginSchema }, login);
};
