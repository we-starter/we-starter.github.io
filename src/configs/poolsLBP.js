import LBP from '../web3/abi/LBP.json'
import LBPV2 from '../web3/abi/LBPV2.json'
import PAUL from '../assets/icon/PAUL.png'
import BLACK from '../assets/icon/BLACK.png'

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
    icon: BLACK,
    type: 2,
    isPrivate: false,
    ratio: '1BLACK=0.0027HT', // 兑换比例需要确认
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
    status: 3,
    time: '1619701200',
    link_url: 'https://www.blackhole.black', // 跳转外链接
    farm_lpt: 'WAR-USDT',
    farm_link:
      'https://ht.mdex.com/#/add/HT/0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    project_introduction:
      'An approval-free decentralized & cross-chain burning protocol, innovator of perpetual deflationary blockchain ecosystem.',
    networkId: 128,
  },
  {
    name: 'PAUL LBP',
    address: '0x30DceF869fe03554E281933dA495F6Dab0A3Ce22', // 超募合约地址
    abi: LBPV2,
    start_at: '1622548800',
    is_top: true,
    is_coming: false,
    currency: {
      address: '0xa71EdC38d189767582C38A3145b5873052c3e47a', // 如果是0x0则是ht
      decimal: 18,
      symbol: 'USDT',
    },
    icon: PAUL,
    type: 2,
    isPrivate: false,
    ratio: '1PAUL=0.002USDT', // 兑换比例需要确认
    underlying: {
      address: '0xfc01b8f883a89278235ba674bbe2bb48db96d9cf',
      decimal: 18,
      symbol: 'PAUL',
      name: 'LBP',
      total_supply: '10,000,000,000',
      holders: '-',
      transfers: '-',
    },
    amount: '100000',
    pool_info: {
      token_distribution: 'Jun 1th 2021, 8:00PM SGT',
      min_allocation: '-',
      max_allocation: '-',
      min_swap_level: '190,000,000 PAUL',
    },
    totalPurchasedAmount: '190000000000000000000000000',
    website: 'https://www.paulprotocol.io',
    white_paper: '-',
    twitter: 'https://twitter.com/PaulProtocolV1',
    Telegram_Channel: 'https://t.me/PaulProtocolV1Community',
    Github: '-',
    yuque: '-',
    status: 0,
    time: '1622635200',
    link_url: 'https://www.paulprotocol.io', // 跳转外链接
    farm_lpt: 'PAUL-USDT',
    farm_link:
      'https://ht.mdex.com/#/add/0xa71EdC38d189767582C38A3145b5873052c3e47a/0xFC01b8f883a89278235ba674bbE2bb48db96d9Cf',
    project_introduction:
      'Paul Protocol is a double-mechanism risk resistant oracle with superior performance and timeliness.',
    networkId: 128,
  },
]
