import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const post = {
  type: "object",
  properties: {
    id: { type: "string" },
    description: { type: "string" },
    picturePath: { type: ["string", "null"], nullable: true },
    updatedAt: { type: "string", format: "date-time" },
    createdAt: { type: "string", format: "date-time" },
    user: {
      type: "object",
      properties: {
        picturePath: { type: ["string", "null"], nullable: true },
        id: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        location: { type: ["string", "null"], nullable: true },
      },
      required: ["picturePath", "firstName", "lastName", "location", "id"],
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
  required: [
    "user",
    "likes",
    "comments",
    "id",
    "description",
    "picturePath",
    "updatedAt",
    "createdAt",
  ],
};

const posts = {
  type: "array",
  items: post,
};

export const getFeedPostsSchema: FastifySchema = {
  response: {
    200: posts,
    500: { $ref: "error#" },
  },
};

const getUserPostsParams = {
  type: "object",
  properties: {
    userId: { type: "string" },
  },
  required: ["userId"],
} as const;

export type GetUserPostsParams = FromSchema<typeof getUserPostsParams>;

export const getUserPostsSchema: FastifySchema = {
  params: getUserPostsParams,
  response: {
    200: posts,
    500: { $ref: "error#" },
  },
};

const likePostBody = {
  type: "object",
  properties: {
    userId: { type: "string" },
  },
  required: ["userId"],
} as const;

const likePostParams = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
} as const;

export type LikePostBody = FromSchema<typeof likePostBody>;
export type LikePostParams = FromSchema<typeof likePostParams>;

export const likePostSchema: FastifySchema = {
  body: likePostBody,
  params: likePostParams,
  response: {
    200: post,
    500: { $ref: "error#" },
  },
};

const createPostBody = {
  type: "object",
  properties: {
    userId: { type: "object", properties: { value: { type: "string" } } },
    description: { type: "object", properties: { value: { type: "string" } } },
    picturePath: { type: "object", properties: { value: { type: "string" } } },
  },
  required: ["userId", "description"],
  additionalProperties: true,
};

export const createPostSchema: FastifySchema = {
  body: createPostBody,
  response: {
    201: posts,
    500: { $ref: "error#" },
  },
};
