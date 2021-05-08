import StakingPool from '../web3/abi/StakingPool.json'
import { getRemainTime } from '../utils/time'

export default [
  {
    name: 'WAR-HT MLP',
    rewards1: 'WAR',
    rewards2: 'MDX',
    address: ' 0xEEC6169616d6E50560E52460A2C74f74Cdf57b6F', // 超募合约地址
    rewards1Address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    rewards2Address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
    MLP: '0xe4e55c9203ac398a0f0b98bd096b70d9778eca6a',
    abi: StakingPool,
    start_at: '1620482400',
    time: '1620655200',
    dueDate: getRemainTime('2021/05/09 22:00 UTC+8'),
    openDate: getRemainTime('2021/05/11 22:00 UTC+8'),
    earnName: 'APR',
    status: 0,
    rewards: 'MLP',
    decimal: 18,
  },
]
