import { cron } from "https://deno.land/x/deno_cron/cron.ts";

export function every10Min() {
  cron("*/10 * * * *", () => {
    // every 10 minutes  I clean the old captchas
  });
}
