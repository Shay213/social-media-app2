import { RouteHandler } from "fastify";
import type { CreatePostBody } from "./schemas.ts";
import jwtVerification from "../../utils/jwtVerification.ts";
import { promisify } from "util";

const promiseJwtVerification = promisify(jwtVerification);

export const getFeedPosts: RouteHandler = async (req, reply) => {
  try {
    const posts = await req.server.prisma.post.findMany();
    return reply.code(200).send(posts);
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};

export const getUserPosts: RouteHandler = async (req, reply) => {};

export const likePost: RouteHandler = async (req, reply) => {};

export const createPost: RouteHandler<{ Body: CreatePostBody }> = async (
  req,
  reply
) => {
  await promiseJwtVerification(req, reply);
  const { userId, description, picturePath } = req.body;
  try {
    await req.server.prisma.post.create({
      data: {
        description,
        picturePath,
        user: { connect: { id: userId } },
      },
      include: {
        comments: true,
        likes: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            location: true,
            picturePath: true,
          },
        },
      },
    });
    const posts = await req.server.prisma.post.findMany();
    return reply.code(201).send(posts);
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};
