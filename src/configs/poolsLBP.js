import StarterV3 from '../web3/abi/StarterV3.json'

export default [
  {
    name: 'WARLBP',
    address: '0x543A2aE552D993342A92e87AeFc966B69534A799', // 超募合约地址
    abi: StarterV3,
    start_at: '1619092800',
    is_top: true,
    is_coming: true,
    currency: {
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: '0x3B73c1B2ea59835cbfcADade5462b6aB630D9890',
      decimal: 18,
      symbol: 'WAR',
      name: 'WARLBP',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '100000',
    pool_info: {
      token_distribution: 'April 22th 2021, 8:00PM SGT',
      min_allocation: '-',
      max_allocation: '-',
      min_swap_level: '30,000 USDT',
    },
    website: 'https://www.chainswap.com',
    white_paper: '-',
    twitter: 'https://twitter.com/chain_swap',
    Telegram_Channel: 'https://t.me/chainswap',
    Github: 'https://github.com/chainswap',
    yuque: '-',
    progress: 0,
    status: 0,
    ratio: '1WAR=1HT',
    time: '1619182800',
    timeClose: '1619095500',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '30000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.chainswap.com', // 跳转外链接
    project_introduction: 'Chainswap is the hub for all smart chains.',
  },
]
