import Starter from '../web3/abi/Starter.json'

export default [
  {
    name: 'WAR LBP',
    address: '0x1bCaC989BA76C293f56b2Ae7490d5375977F6eb9', // 超募合约地址
    abi: Starter,
    start_at: '1619492400',
    is_top: true,
    is_coming: true,
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 2,
    isPrivate: false,
    underlying: {
      address: '0xDe9495De889996404b14dDBf05f66Db7401F0733',
      decimal: 18,
      symbol: 'WAR',
      name: 'LBP',
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
    time: '1619611200',
    timeClose: '0',
    purchasedCurrencyOf: 0,
    totalPurchasedAmount: '30000000000000000000000',
    totalPurchasedUnderlying: '0',
    totalPurchasedCurrency: '0',
    is_flash: false,
    link_url: 'https://www.chainswap.com', // 跳转外链接
    project_introduction: 'Chainswap is the hub for all smart chains.',
  },
]
