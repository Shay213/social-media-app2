import type { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const userSchemaProperties = {
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
};

export const userSchema = {
  $id: "user",
  type: "object",
  properties: userSchemaProperties,
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
} as const;

const registerBodySchema = {
  type: "object",
  properties: {
    firstName: { type: "object", properties: { value: { type: "string" } } },
    lastName: { type: "object", properties: { value: { type: "string" } } },
    email: { type: "object", properties: { value: { type: "string" } } },
    password: { type: "object", properties: { value: { type: "string" } } },
    picturePath: { type: "object", properties: { value: { type: "string" } } },
    location: { type: "object", properties: { value: { type: "string" } } },
    occupation: { type: "object", properties: { value: { type: "string" } } },
  },
  required: ["firstName", "lastName", "email", "password"],
  additionalProperties: true,
};

const registerSchemaSuccessReply = {
  type: "object",
  properties: {
    user: { $ref: "user#" },
  },
  required: ["user"],
  additionalProperties: false,
};

export const errorReplySchema = {
  $id: "error",
  type: "object",
  properties: {
    message: { type: "string" },
    status: { type: "number" },
  },
  required: ["message", "status"],
  additionalProperties: false,
};

export const registerSchema: FastifySchema = {
  body: registerBodySchema,
  response: {
    201: {
      ...registerSchemaSuccessReply,
    },
    500: {
      ...errorReplySchema,
    },
  },
};

const { password, ...loginSchemaProperties } = userSchemaProperties;

const loginSchemaSuccessReply = {
  type: "object",
  properties: {
    user: {
      type: "object",
      properties: loginSchemaProperties,
      required: [
        "id",
        "firstName",
        "lastName",
        "email",
        "picturePath",
        "location",
        "occupation",
        "viewedProfile",
        "impressions",
        "updatedAt",
        "createdAt",
      ],
    },
    token: { type: "string" },
  },
  required: ["user", "token"],
  additionalProperties: false,
};

const loginBodySchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
} as const;

export type LoginBody = FromSchema<typeof loginBodySchema>;

export const loginSchema: FastifySchema = {
  body: loginBodySchema,
  response: {
    200: {
      ...loginSchemaSuccessReply,
    },
    400: {
      ...errorReplySchema,
    },
    500: {
      ...errorReplySchema,
    },
  },
};
