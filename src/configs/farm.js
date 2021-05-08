import StakingPool from '../web3/abi/StakingPool.json'
import { getRemainTime } from '../utils/time'

export default [
  {
    name: 'WAR-HT MLP',
    rewards1: 'WAR',
    rewards2: 'MDX',
    address: '0x2B8ab0f074114CC570626A1140219B4A4453d90b', // 超募合约地址
    rewards1Address: '0x948d2a81086a075b3130bac19e4c6dee1d2e3fe8',
    rewards2Address: '0x67ee3cb086f8a16f34bee3ca72fad36f7db929e2',
    MLP: '0x7616792426A33728F58c63754eE073e05F773542',
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
