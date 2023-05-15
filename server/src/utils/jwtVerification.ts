import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";

export default (
  req: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  const token = req.cookies.token;
  if (!token) return req.server.handleErr(reply, "Not authenticated!", 400);
  const verified = req.server.jwt.verify(token);
  req.payload = verified;
  done();
};
