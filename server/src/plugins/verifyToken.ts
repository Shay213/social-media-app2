import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import jwtVerification from "../utils/jwtVerification";

// routes
import users from "../routes/users";
import posts from "../routes/posts";

declare module "fastify" {
  interface FastifyRequest {
    payload: any;
  }
}

const verifyToken: FastifyPluginAsync = fp(async (fastify, options) => {
  fastify.register(function verifiedRoutes(childFastify, opts, done) {
    childFastify.register(users, { prefix: "/api/users" });
    childFastify.register(posts, { prefix: "/api/posts" });

    childFastify.addHook("onRequest", jwtVerification);
    done();
  });
});

export default verifyToken;
