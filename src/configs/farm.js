import StakingPool from '../web3/abi/StakingPool.json'
import StakingPool3 from '../web3/abi/StakingPool3.json'
import { getRemainTime } from '../utils/time'

export default [
  {
    name: 'WAR-HT LPT',
    icon: 'WAR-HT_small@2x.png',
    rewards1: 'WAR',
    rewards2: 'MDX',
    address: '0xE22da09d0B847291076bF5691a9D3908eB8CbAFe', // 超募合约地址
    rewards1Address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    rewards2Address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
    // apr
    valueAprToken: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // WAR
    valueAprPath: [
      '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F', // WHT
    ],
    rewardsAprPath: [
      '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F', // WHT
    ],
    settleToken: '0xa71EdC38d189767582C38A3145b5873052c3e47a',

    MLP: '0xe4e55c9203ac398a0f0b98bd096b70d9778eca6a',
    byLink:
      'https://ht.mdex.com/#/add/HT/0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    abi: StakingPool,
    start_at: '',
    time: '',
    dueDate: null,
    openDate: null,
    earnName: 'APR',
    status: 0,
    rewards: 'LPT',
    decimal: 18,
    is_coming: false,
    mdexReward: true,
  },
  {
    name: 'PAUL-USDT LPT',
    icon: 'PAUL-HT_small@2x.png',
    rewards1: 'WAR',
    rewards2: null,
    address: '0x5b0F4cb9041cED035Fd0a7Db3c0C2f7f4dC62A66',
    rewards1Address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    rewards2Address: null,
    // apr
    valueAprToken: '0xFC01b8f883a89278235ba674bbE2bb48db96d9Cf', // FAUL
    valueAprPath: [],
    rewardsAprPath: [
      '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F', // WHT
    ],
    settleToken: '0xa71EdC38d189767582C38A3145b5873052c3e47a', //usdt
    MLP: '0xD9baBF51f327829264f554B4Fa4e12Cec5BD0F50',
    byLink:
      'https://ht.mdex.com/#/add/0xa71EdC38d189767582C38A3145b5873052c3e47a/0xFC01b8f883a89278235ba674bbE2bb48db96d9Cf',
    abi: StakingPool,
    start_at: '',
    time: '',
    // dueDate: getRemainTime('2021/06/07 18:00 UTC+8'),
    // openDate: getRemainTime('2021/06/01 18:00 UTC+8'),
    openDate: '1622541600',
    dueDate: '1625133600',
    earnName: 'APR',
    status: 0,
    rewards: 'LPT',
    decimal: 18,
    is_coming: false,
    mdexReward: false,
  },
  {
    name: 'WAR',
    icon: 'PAUL-HT_small@2x.png',
    rewards1: 'WAR',
    rewards2: null,
    address: '0x26D0928EDBb5486Dd29f3DE4Ba981f78149Bff90',
    rewards1Address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    rewards2Address: null,
    // apr
    valueAprToken: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // WAR
    valueAprPath: [
      '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F', // WHT
    ],
    rewardsAprPath: [
      '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F', // WHT
    ],
    settleToken: '0xa71EdC38d189767582C38A3145b5873052c3e47a', //usdt
    MLP: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // WAR
    byLink:
      'https://ht.mdex.com/#/swap?outputCurrency=0x910651f81a605a6ef35d05527d24a72fecef8bf0',
    abi: StakingPool3,
    start_at: '',
    time: '',
    openDate: null,
    dueDate: null,
    earnName: 'APY',
    status: 0,
    rewards: 'WAR',
    decimal: 18,
    is_coming: false,
    mdexReward: false,
  },
]
