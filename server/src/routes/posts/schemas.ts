import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

export const getFeedPostsSchema: FastifySchema = {};

export const getUserPostsSchema: FastifySchema = {};

export const likePostSchema: FastifySchema = {};

const createPostBody = {
  type: "object",
  properties: {
    userId: { type: "string" },
    description: { type: "string" },
    picturePath: { type: "string" },
  },
  required: ["userId", "description"],
} as const;

export type CreatePostBody = FromSchema<typeof createPostBody>;

const createPostSuccessReply = {
  type: "object",
  properties: {
    user: {
      type: "object",
      picturePath: { type: ["string", "null"], nullable: true },
      firstName: { type: "string" },
      lastName: { type: "string" },
      location: { type: ["string", "null"], nullable: true },
    },
    likes: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            id: { type: "string" },
            postId: { type: "string" },
            userId: { type: "string" },
          },
          required: ["id", "postId", "userId"],
        },
      ],
    },
    comments: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            id: { type: "string" },
            postId: { type: "string" },
            userId: { type: "string" },
            description: { type: "string" },
            updatedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
          },
          required: [
            "id",
            "postId",
            "userId",
            "description",
            "updatedAt",
            "createdAt",
          ],
        },
      ],
    },
  },
  required: ["user", "likes", "comments"],
};

export const createPostSchema: FastifySchema = {
  body: createPostBody,
  response: {
    200: createPostSuccessReply,
    500: { $ref: "error#" },
  },
};
