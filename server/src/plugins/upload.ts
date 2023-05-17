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

interface RegisterBody {
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
interface PostBody {
  userId: {
    value: string;
  };
  description: {
    value: string;
  };
  picturePath?: {
    value: string;
  };
}

const pluginCallback: FastifyPluginCallback = (fastify, options, done) => {
  fastify.register(fastifyStatic, {
    root: path.join(grandparentDir, "/public/assets"),
    prefix: "/images/",
  });

  fastify.register(function filesRoutes(childFastify, opts, done) {
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

    childFastify.addHook("preHandler", (req, reply, done) => {
      if (req.url === "/api/auth/register") {
        const {
          firstName,
          lastName,
          email,
          password,
          picturePath,
          location,
          occupation,
        } = req.body as RegisterBody;
        req.body = {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
          picturePath: picturePath?.value
            ? `/images/${picturePath.value}`
            : null,
          location: location.value,
          occupation: occupation.value,
        };
      } else if (req.url === "/api/posts") {
        const { userId, description, picturePath } = req.body as PostBody;
        req.body = {
          userId: userId.value,
          description: description.value,
          picturePath: picturePath?.value
            ? `/images/${picturePath.value}`
            : null,
        };
      }
      done();
    });

    done();
  });
  done();
};

export default fp(pluginCallback);
