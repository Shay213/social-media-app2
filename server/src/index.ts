import * as dotenv from "dotenv";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";

// CUSTOM PLUGINS
import prismaPlugin from "./plugins/prisma";
import handleErr from "./plugins/handleErr.ts";
import verifyToken from "./plugins/verifyToken.ts";
import upload from "./plugins/upload";

// ROUTES
import auth from "./routes/auth/index.ts";

// UTILS
import getJwtSecret from "./utils/getJwtSecret.ts";

// GLOBAL SCHEMAS
import { userSchema, errorReplySchema } from "./routes/auth/schemas.ts";

dotenv.config();

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors);

fastify.register(fastifyHelmet, {
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
fastify.register(prismaPlugin);
fastify.register(fastifyCookie);
fastify.register(fastifyJwt, {
  secret: getJwtSecret(),
  cookie: { cookieName: "token", signed: false },
});
fastify.register(handleErr);

// GLOBAL SCHEMAS
fastify.addSchema(userSchema);
fastify.addSchema(errorReplySchema);

//ROUTES
fastify.register(auth, { prefix: "/api/auth" });

// ROUTES WITH FILES
fastify.register(upload);

// ROUTES WITH TOKEN VERIFICATION
fastify.register(verifyToken);

(async () => {
  try {
    await fastify.listen({ port: +(process.env?.PORT ?? 3000) });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
})();
