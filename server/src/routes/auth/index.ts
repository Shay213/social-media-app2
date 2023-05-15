import { FastifyInstance } from "fastify";
import { register, login, logout } from "./handlers.ts";
import { registerSchema, loginSchema } from "./schemas.ts";

export default async (fastify: FastifyInstance) => {
  fastify.post("/login", { schema: loginSchema }, login);
  fastify.post("/logout", logout);
};

// ROUTES WITH FILES
export const registerRoute = async (fastify: FastifyInstance) =>
  fastify.post("/register", { schema: registerSchema }, register);
