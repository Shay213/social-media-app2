import fp from "fastify-plugin";
import { FastifyPluginCallback } from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import { pipeline } from "stream";
import fs from "fs";
import util from "util";
const pump = util.promisify(pipeline);

// routes
import { registerRoute } from "../routes/auth";
import { createPostRoute } from "../routes/posts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const grandparentDir = path.resolve(__dirname, "..", "..");

interface Body {
  firstName: {
    value: string;
  };
  lastName: {
    value: string;
  };
  email: {
    value: string;
  };
  password: {
    value: string;
  };
  picturePath: {
    value: string;
  };
  location: {
    value: string;
  };
  occupation: {
    value: string;
  };
}

const pluginCallback: FastifyPluginCallback = (fastify, options, done) => {
  fastify.register(function filesRoutes(childFastify, opts, done) {
    childFastify.register(fastifyStatic, {
      root: path.join(grandparentDir, "/public/assets"),
    });

    async function onFile(part: any) {
      const filePath = path.join(
        grandparentDir,
        "/public/assets/",
        part.filename
      );
      await pump(part.file, fs.createWriteStream(filePath));
    }

    childFastify.register(fastifyMultipart, {
      attachFieldsToBody: true,
      onFile,
    });

    childFastify.register(registerRoute, { prefix: "/api/auth" });
    childFastify.register(createPostRoute, { prefix: "/api/posts" });

    childFastify.addHook("preHandler", async (req, reply) => {
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        location,
        occupation,
      } = req.body as Body;
      req.body = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        picturePath: `${grandparentDir}/public/assets/${picturePath.value}`,
        location: location.value,
        occupation: occupation.value,
      };
    });

    done();
  });
  done();
};

export default fp(pluginCallback);
