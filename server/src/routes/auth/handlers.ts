import bycrypt from "bcrypt";
import { RouteHandler } from "fastify";
import type { Body } from "./schemas.ts";

export const register: RouteHandler<{ Body: Body }> = async (req, reply) => {
  const {
    firstName,
    lastName,
    email,
    password,
    picturePath,
    location,
    occupation,
  } = req.body;

  try {
    const salt = await bycrypt.genSalt();
    const passwordHash = await bycrypt.hash(password, salt);
    const user = await req.server.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      },
    });
    reply.code(201).send({ user: user });
  } catch (error) {
    const e = error as Error;
    reply.code(500).send({ message: e.message, status: 500 });
  }
};
