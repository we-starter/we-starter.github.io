import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import Web3 from 'web3'
import ethAbi from 'web3-eth-abi'
import {message} from "antd";
import {ChainId, RPC_URLS} from "./address";

export function getWeb3(library) {
  return new Web3(library.provider)
}

export function getHttpWeb3(chainId) {
  return new Web3(new Web3.providers.HttpProvider(RPC_URLS(chainId)))
}

export function getContract(library, abi, address) {
  const web3 = new Web3(library.provider)
  return new web3.eth.Contract(abi, address)
}

export async function getLogs(library, abi, options = {}) {
  const web3 = new Web3(library.provider)
  return web3.eth.getPastLogs(options).then((data) => {
    return data.map((log) => {
      return decodeLog(log, abi)
    })
  })
}

function decodeLog(log, abi) {
  const event_map = getABIEventMap(abi)
  const topic0 = log.topics[0]
  const event = event_map[topic0]
  const decode = ethAbi.decodeLog(event.inputs, log.data, log.topics.slice(1))
  log = Object.assign({}, log, {
    topics: log.topics,
    event: event.name,
    decode,
  })
  return log
}

function getABIEventMap(abi) {
  const events = abi.filter((o) => o.type === 'event')
  const event_map = {}
  events.map((event) => {
    // 生成事件的topic0
    const topic0 = ethAbi.encodeEventSignature(event)
    Object.assign(event_map, {
      [topic0]: event,
    })
  })
  return event_map
}

export const useActiveWeb3React = () => {
  const context = useWeb3ReactCore()
  const contextNetwork = useWeb3ReactCore()
  return context.active ? context : contextNetwork
}

export const addToken = async (address, symbol, icon) =>{
  try {
    let addTokenClick = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals: 18,
          image: icon,
        },
      },
    })
    if (addTokenClick) {
      message.success('add success')
    }
  } catch (err) {
    console.log(err, 'addToken')
  }
}