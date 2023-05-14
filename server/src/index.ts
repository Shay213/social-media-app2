import * as dotenv from "dotenv";
import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import upload from "./plugins/upload";

// routes
import registerAuth from "./routes/auth/index.ts";

dotenv.config();

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors);

fastify.register(fastifyHelmet, {
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
fastify.register(prismaPlugin);
fastify.register(upload);

// routes
fastify.register(registerAuth, { prefix: "/auth" });

(async () => {
  try {
    await fastify.listen({ port: +(process.env?.PORT ?? 3000) });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
})();
