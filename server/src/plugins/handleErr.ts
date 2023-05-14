import fp from "fastify-plugin";
import { FastifyPluginCallback, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    handleErr: (
      reply: FastifyReply,
      message: string,
      status: number
    ) => FastifyReply;
  }
}

const handleErr: FastifyPluginCallback = (fastify, options, done) => {
  fastify.decorate(
    "handleErr",
    (reply: FastifyReply, message: string, status: number) => {
      return reply.code(status).send({ message, status });
    }
  );

  done();
};

export default fp(handleErr);
