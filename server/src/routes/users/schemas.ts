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

const getUserQuery = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

export const getUserSchema: FastifySchema = {
  querystring: {
    ...getUserQuery,
  },
  response: {
    200: {
      ...getUserSuccessReply,
    },
    500: { $ref: "error#" },
  },
};
