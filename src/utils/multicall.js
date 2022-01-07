import {config, multicallClient, Contract as ClientContract} from "@chainstarter/multicall-client.js";
import {ChainId} from "../web3/address";

config({
  defaultChainId: ChainId.HECO,
  allowFailure: false,
  rpc: {
    [ChainId.LOCALHOST]: {
      url: 'http://localhost:8545',
      address: '0x6427169aB7344F9C37E9dC9001c681BEcd09343d',
    },
  }
})

export {
  ChainId,
  multicallClient,
  ClientContract
}
