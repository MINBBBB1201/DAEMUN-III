import { serve } from "@hono/node-server";
import { app } from "./app";
import { bootstrap } from "./bootstrap";
import { env } from "./env";

bootstrap()
  .then(() => {
    serve({ fetch: app.fetch, port: env.port }, (info) => {
      console.log(`[api] listening on http://localhost:${info.port}`);
    });
  })
  .catch((err) => {
    console.error("[api] failed to start:", err);
    process.exit(1);
  });
