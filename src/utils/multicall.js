import { config, multicallClient, Contract as ClientContract } from "@chainstarter/multicall-client.js";
import { ChainId } from "../web3/address";

config({
  defaultChainId: ChainId.HECO,
  allowFailure: false,
  rpc: {
    [ChainId.LOCALHOST]: {
      url: 'http://localhost:8545',
      address: '0x6427169aB7344F9C37E9dC9001c681BEcd09343d',
    },
    [ChainId.AVALANCHE]: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      address: '0xC379170D60aa65c2892C547DC59dCb9B5bd7a7c6',
    },
    [ChainId.HECO]: {
      url: 'https://http-mainnet.hecochain.com/',
      address: '0xBF4b1bE1F00F5624ba4D65f8548ccF6E75d0deFe'
    }
  }
})

export {
  ChainId,
  multicallClient,
  ClientContract
}
