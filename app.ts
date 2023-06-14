import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Snelm } from "https://deno.land/x/snelm/mod.ts";
import { router } from "./routes/routes.ts";

const app = new Application();
const snelm = new Snelm("oak", { crossDomain: null });

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  next();
});

const port = 3000;

console.info(`CORS-enabled web server listening on port ${port}`);
await app.listen({ port });
