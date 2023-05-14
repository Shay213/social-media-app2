import fp from "fastify-plugin";
import { FastifyPluginCallback } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import multer from "fastify-multer";

// routes
import auth from "../routes/auth/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginCallback: FastifyPluginCallback = (fastify, options, done) => {
  fastify.register(function filesRoutes(childFastify, opts, done) {
    childFastify.register(fastifyStatic, {
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

    childFastify.addHook("preHandler", (req, reply, done) => {
      // upload.single("file");
      console.log("uploading file ....");
      done();
    });

    childFastify.register(auth, { prefix: "/api/auth" });
    done();
  });
  done();
};

export default fp(pluginCallback);
