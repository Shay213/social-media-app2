import type { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const getUserSuccessReply = {
  type: "object",
  properties: {
    user: { $ref: "user#" },
  },
  required: ["user"],
  additionalProperties: false,
};

const getUserParams = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
} as const;

export type getUserParams = FromSchema<typeof getUserParams>;

export const getUserSchema: FastifySchema = {
  params: {
    ...getUserParams,
  },
  response: {
    200: {
      ...getUserSuccessReply,
    },
    500: { $ref: "error#" },
  },
};

export const getUserFriendsSchema: FastifySchema = {};

export const addRemoveFriendSchema: FastifySchema = {};
