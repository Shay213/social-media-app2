import * as dotenv from "dotenv";
import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma";
import fastifyCors from "@fastify/cors";
import multer from "fastify-multer";
import fastifyHelmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors);

fastify.register(fastifyHelmet, {
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
fastify.register(prismaPlugin);
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public/assets"),
});

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

(async () => {
  try {
    await fastify.listen({ port: +(process.env?.PORT ?? 3000) });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
})();
