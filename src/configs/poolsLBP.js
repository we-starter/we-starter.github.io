import LBP from '../web3/abi/LBP.json'

export default [
  {
    name: 'BLACK LBP',
    address: '0x7DA996Bcca3a947EB05a3477d5D4dCF59B042d99', // 超募合约地址
    abi: LBP,
    start_at: '1619614800',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0x0', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'HT',
    },
    icon: '',
    type: 2,
    isPrivate: false,
    ratio: '-', // 兑换比例需要确认
    underlying: {
      address: '0xd714d91A169127e11D8FAb3665d72E8b7ef9Dbe2',
      decimal: 18,
      symbol: 'BLACK',
      name: 'LBP',
      total_supply: '100,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '100000',
    pool_info: {
      token_distribution: 'April 28th 2021, 9:00PM SGT',
      min_allocation: '-',
      max_allocation: '-',
      min_swap_level: '1,500,000 BLACK',
    },
    totalPurchasedAmount: '1500000000000000000000000',
    website: 'https://www.blackhole.black',
    white_paper: '-',
    twitter: 'https://twitter.com/BlackHoleBurn',
    Telegram_Channel: 'https://t.me/BlackholeProtocolOfficial',
    Github: 'https://github.com/black-hole-finance',
    yuque: '-',
    status: 0,
    time: '1619701200',
    link_url: 'https://www.blackhole.black', // 跳转外链接
    project_introduction:
      'An approval-free decentralized & cross-chain burning protocol, innovator of perpetual deflationary blockchain ecosystem.',
  },
]
