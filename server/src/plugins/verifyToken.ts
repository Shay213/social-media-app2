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
  fastify.register(users, { prefix: "/api/users" });

  fastify.addHook("onRequest", (req, reply, done) => {
    const { authorization } = req.headers;
    if (!authorization)
      return req.server.handleErr(reply, "Access denied!", 403);

    let token = "";
    if (authorization.startsWith("Bearer ")) {
      token = authorization.slice(7, authorization.length).trimStart();
    }

    const verified = req.server.jwt.verify(token);
    req.payload = verified;
    done();
  });
});

export default verifyToken;
