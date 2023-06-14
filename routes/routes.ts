import { Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { validateWithdrawRequest } from "./validators.ts";
import { handleWithdraw } from "../web3/web3.ts";
import { EXPIRYTIME, requestMutex } from "./requestMutex.ts";

export const router = new Router();

router.get("/", (context) => {
  context.response.body = { message: "online" };
  context.response.status = 200;
});

// Will process a bunny note withdraw request or return false if it can't process the request
router.post("/withdraw", async (context) => {
  const rawBody = context.request.body({ type: "json" });
  const json = await rawBody.value;
  const [status, msg] = validateWithdrawRequest(json);
  if (status === 400) {
    context.response.body = { message: msg };
    context.response.status = status;
    return;
  }

  const [canProceed, mutexError] = requestMutex(
    json.commitment,
    EXPIRYTIME,
  );
  if (!canProceed) {
    return [400, mutexError];
  }

  const [withdrawStatus, message] = await handleWithdraw(json).catch((err) => {
    return [400, "Unable to Relay Transaciton"];
  });
  if (withdrawStatus !== 200) {
    context.response.body = { message };
    context.response.status = 400;
    return;
  }
  // the message should contain the txId of the transaction to display on the front end!
  context.response.body = { message };
  context.response.status = 200;
});

// Will upload a bunny bundle merkle tree
router.post("/bundle", (context) => {
  context.response.body = "not implemented";
  context.response.status = 501;
});

// Will return a bunny bundle merkle tree by the root
router.get("/bundle", (context) => {
  context.response.body = "not implemented";
  context.response.status = 501;
});

// Will return a url to redirect to, for processing the direct debit request
router.get("directDebit", (context) => {
  context.response.body = "not implemented";
  context.response.status = 501;
});

// Will upload a ZKP related to the direct debit request, store it and return a URL to redirect the app to
router.post("directdebit", (context) => {
  context.response.body = "not implemented";
  context.response.status = 501;
});

//Will process a direct debit withdraw request using the proof, or returns the proof if can't relay it
router.post("processDirectDebit", (context) => {
  context.response.body = "not implemented";
  context.response.status = 501;
});

function toNoteHex(arg0: any): string {
  throw new Error("Function not implemented.");
}
