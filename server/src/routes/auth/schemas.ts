import type { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

export const userSchema = {
  $id: "user",
  type: "object",
  properties: {
    id: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    picturePath: { type: "string", nullable: true },
    location: { type: "string", nullable: true },
    occupation: { type: "string", nullable: true },
    viewedProfile: { type: "number", nullable: true },
    impressions: { type: "number", nullable: true },
    updatedAt: { type: "string", format: "date-time", nullable: true },
    createdAt: { type: "string", format: "date-time", nullable: true },
  },
  required: [
    "id",
    "firstName",
    "lastName",
    "email",
    "password",
    "picturePath",
    "location",
    "occupation",
    "viewedProfile",
    "impressions",
    "updatedAt",
    "createdAt",
  ],
};

const bodySchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    picturePath: { type: "string" },
    location: { type: "string" },
    occupation: { type: "string" },
  },
  required: ["firstName", "lastName", "email", "password"],
} as const;

export type Body = FromSchema<typeof bodySchema>;

const replySchema = {
  type: "object",
  properties: {
    user: { $ref: "user#" },
  },
  required: ["user"],
  additionalProperties: false,
};

const errorReplySchema = {
  type: "object",
  properties: {
    error: { type: "string" },
    status: { type: "number" },
  },
  required: ["error", "status"],
  additionalProperties: false,
};

export const registerSchema: FastifySchema = {
  body: bodySchema,
  response: {
    201: {
      ...replySchema,
    },
    500: {
      ...errorReplySchema,
    },
  },
};
