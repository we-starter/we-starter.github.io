import StakingPool from '../web3/abi/StakingPool.json'
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
    MLP: '0xe4e55c9203ac398a0f0b98bd096b70d9778eca6a',
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
    name: 'PAUL-HT LPT',
    icon: 'PAUL-HT_small@2x.png',
    rewards1: 'WAR',
    rewards2: null,
    address: '0xE22da09d0B847291076bF5691a9D3908eB8CbAFe', // 超募合约地址
    rewards1Address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    rewards2Address: null,
    MLP: '0xe4e55c9203ac398a0f0b98bd096b70d9778eca6a',
    abi: StakingPool,
    start_at: '',
    time: '',
    dueDate: getRemainTime('2021/06/07 18:00 UTC+8'),
    openDate: getRemainTime('2021/06/01 18:00 UTC+8'),
    earnName: 'APR',
    status: 0,
    rewards: 'LPT',
    decimal: 18,
    is_coming: false,
    mdexReward: false,
  },
]
