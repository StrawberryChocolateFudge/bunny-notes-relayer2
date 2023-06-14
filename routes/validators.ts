import { ethers } from "npm:ethers@6.5.1";

import { ChainIds, incorrectNetwork } from "../web3/constants.ts";

export type BigNumberish = string | bigint;

export type SolidityProof = [
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  BigNumberish,
];

export type RelayWithdrawParams = {
  proof: SolidityProof;
  nullifierHash: string;
  commitment: string;
  recipient: string;
  network: string;
};

export type ErrorResponse = [number, BigNumberish];

export function validateWithdrawRequest(
  json: RelayWithdrawParams,
): ErrorResponse {
  if (!json.proof) {
    return [400, "Proof is missing"];
  }
  if (json.proof.length !== 8) {
    return [400, "Invalid proof"];
  }

  if (!json.nullifierHash) {
    return [400, "NullifierHash is missing"];
  }
  if (!json.commitment) {
    return [400, "Commitment is missing"];
  }

  if (!json.recipient) {
    return [400, "Recipient address is missing"];
  }

  if (!ethers.isAddress(json.recipient)) {
    return [400, "Recipient address is invalid"];
  }
  if (!json.network) {
    return [400, "Network id is missing"];
  }
  if (incorrectNetwork(json.network as ChainIds)) {
    return [400, "Unsupported network"];
  }

  return [200, ""];
}
