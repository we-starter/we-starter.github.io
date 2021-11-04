import MDexFactory from './abi/MDexFactory.json'
import MDexRouter from '../web3/abi/MDexRouter.json'
import Web3 from "web3";
export const ChainId = {
  BSC: 56,
  HECO: 128,
  MATIC: 137,
  LOCALHOST: 31337
}

export const SCAN_ADDRESS = {
  [ChainId.BSC]: 'https://bscscan.com',
  [ChainId.HECO]: 'https://hecoinfo.com',
  [ChainId.MATIC]: 'https://polygonscan.com/',
}

export const ADDRESS_0 = '0x0000000000000000000000000000000000000000'

export const MDEX_POOL_ADDRESS = '0xFB03e11D93632D97a8981158A632Dd5986F5E909'
export const MDEX_ADDRESS = '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c'

// 计算apr的合约
export function CALC_ADDRESS(chainId){
  switch (chainId) {
    case ChainId.BSC:
      return ''
    case ChainId.HECO:
      return '0x96721F86f86bf34ac77Edd8437bA15dAC24cF265'
    case ChainId.MATIC:
      return '0xd9020a0e9aca29bec5a36e8fc4feff37255606e4'
    default:
      return ''
  }
}

export function WETH_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
    case ChainId.HECO:
      return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
    default:
      return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
  }
}



export function WAR_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0x910651F81a605a6Ef35d05527d24A72fecef8bF0'
    case ChainId.HECO:
      return '0x910651F81a605a6Ef35d05527d24A72fecef8bF0'
    case ChainId.MATIC:
      return '0x81d82a35253B982E755c4D7d6AADB6463305B188'
    default:
      return '0x910651F81a605a6Ef35d05527d24A72fecef8bF0'
  }
}

export function MDEX_FACTORY_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return {
        address: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
        abi: MDexFactory
      }
    case ChainId.HECO:
      return {
        address: '0xb0b670fc1F7724119963018DB0BfA86aDb22d941',
        abi: MDexFactory
      }
    default:
      return {
        address: '0xb0b670fc1F7724119963018DB0BfA86aDb22d941',
        abi: MDexFactory
      }
  }
}
export function MDEX_ROUTER_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return {
        address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        abi: MDexRouter
      }
    case ChainId.HECO:
      return {
        address: '0xED7d5F38C79115ca12fe6C0041abb22F0A06C300',
        abi: MDexRouter
      }
    default:
      return {
        address: '0xED7d5F38C79115ca12fe6C0041abb22F0A06C300',
        abi: MDexRouter
      }
  }
}




export function MINE_MOUNTAIN_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0x2A75B4284D8A98F47D0Cc4B45943ce7C1461C2E8'
    case ChainId.HECO:
      return '0xEEC6169616d6E50560E52460A2C74f74Cdf57b6F'
    default:
      return '0xEEC6169616d6E50560E52460A2C74f74Cdf57b6F'
  }
}

export function USDT_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0xa71edc38d189767582c38a3145b5873052c3e47a'
    case ChainId.HECO:
      return '0xa71edc38d189767582c38a3145b5873052c3e47a'
    default:
      return '0xa71edc38d189767582c38a3145b5873052c3e47a'
  }
}

export function WHT_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
    case ChainId.HECO:
      return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
    default:
      return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
  }
}

export function WMDEX_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c'
    case ChainId.HECO:
      return '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c'
    default:
      return '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c'
  }
}

export function BUSD_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    case ChainId.HECO:
      return '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    default:
      return '0xe9e7cea3dedca5984780bafc599bd69add087d56'
  }
}

export function CHAIN_SWAP_ADDRESS (chainId) {
  return {
    [ChainId.HECO]: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    [ChainId.BSC]: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0'
  }[chainId]
}
export const BURN_SWAP_ADDRESS = '0x6Bab2711Ca22fE7395811022F92bB037cd4af7bc'
export const BURN_SWAP_S_ADDRESS = '0x81d82a35253B982E755c4D7d6AADB6463305B188'

export function RPC_URLS (chainId) {
    return {
      [ChainId.HECO]: 'https://http-mainnet-node.huobichain.com',
      [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
      [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com'
    }[chainId]
}

export const CHAIN_SWAP_NODE_REQ_URL = [
  'https://node1.chainswap.exchange/web/getSignDataSyn',
  'https://node2.chainswap.exchange/web/getSignDataSyn',
  'https://node3.chainswap.exchange/web/getSignDataSyn',
  'https://node4.chainswap.exchange/web/getSignDataSyn',
  'https://node5.chainswap.exchange/web/getSignDataSyn',
]

export function GAS_FEE(chainId) {
  return {
    [ChainId.HECO]: {
      maxFeePerGas: Web3.utils.toWei('8', 'gwei'),
      // gasPrice: Web3.utils.toWei('5', 'gwei'),
      maxPriorityFeePerGas: Web3.utils.toWei('5', 'gwei'),
      type: '0x2',
    }
  }[chainId]
}
