export enum NetworkNames {
  BTT_TESTNET = "BTT Donau Testnet",
  BSC_TESTNET = "Binance Smart Chain Testnet",

  // Mainnets
  BTT_MAINNET = "BitTorrent Chain",
  BSC_MAINNET = "Binance Smart Chain",
  POLYGON_MAINNET = "Polygon POS Chain",
  ETH_MAINNET = "Ethereum",
}

export enum NetworkTickers {
  BTT_TESTNET = "BTT",
  BSC_TESTNET = "BNB",

  // Mainnets
  ETH_MAINNET = "ETH",
  BSC_MAINNET = "BSC",
  POLYGON_MAINNET = "MATIC",
  BTT_MAINNET = "BTT",
}

export enum ChainIds {
  BTT_TESTNET_ID = "0x405",
  BSC_TESTNET_ID = "0x61",

  // MAINNETS
  BTT_MAINNET_ID = "0xc7",
  BSC_MAINNET = "0x38",
  POLYGON_MAINNET = "0x89",
  ETH_MAINNET = "0x1",
}

export enum BunnyNotesContractAddress {
  BTT_DONAU_TESTNET = "0x859576e721404004dab525EB2Da0865E949eA717",
  BSC_TESTNET = "0x29EbE72886d007cC4F2c3F43c9f899ab242Cc917",

  //MAINNETS:
  BTT_MAINNET = "0x3Cad43A3038F0E657753C0129ce7Ea4a5801EC90",
  BSC_MAINNET = "0x3Cad43A3038F0E657753C0129ce7Ea4a5801EC90",
  POLYGON_MAINNET = "0x3Cad43A3038F0E657753C0129ce7Ea4a5801EC90",
  ETH_MAINNET = "",
}

export enum BunnyBundlesContractAddress {
  BTT_DONAU_TESTNET = "0xA4e589a0A02EEaE9876c1B776E9c8D0bA9EFdfd8",
  BSC_TESTNET = "",

  //MAINNETS:
  BTT_MAINNET = "",
  BSC_MAINNET = "",
  POLYGON_MAINNET = "",
  ETH_MAINNET = "",
}

export enum RPCURLS {
  BTT_TESTNET = "https://pre-rpc.bt.io/",
  BSC_TESTNET = "https://data-seed-prebsc-1-s3.binance.org:8545",

  // MAINNETS:
  BTT_MAINNET = "https://rpc.bittorrentchain.io",
  BSC_MAINNET = "https://bsc.publicnode.com",
  POlYGON_MAINNET = "https://polygon.llamarpc.com",
  ETH_MAINNET = "https://eth.llamarpc.com",
}

export enum FeelessTokens {
  BTT_TESTNET = "",
  BSC_TESTNET = "0xeDc320436A3d390B65Dfc0dc868909c914F431cA", //ZKB deployed on testnet

  BTT_MAINNET = "",
  BSC_MAINNET = "0x5586938a2fC4489661E868c5800769Fb10847fC5", // ZKB deployed on mainnet
  ETH_MAINNET = "",
  POLYGON_MAINNET = "",
}

export const noteContractAddresses: {
  [key in ChainIds]: BunnyNotesContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: BunnyNotesContractAddress.BTT_DONAU_TESTNET,
  [ChainIds.BSC_TESTNET_ID]: BunnyNotesContractAddress.BSC_TESTNET,
  // Mainnets
  [ChainIds.BTT_MAINNET_ID]: BunnyNotesContractAddress.BTT_MAINNET,
  [ChainIds.ETH_MAINNET]: BunnyNotesContractAddress.ETH_MAINNET,
  [ChainIds.BSC_MAINNET]: BunnyNotesContractAddress.BSC_MAINNET,
  [ChainIds.POLYGON_MAINNET]: BunnyNotesContractAddress.POLYGON_MAINNET,
};

export const bundleContractAddresses: {
  [key in ChainIds]: BunnyBundlesContractAddress;
} = {
  [ChainIds.BTT_TESTNET_ID]: BunnyBundlesContractAddress.BTT_DONAU_TESTNET,
  [ChainIds.BSC_TESTNET_ID]: BunnyBundlesContractAddress.BSC_TESTNET,
  // Mainnets
  [ChainIds.BTT_MAINNET_ID]: BunnyBundlesContractAddress.BTT_MAINNET,
  [ChainIds.ETH_MAINNET]: BunnyBundlesContractAddress.ETH_MAINNET,
  [ChainIds.BSC_MAINNET]: BunnyBundlesContractAddress.BSC_MAINNET,
  [ChainIds.POLYGON_MAINNET]: BunnyBundlesContractAddress.POLYGON_MAINNET,
};

export const networkNameFromId: { [key in ChainIds]: NetworkNames } = {
  [ChainIds.BTT_TESTNET_ID]: NetworkNames.BTT_TESTNET,
  [ChainIds.BSC_TESTNET_ID]: NetworkNames.BSC_TESTNET,
  // Mainnets
  [ChainIds.BTT_MAINNET_ID]: NetworkNames.BTT_MAINNET,
  [ChainIds.ETH_MAINNET]: NetworkNames.ETH_MAINNET,
  [ChainIds.BSC_MAINNET]: NetworkNames.BSC_MAINNET,
  [ChainIds.POLYGON_MAINNET]: NetworkNames.POLYGON_MAINNET,
};

export const rpcUrl: { [key in ChainIds]: RPCURLS } = {
  [ChainIds.BTT_TESTNET_ID]: RPCURLS.BTT_TESTNET,
  [ChainIds.BSC_TESTNET_ID]: RPCURLS.BSC_TESTNET,

  // Mainnets
  [ChainIds.BTT_MAINNET_ID]: RPCURLS.BTT_MAINNET,
  [ChainIds.ETH_MAINNET]: RPCURLS.ETH_MAINNET,
  [ChainIds.BSC_MAINNET]: RPCURLS.BSC_MAINNET,
  [ChainIds.POLYGON_MAINNET]: RPCURLS.POlYGON_MAINNET,
};

export const feelessTokens: { [key in ChainIds]: FeelessTokens } = {
  [ChainIds.BTT_TESTNET_ID]: FeelessTokens.BTT_TESTNET,
  [ChainIds.BSC_TESTNET_ID]: FeelessTokens.BSC_TESTNET,

  // Mainnets
  [ChainIds.BTT_MAINNET_ID]: FeelessTokens.BTT_MAINNET,
  [ChainIds.ETH_MAINNET]: FeelessTokens.ETH_MAINNET,
  [ChainIds.BSC_MAINNET]: FeelessTokens.BSC_MAINNET,
  [ChainIds.POLYGON_MAINNET]: FeelessTokens.POLYGON_MAINNET,
};

export function incorrectNetwork(network: ChainIds) {
  return noteContractAddresses[network] === undefined;
}

export const FEEDIVIDER = 100;
