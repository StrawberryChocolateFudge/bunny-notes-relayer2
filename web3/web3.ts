import { ethers, ZeroAddress } from "npm:ethers@6.5.1";

import bunnyNotesArtifact from "../BunnyNotes.json" assert { type: "json" };
import bunnyBundlesArtifact from "../BunnyBundles.json" assert { type: "json" };

import {
  bundleContractAddresses,
  ChainIds,
  FEEDIVIDER,
  noteContractAddresses,
  rpcUrl,
} from "./constants.ts";
import {
  ErrorResponse,
  RelayWithdrawParams,
  SolidityProof,
} from "../routes/validators.ts";
import { getSecretKey } from "../env.ts";

export async function handleWithdraw(json: RelayWithdrawParams) {
  //Proof comes as strings, ethers 6 uses BigInt
  const proof = json.proof.map((p) => BigInt(p)) as SolidityProof;
  const nullifierHash = json.nullifierHash;
  const commitment = json.commitment;
  const network = json.network as ChainIds;

  const provider = getProvider(network);
  const wallet = getWallet(provider);

  const [errCode, gasPriceRes] = await getGasPrice(provider);

  if (errCode !== 200) {
    // if there is an error the gasPriceRes is a string else it's a BigInt
    return [errCode, gasPriceRes as string];
  }

  const contract = await getBunnyNotesContract(wallet, network);
  const [estimateGasCode, estimateGasResult] = await estimateWithdrawGas(
    contract,
    proof,
    nullifierHash,
    commitment,
    json.recipient,
  );
  if (estimateGasCode !== 200) {
    // estimate gas failed, it threw an error!
    return [estimateGasCode, estimateGasResult as string];
  }
  const [feeStatus, feeRes] = await getFee(contract, commitment);
  if (feeStatus === 400) {
    return [feeStatus, feeRes];
  }
  // Check if the gas cost is more than the fee, I can't relay transactions too expensive
  const isSustainable = isSustainableToRelay(
    gasPriceRes as bigint,
    estimateGasResult as bigint,
    feeRes as bigint,
  );

  if (!isSustainable) {
    return [400, "Value too low to relay"];
  }

  return await withdraw(
    contract,
    proof,
    nullifierHash,
    commitment,
    json.recipient,
  );
}

function getProvider(network: ChainIds): ethers.JsonRpcProvider {
  const url = rpcUrl[network as ChainIds];
  return new ethers.JsonRpcProvider(url);
}

function getWallet(provider: ethers.JsonRpcProvider) {
  const key = getSecretKey();
  return new ethers.Wallet(key, provider);
}

async function getGasPrice(
  provider: ethers.JsonRpcProvider,
): Promise<ErrorResponse> {
  const feeData = await provider.getFeeData();
  if (!feeData.gasPrice) {
    return [400, "Unable to get gas price"];
  }
  let gasPrice = feeData.gasPrice;
  if (feeData.maxPriorityFeePerGas) {
    gasPrice += feeData.maxPriorityFeePerGas;
  }
  return [200, gasPrice];
}

function getBunnyNotesContract(
  wallet: ethers.Wallet,
  network: ChainIds,
): ethers.Contract {
  const address = noteContractAddresses[network];
  return new ethers.Contract(
    address,
    bunnyNotesArtifact.abi,
    wallet,
  );
}

function getBunnyBundlesContract(
  wallet: ethers.Wallet,
  network: ChainIds,
) {
  const address = bundleContractAddresses[network];
  return new ethers.Contract(
    address,
    bunnyBundlesArtifact.abi,
    wallet,
  );
}

async function estimateWithdrawGas(
  contract: ethers.Contract,
  proof: SolidityProof,
  nullifierHash: string,
  commitment: string,
  recipient: string,
): Promise<ErrorResponse> {
  let gas;
  try {
    gas = await contract.withdraw.estimateGas(
      proof,
      nullifierHash,
      commitment,
      recipient,
    );
  } catch (err) {
    return [400, err.message];
  }
  return [200, gas];
}

async function getCommitmentData(
  contract: ethers.Contract,
  commitment: string,
) {
  return await contract.commitments(commitment);
}

async function getBundleByRoot(contract: ethers.Contract, root: string) {
  return await contract.bundles(root);
}

export async function checkBundleExists(network: ChainIds, root: string) {
  const provider = getProvider(network);
  const wallet = getWallet(provider);
  const contract = getBunnyBundlesContract(wallet, network);
  const bundle = await getBundleByRoot(contract, root);
  if (bundle.creator === ZeroAddress) {
    return false;
  }
  return true;
}

async function getFee(
  contract: ethers.Contract,
  commitment: string,
): Promise<ErrorResponse> {
  try {
    const commitmentData = await getCommitmentData(contract, commitment);

    if (commitmentData.usesToken) {
      // For now I don't relay tokens at all
      return [400, "Unable to relay tokens"];
    }
    const denomination = commitmentData.denomination as bigint;
    const fee = denomination / BigInt(FEEDIVIDER);
    return [200, fee];
  } catch (_err) {
    return [400, "Unable to find commitment"];
  }
}

function isSustainableToRelay(
  gasPrice: bigint,
  estimatedLimit: bigint,
  collectedFee: bigint,
): boolean {
  const totalEstimatedPrice = gasPrice * estimatedLimit;
  return collectedFee > totalEstimatedPrice;
}

async function withdraw(
  contract: ethers.Contract,
  proof: SolidityProof,
  nullifierHash: string,
  commitment: string,
  recipient: string,
): Promise<ErrorResponse> {
  let tx;
  try {
    tx = await contract.withdraw(
      proof,
      nullifierHash,
      commitment,
      recipient,
    );
  } catch (err) {
    return [400, err.message];
  }
  return [200, tx.hash];
}
