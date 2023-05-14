import * as dotenv from "dotenv";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";

// CUSTOM PLUGINS
import prismaPlugin from "./plugins/prisma";
import handleErr from "./plugins/handleErr.ts";
import verifyToken from "./plugins/verifyToken.ts";

// ROUTES WITH FILES
import upload from "./plugins/upload";

// UTILS
import getJwtSecret from "./utils/getJwtSecret.ts";

dotenv.config();

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors);

fastify.register(fastifyHelmet, {
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
fastify.register(prismaPlugin);
fastify.register(fastifyJwt, { secret: getJwtSecret() });
fastify.register(handleErr);
fastify.register(verifyToken);

// ROUTES WITH FILES
fastify.register(upload);

(async () => {
  try {
    await fastify.listen({ port: +(process.env?.PORT ?? 3000) });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
})();
