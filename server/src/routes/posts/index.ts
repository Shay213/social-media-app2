import { FastifyInstance } from "fastify";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  createPost,
} from "./handlers.ts";
import {
  getFeedPostsSchema,
  getUserPostsSchema,
  likePostSchema,
  createPostSchema,
} from "./schemas.ts";

export default async (fastify: FastifyInstance) => {
  fastify.get("/", { schema: getFeedPostsSchema }, getFeedPosts);
  fastify.get("/:userId", { schema: getUserPostsSchema }, getUserPosts);
  fastify.patch("/:id/like", { schema: likePostSchema }, likePost);
};

export const createPostRoute = async (fastify: FastifyInstance) => {
  fastify.post("/", { schema: createPostSchema }, createPost);
};
