import { Contract, Provider, setMulticallAddress} from 'ethers-multicall-x';
import {cloneDeep} from 'lodash'
import BigNumber from "bignumber.js";
const MULTICALL_ADDRESS = '0xc9a9F768ebD123A00B52e7A0E590df2e9E998707'

export function getMultiCallProvider(provider, chainId) {
  // HECO multical
  setMulticallAddress(128, MULTICALL_ADDRESS)
  const multiCallProvider = new Provider(provider, chainId);
  return multiCallProvider
}

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