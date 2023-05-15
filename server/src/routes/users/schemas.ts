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

const getUserFriendsSuccessReply = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      occupation: { type: "string" },
      location: { type: "string" },
      picturePath: { type: "string" },
      userId: { type: "string" },
    },
    required: [
      "id",
      "firstName",
      "lastName",
      "occupation",
      "location",
      "picturePath",
      "userId",
    ],
  },
  additionalProperties: false,
};

export const getUserFriendsSchema: FastifySchema = {
  params: {
    ...getUserParams,
  },
  response: {
    200: {
      ...getUserFriendsSuccessReply,
    },
    500: { $ref: "error#" },
  },
};

export const addRemoveFriendSchema: FastifySchema = {};
