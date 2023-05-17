import { RouteHandler } from "fastify";
import type {
  CreatePostBody,
  GetUserPostsParams,
  LikePostBody,
  LikePostParams,
} from "./schemas";
import jwtVerification from "../../utils/jwtVerification";
import { promisify } from "util";

const promiseJwtVerification = promisify(jwtVerification);

export const getFeedPosts: RouteHandler = async (req, reply) => {
  try {
    const posts = await req.server.prisma.post.findMany({
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
    return reply.code(200).send(posts);
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};

export const getUserPosts: RouteHandler<{
  Params: GetUserPostsParams;
}> = async (req, reply) => {
  const { userId } = req.params;
  try {
    const posts = await req.server.prisma.post.findMany({
      where: {
        user: { id: userId },
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
    return reply.code(200).send(posts);
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};

export const likePost: RouteHandler<{
  Body: LikePostBody;
  Params: LikePostParams;
}> = async (req, reply) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const isLiked = await req.server.prisma.post.findFirst({
      where: {
        AND: {
          id,
          likes: { some: { users: { some: { id: userId } } } },
        },
      },
      include: { likes: { where: { userId } } },
    });

    let updatedPost;
    if (isLiked) {
      updatedPost = await req.server.prisma.post.update({
        where: { id },
        data: {
          likes: { delete: { id: isLiked.likes[0].id } },
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
    } else {
      updatedPost = await req.server.prisma.post.update({
        where: { id },
        data: {
          likes: { create: { userId, postId: id } },
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
    }
    return reply.code(200).send(updatedPost);
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};

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
    });
    const posts = await req.server.prisma.post.findMany({
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
    return reply.code(201).send(posts);
  } catch (error: any) {
    return req.server.handleErr(reply, error.message, 500);
  }
};
