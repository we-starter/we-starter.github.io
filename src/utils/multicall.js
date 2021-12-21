import { Contract, Provider, setMulticallAddress} from 'ethers-multicall-x';
import {cloneDeep} from 'lodash'
import BigNumber from "bignumber.js";
import {JsonRpcProvider} from "@ethersproject/providers";
import {RPC_URLS} from "../web3/address";
import {ChainId} from "../web3/address";
const MULTICALL_ADDRESS = '0xc9a9F768ebD123A00B52e7A0E590df2e9E998707'


export function getMultiCallProvider(provider, chainId) {
  // HECO multical
  setMulticallAddress(128, MULTICALL_ADDRESS)
  setMulticallAddress(137, "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507")
  setMulticallAddress(ChainId.LOCALHOST, '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c')
  const multiCallProvider = new Provider(provider, chainId);
  return multiCallProvider
}

let _PROVIDER = {}
export const getOnlyMultiCallProvider = (chainId) => _PROVIDER[chainId] || (_PROVIDER[chainId] = getMultiCallProvider(new JsonRpcProvider(RPC_URLS(chainId), chainId), chainId))

/**
 * 递归toString
 */
export function processResult(data) {
  data = cloneDeep(data)
  if (Array.isArray(data)){
    data.map((o, i) => {
      data[i] = processResult(o)
    })
    return data
  }else if(data.toString){
    return data.toString()
  }else if(typeof data === 'object'){
    for(let key in data){
      Object.assign(data, {
        [key]: processResult(0)
      })
    }
    return data
  } else{
    return data
  }
}
