import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import {
  RelayWithdrawParams,
  validateWithdrawRequest,
} from "../routes/validators.ts";
import {
  EXPIRYTIME,
  MUTEXERRORMESSAGE,
  requestMutex,
} from "../routes/requestMutex.ts";

// Test the json validator function

Deno.test("Withdraw request validator", () => {
  const mockValidJSON: RelayWithdrawParams = {
    commitment: "0x",
    nullifierHash: "0x",
    recipient: "0xD97F13b8fd8a54434F7Bd7981F0D6C82EA1b59F3",
    proof: [
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
    ],
    network: "0x61",
  };
  let [status, msg] = validateWithdrawRequest(mockValidJSON);
  assertEquals(status, 200);
  assertEquals(msg, "");

  [status, msg] = validateWithdrawRequest({
    ...mockValidJSON,
    //@ts-ignore mock an invalid response coming from API, not allowed by type checker
    proof: undefined,
  });
  assertEquals(status, 400);
  assertEquals(msg, "Proof is missing");

  [status, msg] = validateWithdrawRequest({
    ...mockValidJSON,
    //@ts-ignore mock an invalid response coming from API, not allowed by type checker
    proof: [],
  });
  assertEquals(status, 400);
  assertEquals(msg, "Invalid proof");

  [status, msg] = validateWithdrawRequest({
    ...mockValidJSON,
    //@ts-ignore mock an invalid response coming from API, not allowed by type checker
    nullifierHash: undefined,
  });
  assertEquals(status, 400);
  assertEquals(msg, "NullifierHash is missing");
  [status, msg] = validateWithdrawRequest({
    ...mockValidJSON,
    //@ts-ignore mock an invalid response coming from API, not allowed by type checker
    commitment: undefined,
  });
  assertEquals(status, 400);
  assertEquals(msg, "Commitment is missing");

  [status, msg] = validateWithdrawRequest({
    ...mockValidJSON,
    //@ts-ignore mock an invalid response coming from API, not allowed by type checker
    recipient: undefined,
  });
  assertEquals(status, 400);
  assertEquals(msg, "Recipient address is missing");

  [status, msg] = validateWithdrawRequest({
    ...mockValidJSON,
    //@ts-ignore mock an invalid response coming from API, not allowed by type checker
    recipient: "asd",
  });
  assertEquals(status, 400);
  assertEquals(msg, "Recipient address is invalid");

  [status, msg] = validateWithdrawRequest({
    ...mockValidJSON,
    //@ts-ignore mock an invalid response coming from API, not allowed by type checker
    network: undefined,
  });
  assertEquals(status, 400);
  assertEquals(msg, "Network id is missing");

  [status, msg] = validateWithdrawRequest({
    ...mockValidJSON,
    //@ts-ignore mock an invalid response coming from API, not allowed by type checker
    network: "asd",
  });
  assertEquals(status, 400);
  assertEquals(msg, "Unsupported network");
});

Deno.test("Request mutex should lock before expiry", () => {
  //A request with commitment comes in, it's allowed to pass through
  let [open, msg] = requestMutex("0x_random_commitment", EXPIRYTIME);
  assertEquals(open, true);
  assertEquals(msg, "");
  // Another message with the same commitment, this time it's rejected
  [open, msg] = requestMutex("0x_random_commitment", EXPIRYTIME);
  assertEquals(open, false);
  assertEquals(msg, MUTEXERRORMESSAGE);
  // Now MOCK time passing by injecting a different expiryTime
  // Using zero because this is fast!
  [open, msg] = requestMutex("0x_random_commitment", 0);
  assertEquals(open, true);
  assertEquals(msg, "");
  //Now the request was allowed to pass through
});
