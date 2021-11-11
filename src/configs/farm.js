import StakingPool from '../web3/abi/StakingPool.json'
import StakingPool3 from '../web3/abi/StakingPool3.json'
import { getRemainTime } from '../utils/time'

import AllowListStakePool from '../web3/abi/AllowListStakePool.json'
import {ChainId} from "../web3/address";
import {numToWei} from "../utils/format";

const testNetworkId = window.ethereum && (~~window.ethereum.chainId === ChainId.LOCALHOST) ? ChainId.LOCALHOST : null
if (testNetworkId) {
  console.log('testNetworkId=' + testNetworkId)
}
export default [
  // 核心池

  {
    name: 'WAR POOL (DAO)',
    icon: 'PAUL-HT_small@2x.png',
    rewards1: 'WAR',
    rewards2: null,
    address: '0x980Dc14CCff09f8fc1843939c23590dE75b32e8b',
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
    openDate: '1629273600',
    dueDate: null,
    earnName: 'APY',
    status: 0,
    rewards: 'WAR',
    decimal: 18,
    is_coming: false,
    mdexReward: false,
    networkId: testNetworkId || 128,
    mdexDaily: 0,
    mdexPid: '',
    svipFlag: true,
    minAmountMortgage: '50000',
    poolType: 1, // 1单池，2LP，2sort
  },
  {
    name: 'WAR-USDT LPT',
    icon: 'MDX@2x.png',
    rewards1: 'WAR',
    rewards2: 'MDX',
    address: '0x777d69a99fE220471f23e2643007f9d086B7d714', // 超募合约地址
    rewards1Address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // war rewards is zero
    rewards2Address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
    // apr
    valueAprToken: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // WAR
    valueAprPath: [],
    rewardsAprPath: [],
    settleToken: '0xa71EdC38d189767582C38A3145b5873052c3e47a',
    reserve0: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // WAR
    reserve0Decimal: 18,
    MLP: '0x2eAB1e47Bf1660bf6De9437BD061db666111e041',
    mlpDecimal: 18,
    byLink:
      'http://ht.mdex.com/#/add/0xa71EdC38d189767582C38A3145b5873052c3e47a/0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    abi: StakingPool,
    start_at: '1626350400',
    time: '',
    dueDate: null,
    openDate: null,
    earnName: 'APR',
    status: 0,
    rewards: 'LPT',
    decimal: 18,
    is_coming: true,
    mdexReward: true,
    networkId: testNetworkId || 128,
    lpToken: 'MDEX LP Token',
    mdexDaily: 762.97,
    mdexPid: '0x5a',
    poolType: 2, // 1单池，2LP，2sort
  },
  {
    name: 'WAR POOL (DAO)',
    icon: 'PAUL-HT_small@2x.png',
    rewards1: 'WAR',
    rewards2: null,
    address: '0xF01f44B1b5770d3c5dc54FE1455786d1227736CC',
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
    openDate: '1623153600',
    dueDate: null,
    earnName: 'APY',
    status: 0,
    rewards: 'WAR',
    decimal: 18,
    is_coming: false,
    mdexReward: false,
    networkId: testNetworkId || 128,
    mdexDaily: 0,
    mdexPid: '',
    poolType: 1, // 1单池，2LP，2sort
  },

  // 临时池

  {
    name: 'PLUT',
    title: 'PLUT POOL',
    icon: 'PAUL-HT_small@2x.png',
    rewards1: 'WAR',
    rewards2: null,
    address: '0x3194863Cb969434F334ef648a7f77Fee740670c6', // 超募合约地址
    rewards1Address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // BSC上的WAR
    rewards2Address: null,
    // apr
    valueAprToken: '0x888888d87d85Bc11549b17907E8f589214EB90c2', //MLP
    valueAprPath: [],
    rewardsAprPath: [],
    settleToken: '0x55d398326f99059fF775485246999027B3197955', //bsc的usdt

    MLP: '0x888888d87d85Bc11549b17907E8f589214EB90c2', //stakingToken
    byLink:
      'https://pancakeswap.finance/swap#/swap?outputCurrency=0x888888d87d85Bc11549b17907E8f589214EB90c2',
    abi: AllowListStakePool,
    start_at: '1630324800',
    time: '',
    dueDate: '1632052800',
    openDate: '1630324800',
    earnName: 'APR',
    status: 0,
    rewards: 'PLUT',
    decimal: 18,
    is_coming: false,
    mdexReward: false,
    networkId: ChainId.BSC,
    lpToken: '',
    mdexDaily: 1534.46,
    mdexPid: '0x5a',
    accessType: 'private', // 私有的需要白名单权限
    maxAmountMortgage: 2500, //最多抵押
    rewards_price: '0.23', //写死的奖励的价格，用于计算apr
    poolType: 1, // 1单池，2LP，2sort
  },
  {
    name: 'xNFT',
    title: 'xNFT POOL',
    icon: 'PAUL-HT_small@2x.png',
    rewards1: 'WAR',
    rewards2: null,
    address: '0x64245650abF2F3ed4f761873c986A10AAFe7C909', // 超募合约地址
    rewards1Address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
    rewards2Address: null,
    // apr
    valueAprToken: '0xe5944b50df84001a36c7de0d5cb4da7ab21407d2', // WAR
    valueAprPath: [],
    rewardsAprPath: [],
    settleToken: '0xa71EdC38d189767582C38A3145b5873052c3e47a', //usdt

    MLP: '0xe5944b50df84001a36c7de0d5cb4da7ab21407d2', //stakingToken
    byLink:
      'https://ht.mdex.com/#/swap?outputCurrency=0xe5944b50df84001a36c7de0d5cb4da7ab21407d2',
    abi: AllowListStakePool,
    start_at: '1628179200',
    time: '',
    dueDate: '1629907200',
    openDate: '1628179200',
    earnName: 'APR',
    status: 0,
    rewards: 'xNFT',
    decimal: 18,
    is_coming: false,
    mdexReward: false,
    networkId: 128,
    lpToken: '',
    mdexDaily: 1534.46,
    mdexPid: '0x5a',
    accessType: 'private', // 私有的需要白名单权限
    poolType: 1, // 1单池，2LP，2sort
  },
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
    dueDate: '1626350400',
    openDate: '1622552400',
    earnName: 'APR',
    status: 0,
    rewards: 'LPT',
    decimal: 18,
    is_coming: false,
    mdexReward: false,
    mdexDaily: 0,
    networkId: 128,
    mdexPid: '0x4c',
    lpToken: 'MDEX LP Token',
    poolType: 2, // 1单池，2LP，2sort
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
    networkId: 128,
    lpToken: 'MDEX LP Token',
    mdexDaily: 0,
    mdexPid: '',
    poolType: 2, // 1单池，2LP，2sort
  },

  // {
  //   name: 'WAR-BUSD LPT',
  //   icon: 'PAUL-HT_small@2x.png',
  //   rewards1: 'WAR',
  //   rewards2: null,
  //   address: '', // 超募合约地址
  //   rewards1Address: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
  //   rewards2Address: null,
  //   // apr
  //   valueAprToken: '0x910651F81a605a6Ef35d05527d24A72fecef8bF0', // WAR
  //   valueAprPath: [
  //     '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f', // WHT
  //   ],
  //   rewardsAprPath: [
  //     '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f', // WHT
  //   ],
  //   settleToken: '0xe9e7cea3dedca5984780bafc599bd69add087d56',

  //   MLP: '0xe4e55c9203ac398a0f0b98bd096b70d9778eca6a',
  //   byLink:
  //     'https://ht.mdex.com/#/add/HT/0x910651F81a605a6Ef35d05527d24A72fecef8bF0',
  //   abi: StakingPool,
  //   start_at: '',
  //   time: '',
  //   dueDate: null,
  //   openDate: null,
  //   earnName: 'APR',
  //   status: 0,
  //   rewards: 'LPT',
  //   decimal: 18,
  //   is_coming: true,
  //   mdexReward: false,
  //   networkId: 56,
  //   lpToken: 'BSC LP Token',
  // },
]
