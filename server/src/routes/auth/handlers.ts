import bycrypt from "bcrypt";
import { RouteHandler } from "fastify";
import type { RegisterBody, LoginBody } from "./schemas.ts";

export const register: RouteHandler<{ Body: RegisterBody }> = async (
  req,
  reply
) => {
  try {
    const salt = await bycrypt.genSalt();
    const passwordHash = await bycrypt.hash(req.body.password, salt);
    const user = await req.server.prisma.user.create({
      data: {
        ...req.body,
        password: passwordHash,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      },
    });
    return reply.code(201).send({ user: user });
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};

export const login: RouteHandler<{ Body: LoginBody }> = async (req, reply) => {
  const { email, password } = req.body;
  try {
    const user = await req.server.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return req.server.handleErr(reply, "User does not exist!", 400);

    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch)
      return req.server.handleErr(reply, "Invalid credentials.", 400);

    const { password: uPassword, ...rest } = user;
    const token = req.server.jwt.sign({ id: user.id });

    return reply
      .setCookie("token", token, {
        path: "/",
        httpOnly: true,
      })
      .code(200)
      .send({ user });
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};

export const logout: RouteHandler = async (req, reply) => {
  const token = req.cookies.token;
  if (token) {
    reply.clearCookie("token");
    return reply.code(200).send("User logged out successfully.");
  } else {
    return reply.code(500).send("There is no token!");
  }
};
