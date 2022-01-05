import {config, multicallClient, Contract as ClientContract} from "@chainstarter/multicall-client.js";
import {ChainId} from "../web3/address";

config({
  defaultChainId: ChainId.HECO,
  allowFailure: false
})

export {
  ChainId,
  multicallClient,
  ClientContract
}
