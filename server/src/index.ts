import * as dotenv from "dotenv";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";

// CUSTOM PLUGINS
import prismaPlugin from "./plugins/prisma";
import handleErr from "./plugins/handleErr";
import verifyToken from "./plugins/verifyToken";
import upload from "./plugins/upload";

// ROUTES
import auth from "./routes/auth/index";

// UTILS
import getJwtSecret from "./utils/getJwtSecret";

// GLOBAL SCHEMAS
import { userSchema, errorReplySchema } from "./routes/auth/schemas";

dotenv.config();

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors, {
  origin: "http://localhost:5137",
  credentials: true,
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
