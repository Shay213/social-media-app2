import fp from "fastify-plugin";
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import multer from "fastify-multer";

declare module "fastify" {
  interface FastifyInstance {
    uploadFile: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginCallback: FastifyPluginCallback = (fastify, options, next) => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public/assets"),
  });
  //FILE STORAGE
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage });

  const uploadFile = async (req: FastifyRequest, reply: FastifyReply) => {
    upload.single("file");
  };

  fastify.decorate("uploadFile", uploadFile);

  next();
};

export default fp(pluginCallback);
