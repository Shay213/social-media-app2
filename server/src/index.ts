import * as dotenv from "dotenv";
import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";

// routes
import upload from "./plugins/upload";

// utils
import getJwtSecret from "./utils/getJwtSecret.ts";

dotenv.config();

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors);

fastify.register(fastifyHelmet, {
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
fastify.register(prismaPlugin);
fastify.register(fastifyJwt, { secret: getJwtSecret() });

// routes
fastify.register(upload);

(async () => {
  try {
    await fastify.listen({ port: +(process.env?.PORT ?? 3000) });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
})();
