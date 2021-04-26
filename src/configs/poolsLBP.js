import LBP from '../web3/abi/LBP.json'

export default [
  {
    name: 'BLACK LBP',
    address: '0x1bCaC989BA76C293f56b2Ae7490d5375977F6eb9', // 超募合约地址
    abi: LBP,
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
    ratio: '1BLACK=?HT', // 兑换比例需要确认
    underlying: {
      address: '0xDe9495De889996404b14dDBf05f66Db7401F0733',
      decimal: 18,
      symbol: 'BLACK',
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
    website: 'https://www.blackhole.black',
    white_paper: '-',
    twitter: 'https://twitter.com/BlackHoleBurn',
    Telegram_Channel: 'https://t.me/BlackholeProtocolOfficial',
    Github: 'https://github.com/black-hole-finance',
    yuque: '-',
    status: 0,
    time: '1619611200',
    link_url: 'https://www.blackhole.black', // 跳转外链接
    project_introduction: 'An approval-free decentralized & cross-chain burning protocol, innovator of perpetual deflationary blockchain ecosystem.',
  },
]
