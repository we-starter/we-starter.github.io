export const ChainId = {
  BSC: 56,
  HECO: 128,
}

export const SCAN_ADDRESS = {
  [ChainId.BSC]: 'https://bscscan.com',
  [ChainId.HECO]: 'https://hecoinfo.com',
}

export const ADDRESS_0 = '0x0000000000000000000000000000000000000000'

export const MDEX_POOL_ADDRESS = '0xFB03e11D93632D97a8981158A632Dd5986F5E909'
export const MDEX_ADDRESS = '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c'
export const MDEX_ROUTER_ADDRESS = '0xED7d5F38C79115ca12fe6C0041abb22F0A06C300'


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
    default:
      return '0x910651F81a605a6Ef35d05527d24A72fecef8bF0'
  }
}

export function MDEX_FACTORY_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0xb0b670fc1F7724119963018DB0BfA86aDb22d941'
    case ChainId.HECO:
      return '0xb0b670fc1F7724119963018DB0BfA86aDb22d941'
    default:
      return '0xb0b670fc1F7724119963018DB0BfA86aDb22d941'
  }
}

export function MINE_MOUNTAIN_ADDRESS(chainId) {
  switch (chainId) {
    case ChainId.BSC:
      return '0xEEC6169616d6E50560E52460A2C74f74Cdf57b6F'
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
    [ChainId.BSC]: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
  }[chainId]
}

export function RPC_URLS (chainId) {
    return {
      [ChainId.HECO]: 'https://http-mainnet-node.huobichain.com',
      [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
    }[chainId]
}

export const CHAIN_SWAP_NODE_REQ_URL = [
  'https://node1.chainswap.exchange/web/getSignDataSyn',
  'https://node2.chainswap.exchange/web/getSignDataSyn',
  'https://node3.chainswap.exchange/web/getSignDataSyn',
  'https://node4.chainswap.exchange/web/getSignDataSyn',
  'https://node5.chainswap.exchange/web/getSignDataSyn',
]