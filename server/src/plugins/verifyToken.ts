import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

// routes
import users from "../routes/users";

declare module "fastify" {
  interface FastifyRequest {
    payload: any;
  }
}

const verifyToken: FastifyPluginAsync = fp(async (fastify, options) => {
  fastify.register(function verifiedRoutes(childFastify, opts, done) {
    childFastify.register(users, { prefix: "/api/users" });

    childFastify.addHook("onRequest", (req, reply, done) => {
      const token = req.cookies.token;
      if (!token) return req.server.handleErr(reply, "Not authenticated!", 400);
      const verified = req.server.jwt.verify(token);
      req.payload = verified;
      done();
    });
    done();
  });
});

export default verifyToken;
