import { load } from "https://deno.land/std@0.191.0/dotenv/mod.ts";

const env = await load();

export function getSecretKey() {
  return env["SECRETKEY"];
}
