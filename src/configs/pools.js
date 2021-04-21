import Offering from '../web3/abi/Offering.json'
import Starter from '../web3/abi/Starter.json'
import StarterV2 from '../web3/abi/StarterV2.json'
import StarterV3 from '../web3/abi/StarterV3.json'
import OfferingV2 from '../web3/abi/OfferingV2.json'

export default [
  {
    name: 'ChainSwap',
    address: '0x7c4e982889492dD7FFd7C0631Fa256fEaC564912', // 超募合约地址
    abi: StarterV3,
    // start_at: '1619092800',
    start_at: '1619015400',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0xaD6D458402F60fD3Bd25163575031ACDce07538D', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: '',
    type: 0,
    isPrivate: false,
    underlying: {
      address: '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C',
      decimal: 18,
      symbol: 'TOKEN',
      name: 'TOKEN',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '100000',
    pool_info: {
      token_distribution: 'April 22th 2021, 8:00PM SGT',
      min_allocation: '-',
      max_allocation: '-',
      min_swap_level: '30000 USDT',
    },
    website: 'https://www.chainswap.com',
    white_paper: '-',
    twitter: 'https://twitter.com/chain_swap',
    Telegram_Channel: 'https://t.me/chainswapann',
    Github: 'https://github.com/chainswap',
    yuque: '-',
    progress: 0,
    status: 0,
    ratio: '1TOKEN=0.3USDT',
    time: '1619019000',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '30000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.chainswap.com', // 跳转外链接
    project_introduction: 'Chainswap is the hub for all smart chains.',
  },
]
