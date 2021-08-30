import React, { useContext, useState, useEffect, useMemo } from 'react'
import { getContract, getLogs, useActiveWeb3React } from '../../web3'
import {
  ADDRESS_0,
  ChainId,
  MDEX_ADDRESS,
  MDEX_FACTORY_ADDRESS,
  MDEX_POOL_ADDRESS,
  MDEX_ROUTER_ADDRESS,
  MINE_MOUNTAIN_ADDRESS,
  RPC_URLS,
  USDT_ADDRESS,
  WAR_ADDRESS,
  WETH_ADDRESS,
  WHT_ADDRESS,
} from '../../web3/address'
import StakingReward from '../../web3/abi/StakingReward.json'
import { abi as ERC20 } from '../../web3/abi/ERC20.json'
import LPT from '../../web3/abi/LPT.json'
import MDexFactory from '../../web3/abi/MDexFactory.json'
import MDexPool from '../../web3/abi/MDexPool.json'
import Pools from '../../configs/pools'
import Farm from '../../configs/farm'
import Web3 from 'web3'
import { ReactComponent as HUSD } from '../../assets/logo/HUSD.svg'
import { ReactComponent as HT } from '../../assets/logo/HT.svg'
import { ReactComponent as MDX } from '../../assets/logo/MDX.svg'
import { ReactComponent as WAR } from '../../assets/logo/war.svg'
import { ReactComponent as HBTC } from '../../assets/logo/HBTC.svg'
import { ReactComponent as HUSD_HT } from '../../assets/logo/HUSD-HT.svg'
import { ReactComponent as HUSD_WAR } from '../../assets/logo/HUSD-WAR.svg'
import { ReactComponent as HUSD_MDX } from '../../assets/logo/HUSD-MDX.svg'

import { ReactComponent as X1 } from '../../assets/logo/1x.svg'
import { ReactComponent as X2_5 } from '../../assets/logo/2.5X.svg'
import { ReactComponent as X2 } from '../../assets/logo/2X.svg'
import { ReactComponent as X4 } from '../../assets/logo/4X.svg'
import { ReactComponent as X5 } from '../../assets/logo/5x.svg'
import { ReactComponent as X10 } from '../../assets/logo/10X.svg'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { formatAmount, fromWei, numToWei } from '../../utils/format'
import PoolsLBP from '../../configs/poolsLBP'
import { useAllowance, useTokenAllowance } from '../Hooks'
import {
  getMultiCallProvider,
  processResult,
  getOnlyMultiCallProvider,
} from '../../utils/multicall'
import { Contract } from 'ethers-multicall-x'
import warnAboutDeprecatedESMImport from 'react-router-dom/es/warnAboutDeprecatedESMImport'
import { mainContext } from '../../reducer'
import { JsonRpcProvider } from '@ethersproject/providers'
import { debounce } from 'lodash'
import { BLOCK_HEIGHT } from '../../const'

export const useStakingInfo = (stakingInfo) => {
  const { account } = useActiveWeb3React()
  const [earned, setEarned] = useState()
  const [reward, setReward] = useState()
  const [staked, setStaked] = useState()
  const [earnedTotal, setEarnedTotal] = useState()
  const [balance, setBalance] = useState()
  function queryStakingInfo() {
    var web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.HECO)))
    const contract = new web3.eth.Contract(
      StakingReward,
      stakingInfo.stakingAddress
    )
    try {
      contract.methods
        .earned(account)
        .call()
        .then((res) => {
          setEarned(res)
        })
    } catch (e) {
      console.log('earned error', e)
    }

    try {
      contract.methods
        .rewards(account)
        .call()
        .then((res) => {
          setReward(res)
        })
    } catch (e) {
      console.log('getReward error', e)
    }

    try {
      contract.methods
        .balanceOf(account)
        .call()
        .then((res) => {
          setStaked(res)
        })
    } catch (e) {
      console.log('staked error', e)
    }

    try {
      if (stakingInfo.address) {
        const tokenContract = new web3.eth.Contract(
          StakingReward,
          stakingInfo.address
        )
        tokenContract.methods
          .balanceOf(account)
          .call()
          .then((res) => {
            setBalance(res)
          })
      } else {
        web3.eth.getBalance(account).then((res) => {
          setBalance(res)
        })
      }
    } catch (e) {
      console.log('balanceOf error', e)
    }

    try {
      if (stakingInfo.address) {
        const tokenContract = new web3.eth.Contract(
          StakingReward,
          stakingInfo.address
        )
        tokenContract.methods
          .balanceOf(stakingInfo.stakingAddress)
          .call()
          .then((res) => {
            setEarnedTotal(res)
          })
      } else {
        const tokenContract = new web3.eth.Contract(
          StakingReward,
          WETH_ADDRESS(ChainId.HECO)
        )
        tokenContract.methods
          .balanceOf(stakingInfo.stakingAddress)
          .call()
          .then((res) => {
            setEarnedTotal(res)
          })
      }
    } catch (e) {
      console.log('balanceOf error', e)
    }
  }

  useEffect(() => {
    if (account) {
      queryStakingInfo()
    }
  }, [account])

  return earned && reward && earnedTotal && balance && staked
    ? { earned, reward, earnedTotal, balance, staked }
    : null
}

export const useStakingPoolInfo = () => {
  const [stakingInfos, setStakingInfos] = useState({
    staking1: [],
    staking2: [],
    staking3: [],
  })

  useEffect(() => {
    setStakingInfos({
      staking1: [
        {
          id: 0,
          title: 'HUSD POOL',
          symbol: 'HUSD',
          decimals: 8,
          address: '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
          stakingAddress: '0xE9bA85Ef193c02a5583599676d93b408E106b60B',
          logo: <HUSD />,
          multiple: <X1 />,
        },
        {
          id: 1,
          title: 'HBTC POOL',
          symbol: 'HBTC',
          address: '0x66a79d23e58475d2738179ca52cd0b41d73f0bea',
          stakingAddress: '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
          logo: <HUSD />,
          multiple: <X1 />,
        },
        {
          id: 3,
          title: 'MDX POOL',
          symbol: 'MDX',
          address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
          stakingAddress: '0x51137287b88F2CcC39f0E32267035Ad46aeB1e9b',
          logo: <MDX />,
          multiple: <X1 />,
        },
        {
          id: 4,
          title: 'HT POOL',
          symbol: 'HT',
          address: null,
          stakingAddress: '0xB65853Ddc2366564e2238c70a0676B886c79dD9b',
          logo: <HUSD />,
          multiple: <X2_5 />,
        },
      ],
      staking2: [
        {
          id: 0,
          title: 'WAR-HT POOL',
          symbol: 'WAR-HT',
          address: '0x0509ff1628c90890e52874b3b8b8eeaa5a2af101',
          stakingAddress: '0x7Aa096b705FA16B595F307Ad647912077521d571',
          logo: <HUSD_HT />,
          multiple: <X10 />,
        },
        {
          id: 1,
          title: 'WAR-HUSD POOL',
          symbol: 'WAR-HUSD',
          address: '0x8b8389d355eb7b2c6c86e1bb6614c0a4cb28743a',
          stakingAddress: '0x1E214fd9348F6A35541C64CA668f25b0Cd59B2A6',
          logo: <HUSD_WAR />,
          multiple: <X4 />,
        },
        {
          id: 2,
          title: 'WAR-MDX POOL',
          symbol: 'WAR-MDX ',
          address: '0x608b1d5314b6bba219ccc73caa8831f240f1dfa2',
          stakingAddress: '0x9cd0C27f743a18Ce38acf28F051Baf09C94423Ff',
          logo: <HUSD_MDX />,
          multiple: <X2 />,
        },
      ],
      staking3: [
        {
          id: 0,
          title: 'WAR POOL',
          symbol: 'WAR',
          address: '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C',
          stakingAddress: '0x54aDaC57CED2318fB23D3093d07558C868dCf972',
          logo: <WAR />,
          multiple: <X5 />,
        },
      ],
    })
    /* switch (chainId) {
      case 3:
        setStakingInfos({
          staking1: [
            {
              id: 0,
              title: 'HUSD POOL',
              symbol: 'HUSD',
              address: '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
              stakingAddress: '0xE9bA85Ef193c02a5583599676d93b408E106b60B',
              logo: <HUSD />,
              multiple: <X1 />,
            },
            {
              id: 1,
              title: 'HBTC POOL',
              symbol: 'HBTC',
              address: '0x66a79d23e58475d2738179ca52cd0b41d73f0bea',
              stakingAddress: '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
              logo: <HUSD />,
              multiple: <X1 />,
            },
            {
              id: 3,
              title: 'MDX POOL',
              symbol: 'MDX',
              address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
              stakingAddress: '0x51137287b88F2CcC39f0E32267035Ad46aeB1e9b',
              logo: <MDX />,
              multiple: <X1 />,
            },
            {
              id: 4,
              title: 'HT POOL',
              symbol: 'HT',
              address: null,
              stakingAddress: '0xB65853Ddc2366564e2238c70a0676B886c79dD9b',
              logo: <HUSD />,
              multiple: <X2_5 />,
            },
          ],
          staking2: [
            {
              id: 0,
              title: 'WAR-HT POOL',
              symbol: 'WAR-HT',
              address: '0x7Aa096b705FA16B595F307Ad647912077521d571',
              stakingAddress: '0x0509ff1628c90890e52874b3b8b8eeaa5a2af101',
              logo: <HT />,
              multiple: <X10 />,
            },
            {
              id: 1,
              title: 'WAR-HUSD POOL',
              symbol: 'WAR-HUSD',
              address: '0x1E214fd9348F6A35541C64CA668f25b0Cd59B2A6',
              stakingAddress: '0x8b8389d355eb7b2c6c86e1bb6614c0a4cb28743a',
              logo: <HUSD />,
              multiple: <X4 />,
            },
            {
              id: 2,
              title: 'WAR-MDX POOL',
              symbol: 'WAR-MDX',
              address: '0x9cd0C27f743a18Ce38acf28F051Baf09C94423Ff',
              stakingAddress: '0x608b1d5314b6bba219ccc73caa8831f240f1dfa2',
              logo: <HUSD />,
              multiple: <X2 />,
            },
          ],
          staking3: [
            {
              id: 0,
              title: 'WAR POOL',
              symbol: 'WAR',
              address: '0xf45e4cc4DC165F9D30750F9F9c7f710288FD37b2',
              stakingAddress: '0x54aDaC57CED2318fB23D3093d07558C868dCf972',
              logo: <WAR />,
              multiple: <X5 />,
            },
          ],
        })
        break
      case 128:
        setStakingInfos({
          staking1: [
            {
              id: 0,
              title: 'HUSD POOL',
              symbol: 'HUSD',
              decimals: 8,
              address: '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
              stakingAddress: '0xE9bA85Ef193c02a5583599676d93b408E106b60B',
              logo: <HUSD />,
              multiple: <X1 />,
            },
            {
              id: 1,
              title: 'HBTC POOL',
              symbol: 'HBTC',
              address: '0x66a79d23e58475d2738179ca52cd0b41d73f0bea',
              stakingAddress: '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
              logo: <HUSD />,
              multiple: <X1 />,
            },
            {
              id: 3,
              title: 'MDX POOL',
              symbol: 'MDX',
              address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
              stakingAddress: '0x51137287b88F2CcC39f0E32267035Ad46aeB1e9b',
              logo: <MDX />,
              multiple: <X1 />,
            },
            {
              id: 4,
              title: 'HT POOL',
              symbol: 'HT',
              address: null,
              stakingAddress: '0xB65853Ddc2366564e2238c70a0676B886c79dD9b',
              logo: <HUSD />,
              multiple: <X2_5 />,
            },
          ],
          staking2: [
            {
              id: 0,
              title: 'WAR-HT POOL',
              symbol: 'WAR-HT',
              address: '0x0509ff1628c90890e52874b3b8b8eeaa5a2af101',
              stakingAddress: '0x7Aa096b705FA16B595F307Ad647912077521d571',
              logo: <HUSD_HT />,
              multiple: <X10 />,
            },
            {
              id: 1,
              title: 'WAR-HUSD POOL',
              symbol: 'WAR-HUSD',
              address: '0x8b8389d355eb7b2c6c86e1bb6614c0a4cb28743a',
              stakingAddress: '0x1E214fd9348F6A35541C64CA668f25b0Cd59B2A6',
              logo: <HUSD_WAR />,
              multiple: <X4 />,
            },
            {
              id: 2,
              title: 'WAR-MDX POOL',
              symbol: 'WAR-MDX ',
              address: '0x608b1d5314b6bba219ccc73caa8831f240f1dfa2',
              stakingAddress: '0x9cd0C27f743a18Ce38acf28F051Baf09C94423Ff',
              logo: <HUSD_MDX />,
              multiple: <X2 />,
            },
          ],
          staking3: [
            {
              id: 0,
              title: 'WAR POOL',
              symbol: 'WAR',
              address: '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C',
              stakingAddress: '0x54aDaC57CED2318fB23D3093d07558C868dCf972',
              logo: <WAR />,
              multiple: <X5 />,
            },
          ],
        })
        break
      default:
        setStakingInfos({ staking1: [], staking2: [], staking3: [] })
    }*/
  }, [])

  return stakingInfos
}

export function useBlockHeight() {
  const { state } = useContext(mainContext)
  return state.blockHeight
}

const debounceFn = debounce((pools, account, callback) => {
  const now = parseInt(Date.now() / 1000)
  const all = pools.map((pool) => {
    // 链不匹配 不调用合约
    // if (chainId !== pool.networkId) return pool
    // 如果还未开始，则不调用合约
    if (pool.is_coming) return pool

    const currency_token = pool.currency.is_ht
      ? null
      : new Contract(pool.currency.address, ERC20)
    const multicallProvider = getOnlyMultiCallProvider(pool.networkId)

    const pool_contract = new Contract(pool.address, pool.abi)
    const underlying_token = new Contract(pool.underlying.address, ERC20)
    if (pool.type === 0) {
      const promise_list = [
        pool_contract.price(), // 结算时间点
        pool_contract.totalPurchasedCurrency(), //总申购的量
        pool_contract.purchasedCurrencyOf(account),
        pool_contract.totalSettleable(),
        pool_contract.settleable(account),
        pool_contract.totalSettledUnderlying(),
      ]

      // 追加可能存在的
      pool_contract.time && promise_list.push(pool_contract.time())
      pool_contract.timeSettle && promise_list.push(pool_contract.timeSettle())
      currency_token &&
        promise_list.push(currency_token.allowance(account, pool.address))

      return multicallProvider
        .all(promise_list)
        .then((data) => {
          data = processResult(data)

          let [
            price,
            totalPurchasedCurrency,
            purchasedCurrencyOf,
            totalSettleable,
            settleable,
            totalSettledUnderlying,
            time = 0,
            timeSettle = 0,
            currency_allowance = 0,
          ] = data
          const [
            total_completed_,
            total_amount,
            total_volume,
            total_rate,
          ] = totalSettleable
          const [completed_, amount, volume, rate] = settleable
          let status = pool.status || 0 // 即将上线
          const timeClose = time
          if (timeSettle) {
            // time 如果没有的话，使用timeSettle填充
            time = timeSettle
          }
          if (pool.start_at < now && status < 1) {
            // 募集中
            status = 1
          }
          if (time < now && status < 2) {
            // 结算中
            status = 2
          }

          if (
            totalSettleable.volume == totalSettledUnderlying &&
            totalSettleable.volume > 0
          ) {
            status = 3
          }

          const totalPurchasedAmount = new BigNumber(
            Web3.utils.toWei(pool.amount, 'ether')
          )
            .multipliedBy(new BigNumber(price))
            .div(new BigNumber(Web3.utils.toWei('1', 'ether')))

          const totalPurchasedUnderlying = Web3.utils.toWei(
            new BigNumber(totalPurchasedCurrency)
              .dividedBy(new BigNumber(price))
              .toFixed(0, 1),
            'ether'
          )

          let is_join = false
          if (purchasedCurrencyOf > 0) {
            is_join = true
          }

          Object.assign(pool.currency, {
            allowance: currency_allowance,
          })
         
          return Object.assign({}, pool, {
            ratio: `1${pool.underlying.symbol}=${formatAmount(price, 18, 5)}${
              pool.currency.symbol
            }`,
            progress:
              new BigNumber(totalPurchasedCurrency)
                .dividedBy(totalPurchasedAmount)
                .toFixed(2, 1)
                .toString() * 1,
            status: status,
            time: time,
            timeClose,
            price: Web3.utils.fromWei(price, 'ether'),
            is_join,
            totalPurchasedCurrency,
            totalPurchasedAmount: totalPurchasedAmount.toString(),
            totalPurchasedUnderlying,
            purchasedCurrencyOf,
            totalSettleable: {
              completed_: total_completed_,
              amount: total_amount,
              volume: total_volume,
              rate: total_rate,
            },
            totalSettledUnderlying,
            settleable: {
              completed_,
              amount,
              volume,
              rate,
            },
          })
        })
        .catch((e) => {
          console.log(e, '===== usePoolsInfo =====')
          return pool
        })
    } else if (pool.type === 1) {
      // TODO 默认HT，后面需要根据通货来查询进度
      let currency_decimals = pool.currency.decimal
      // 白名单是offering合约
      const promise_list = [
        pool_contract.timeOffer(), // 结算时间点
        pool_contract.timeClaim(), // 结算时间点
        pool_contract.ratio(), // 比例
        pool_contract.totalQuota(), //总申购的量
        pool_contract.totalOffered(), //总申购的量
        pool_contract.totalClaimed(), //总领取的量
        pool_contract.quotaOf(account), // 最大申购额度
        pool_contract.offeredOf(account), // 已经认购的量
        pool_contract.claimedOf(account), // 已经领取的量
        underlying_token.decimals(),
      ]

      currency_token &&
        promise_list.push(currency_token.allowance(account, pool.address))

      return multicallProvider
        .all(promise_list)
        .then((data) => {
          data = processResult(data)
          let [
            start_at,
            time,
            ratio,
            totalQuota,
            totalOffered,
            totalClaimed,
            quotaOf,
            offeredOf,
            claimedOf,
            underlying_decimals,
            currency_allowance = 0,
          ] = data
          let status = pool.status || 0 // 即将上线
          if (start_at < now && status < 1) {
            // 募集中
            status = 1
          }

          if (time < now && status < 2) {
            // 结算中
            status = 2
          }

          if (
            status === 2 &&
            totalOffered === totalClaimed &&
            totalClaimed > 0
          ) {
            status = 3
          }
          if (!(ratio - 0) && pool.defaultRatio) {
            ratio = pool.defaultRatio
          }
          const _ratio = new BigNumber(ratio).dividedBy(
            new BigNumber(10).pow(
              parseInt(underlying_decimals) - parseInt(currency_decimals) + 18
            )
          )
          const __ratio = new BigNumber(1).dividedBy(
            new BigNumber(ratio).dividedBy(
              new BigNumber(10).pow(
                parseInt(underlying_decimals) - parseInt(currency_decimals) + 18
              )
            )
          )
          const totalPurchasedAmount = Web3.utils.toWei(
            new BigNumber(pool.amount)
              .dividedBy(new BigNumber(_ratio))
              .toFixed(6, 1)
              .toString(),
            'ether'
          )
          const totalPurchasedCurrency = Web3.utils.toWei(
            new BigNumber(Web3.utils.fromWei(totalOffered, 'ether'))
              .dividedBy(new BigNumber(_ratio))
              .toFixed(6, 1)
              .toString(),
            'ether'
          )

          let is_join = false
          if (offeredOf > 0) {
            is_join = true
          }

          // TODO 后续申购物为Token时，需要设置allowance
          // --- 用USDT兑换时需要allowance ---
          Object.assign(pool.currency, {
            allowance: currency_allowance,
          })
          return Object.assign({}, pool, {
            ratio: `1${pool.underlying.symbol}=${
              __ratio.toFixed(5, 1).toString() * 1
            }${pool.currency.symbol}`,
            progress:
              new BigNumber(Web3.utils.fromWei(totalOffered, 'ether'))
                .dividedBy(new BigNumber(pool.amount))
                .toNumber()
                .toFixed(2) * 1,
            status: status,
            start_at,
            time: time,
            timeClose: 0,
            price:
              new BigNumber(Web3.utils.toWei('1', 'ether'))
                .dividedBy(new BigNumber(ratio))
                .toFixed(6, 1) * 1,
            is_join,
            totalPurchasedCurrency,
            totalPurchasedAmount,
            totalPurchasedUnderlying: totalOffered,
            purchasedCurrencyOf: Web3.utils.toWei(
              new BigNumber(Web3.utils.fromWei(offeredOf, 'ether'))
                .dividedBy(new BigNumber(_ratio))
                .toFixed(6, 1)
                .toString(),
              'ether'
            ),
            quotaOf, //最大可申购额度 大于0则在白名单里面
            totalSettleable: {
              amount: 0,
              volume: totalClaimed,
              rate: Web3.utils.toWei('1', 'ether'),
            },
            settleable: {
              amount: 0, // 未结算数量
              volume: offeredOf, // 预计中签量
              claimedOf, // 获取募资币种数量
              rate: Web3.utils.toWei('1', 'ether'), // 预计中签率
            },
          })
        })
        .catch((e) => {
          console.log(e, '===== usePoolsInfo =====')
          return pool
        })
    }
  })

  callback(Promise.all(all))
  // Promise.all(all
  // )
  //     .then((pools) => {
  //       console.log(pools)
  //
  //       setPoolsInfo()
  //     })
  //     .catch((e) => {
  //       setPoolsInfo(pools)
  //       console.log(e, 'pools')
  //     })
}, 1000)

export const usePoolsInfo = (address = '') => {
  const { account } = useActiveWeb3React()
  const blockHeight = useBlockHeight()

  const pools = Pools.filter((o) => address === '' || o.address === address)

  const [poolsInfo, setPoolsInfo] = useState(pools)

  const now = parseInt(Date.now() / 1000)
  // 数据预处理
  pools.map((item) => {
    let status = item.status
    if (status === 0) {
      status = now < item.start_at ? 0 : now < item.time ? 1 : 2
    }
    return Object.assign(item, {
      quotaOf: 0, //设置默认不在白名单
      status: status,
      timeClose: item.timeClose || '0',
      // progress: status === 3 ? 1 : 0,
      totalPurchasedUnderlying:
        status === 3 ? Web3.utils.toWei(item.amount) : 0,
      currency: {
        is_ht: item.currency.address === '0x0',
        ...item.currency,
      },
    })
  })

  useEffect(() => {
    if (!account) return () => {}
    debounceFn(pools, account, (promise) => {
      promise
        .then((pools) => {
          setPoolsInfo(pools)
        })
        .catch((e) => {
          setPoolsInfo(pools)
          console.log(e, 'pools')
        })
    })
    return () => {}
  }, [account, address, blockHeight])
  return poolsInfo
}

export const usePoolsLBPInfo = (address = '') => {
  const { account } = useActiveWeb3React()
  const blockHeight = useBlockHeight()

  const now = parseInt(Date.now() / 1000)

  const poolsLBP = PoolsLBP.filter(
    (o) => address === '' || o.address === address
  )

  const [poolsLBPInfo, setPoolsLBPInfo] = useState(poolsLBP)

  // 数据预处理
  poolsLBP.map((item) => {
    // 链不匹配 不调用合约
    let status = item.status
    if (status === 0) {
      status = now < item.start_at ? 0 : now < item.time ? 1 : 3
    }

    return Object.assign(item, {
      status: status,
      currency: {
        is_ht: item.currency.address === '0x0',
        ...item.currency,
      },
    })
  })

  useMemo(() => {
    const multicallProvider = getOnlyMultiCallProvider(ChainId.HECO)
    Promise.all(
      poolsLBP.map((pool) => {
        // 如果还未开始，则不调用合约
        if (pool.is_coming) return pool

        // 如果是已完成状态，则不调用合约
        if (pool.status == 3) return pool

        const pool_contract = new Contract(pool.address, pool.abi)

        const promise_list = [
          pool_contract.begin(), // 开始时间
          pool_contract.span(), // lbp持续时间
          pool_contract.priceLBP(), // 价格
        ]
        return multicallProvider
          .all(promise_list)
          .then((data) => {
            data = processResult(data)
            let [begin, span, priceLBP] = data
            const start_at = begin // 开始时间
            const time = parseInt(begin) + parseInt(span) // 结束时间
            let status = pool.status
            if (start_at < now && status < 1) {
              // 募集中
              status = 1
            }
            if (time < now && status < 3) {
              // 结束
              status = 3
            }

            const is_join =
              localStorage.getItem(`is_join_${pool.address}`) || false
            const price = Web3.utils.fromWei(priceLBP, 'ether')
            return Object.assign({}, pool, {
              ratio: `1${pool.underlying.symbol}=${formatAmount(priceLBP)}${
                pool.currency.symbol
              }`,
              status: status,
              time: time,
              price: Web3.utils.fromWei(priceLBP, 'ether'),
              is_join,
            })
          })
          .catch((e) => {
            console.log(e, '==== usePoolsLBPInfo ====')
            return pool
          })
      })
    )
      .then((pools) => {
        console.log(pools)
        setPoolsLBPInfo(pools)
      })
      .catch((e) => {
        console.log(e, 'usePoolsLBPInfo')
      })

    return () => {}
  }, [account, address, blockHeight])
  return poolsLBPInfo
}

export const useFarmInfo = (address = '') => {
  const { account } = useActiveWeb3React()
  const blockHeight = useBlockHeight()
  const pool = Farm.find((o) => o.address === address)
  const now = parseInt(Date.now() / 1000)

  const [farmPoolsInfo, setFarmPoolsInfo] = useState(pool)

  useMemo(() => {
    const multicallProvider = getOnlyMultiCallProvider(pool.networkId)
    const pool_contract = new Contract(pool.address, pool.abi)
    const currency_token = new Contract(pool.MLP, ERC20)
    const promise_list = [
      pool_contract.begin(), // 开始时间
      pool_contract.totalSupply(), // 总抵押
    ]
    if (account) {
      promise_list.push(
        pool_contract.earned(account), // 奖励1
        pool_contract.balanceOf(account), // 我的抵押
        currency_token.allowance(account, pool.address)
      )
      if (pool.rewards2) {
        promise_list.push(pool_contract.earned2(account))
      }
    }
    // console.log('request___1')
    multicallProvider.all(promise_list).then((data) => {
      data = processResult(data)
      let [
        begin,
        totalSupply,
        earned = 0,
        balanceOf = 0,
        currency_allowance = 0,
        earned2 = 0,
      ] = data
      // console.log(balanceOf, 'balanceOfbalanceOf')
      const newPool = Object.assign({}, pool, {
        start_at: begin,
        earned,
        earned2,
        totalSupply,
        balanceOf: Web3.utils.fromWei(String(balanceOf), 'ether'),
        allowance: currency_allowance,
      })
      setFarmPoolsInfo(newPool)
    })
  }, [account, address, blockHeight])
  return farmPoolsInfo
}

export const useTotalRewards = (address, abi, _chainId) => {
  const [total, setTotal] = useState(0)
  const blockHeight = useBlockHeight()
  var web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS(_chainId)))
  const contract = new web3.eth.Contract(abi, address)
  useMemo(() => {
    if (address) {
      contract.methods
        .rewards(ADDRESS_0)
        .call()
        .then((_total) => {
          setTotal(_total)
        })
    }
    return () => {}
  }, [blockHeight])
  return total
}

export const useSpan = (address, abi, _chainId) => {
  const [span, setSpan] = useState(0)
  const blockHeight = useBlockHeight()
  useMemo(() => {
    if (address) {
      var web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS(_chainId)))
      const contract = new web3.eth.Contract(abi, address)
      contract.methods
        .rewardsDuration()
        .call()
        .then((_span) => {
          setSpan(_span)
        })
    }
    return () => {}
  }, [blockHeight])
  return span
}

export const useAPR = (
  pool_address,
  pool_abi,
  lpt_address,
  reward1_address,
  valueAprToken,
  valueAprPath,
  rewardsAprPath,
  settleToken,
  mode = 1,
  _chainId
) => {
  const blockHeight = useBlockHeight()
  // const [yearReward, setYearReward] = useState(0)
  const [apr, setApr] = useState(0)

  const [reward1Vol, setReward1Vol] = useState('0')
  const [rewardsTotalValue, setRewardsTotalValue] = useState('0')
  const [lptTotalValue, setLptTotalValue] = useState('0')

  // console.log('555555555')
  // 获取奖励1在矿山的总量
  const allowance = useAllowance(
    reward1_address,
    pool_address,
    MINE_MOUNTAIN_ADDRESS(_chainId),
    _chainId
  )
  // console.log('allowance', allowance)
  // 获取奖励1未发放的量
  const unClaimReward = useTotalRewards(pool_address, pool_abi, _chainId)

  // console.log('allowance unClaimReward', unClaimReward)
  const span = useSpan(pool_address, pool_abi, _chainId)
  // console.log('span', span)
  // 奖励1的价值
  // const reward1 = useRewardsValue(reward1_address, WAR_ADDRESS(chainId), yearReward)

  // 矿池总的LPT的价值
  const lptValue = useLTPValue(
    lpt_address,
    valueAprToken,
    pool_address,
    pool_abi,
    _chainId
  )

  // 通过转换后的lpt价格
  const [lptTotalPrice] = useMDexPrice(
    valueAprToken,
    settleToken,
    1,
    valueAprPath,
    _chainId
  )
  // 奖励转换后的价格
  const [rewardsTotalPrice] = useMDexPrice(
    reward1_address,
    settleToken,
    1,
    rewardsAprPath,
    _chainId
  )
  // console.log('allowance', {
  //   allowance,
  //   lptValue: lptValue.toString(),
  //   lptTotalPrice: lptTotalPrice,
  //   rewardsTotalPrice: rewardsTotalPrice
  // })
  useMemo(() => {
    setLptTotalValue(
      new BigNumber(lptTotalPrice)
        .multipliedBy(new BigNumber(lptValue))
        .toString()
    )
  }, [lptTotalPrice])

  useMemo(() => {
    setRewardsTotalValue(
      new BigNumber(rewardsTotalPrice)
        .multipliedBy(new BigNumber(reward1Vol))
        .toString()
    )
  }, [rewardsTotalPrice])

  // 计算奖励的量
  useMemo(() => {
    if (allowance && pool_address) {
      const reward1_vol = new BigNumber(allowance).minus(
        new BigNumber(unClaimReward)
      )
      // console.log('reward1_vol', reward1_vol.toString())
      setReward1Vol(reward1_vol.toString())
    }
  }, [allowance, unClaimReward, _chainId])

  useMemo(() => {
    // console.log('rewardsTotalValue', rewardsTotalValue)
    if (lptTotalValue && rewardsTotalValue && span > 0) {
      const dayRate = new BigNumber(1).div(
        new BigNumber(span).div(new BigNumber(86400))
      )

      if (mode === 1) {
        // 奖励的war
        const yearReward = dayRate
          .multipliedBy(new BigNumber(rewardsTotalValue))
          .multipliedBy(new BigNumber(365))
          .toFixed(0, 1)
        // setYearReward(yearReward)
        if (yearReward > 0) {
          const _arp = new BigNumber(yearReward)
            .div(new BigNumber(lptTotalValue))
            .toString()
          setApr(_arp)
        }
      } else if (mode === 2) {
        const _arp = dayRate
          .multipliedBy(new BigNumber(rewardsTotalValue))
          .dividedBy(new BigNumber(lptTotalValue))
          .plus(new BigNumber(1))
          .exponentiatedBy(new BigNumber(365))
        if (_arp > 0) {
          setApr(_arp)
        }
      }
    }
    return () => {}
  }, [span, lptTotalValue, rewardsTotalValue, blockHeight])
  return apr
}

export const useMdxARP = (
  pool_address,
  pool_abi,
  lpt_address,
  _chainId,
  daily,
  pid
) => {
  // mdx 年释放总量 * 价值 /
  const multicallProvider = getOnlyMultiCallProvider(_chainId)
  const [apr, setApr] = useState(0)
  const blockHeight = useBlockHeight()

  const lptValue = useLTPValue(
    lpt_address,
    WAR_ADDRESS(ChainId.HECO),
    pool_address,
    pool_abi,
    _chainId
  )
  const [mdex2warPrice, mdex2warPriceFee] = useMDexPrice(
    MDEX_ADDRESS,
    WAR_ADDRESS(ChainId.HECO),
    daily,
    [USDT_ADDRESS(ChainId.HECO)],
    _chainId, // 取价格的chainId只有在HECO上有
    pool_address
  )
  useMemo(() => {
    if (pool_address && lptValue > 0 && mdex2warPrice > 0) {
      const contract = new Contract(MDEX_POOL_ADDRESS, MDexPool)
      const pool_contract = new Contract(pool_address, pool_abi)
      const promiseList = [contract.poolInfo(pid), pool_contract.totalSupply()]
      // console.log('request___2')
      multicallProvider.all(promiseList).then((data) => {
        data = processResult(data)
        const [poolInfo, totalSupply] = data
        const totalAmount = poolInfo[5]
        const radio = new BigNumber(totalSupply).div(new BigNumber(totalAmount))
        const totalRewardValue = radio
          .multipliedBy(new BigNumber(numToWei(mdex2warPrice)))
          .multipliedBy(new BigNumber(365))
        const apr = totalRewardValue.div(lptValue).toString()
        setApr(apr)
      })
    }
  }, [lptValue, mdex2warPrice, blockHeight])
  return apr
}
export const useMDexPrice = (
  address1,
  address2,
  amount = 1,
  path = [],
  _chainId,
  mdexReward = true
) => {
  const FEE_RADIO = '0.003'
  const blockHeight = useBlockHeight()
  const [price, setPrice] = useState(0)
  const [fee, setFee] = useState(0)

  const multicallProvider = getOnlyMultiCallProvider(_chainId)
  const getPairPrice = (address1, address2, amount) => {
    const factoryConfig = MDEX_FACTORY_ADDRESS(_chainId)
    const factory = new Contract(factoryConfig.address, factoryConfig.abi)
    const promise_list = [factory.getPair(address1, address2)]

    // console.log('request___3')
    return multicallProvider.all(promise_list).then((data) => {
      let [pair_address] = processResult(data)
      const pair_contract = new Contract(pair_address, LPT)
      const routerConfig = MDEX_ROUTER_ADDRESS(_chainId)
      const mdex_router_contract = new Contract(routerConfig.address, routerConfig.abi)
      const promiseList = [
        pair_contract.token0(),
        pair_contract.token1(),
        pair_contract.getReserves(),
      ]

      // console.log('request___4')
      return multicallProvider.all(promiseList).then((promiseListData) => {
        const [token0, token1, getReserves] = promiseListData
        const { _reserve0, _reserve1 } = getReserves
        const mdexRouterList1 = [
          mdex_router_contract.getAmountOut(
            numToWei(amount),
            _reserve1,
            _reserve0
          ),
        ]
        const mdexRouterList2 = [
          mdex_router_contract.getAmountOut(
            numToWei(amount),
            _reserve0,
            _reserve1
          ),
        ]

        // console.log('request___5')
        if (token0.toLowerCase() == address2.toLowerCase()) {
          return multicallProvider
            .all(mdexRouterList1)
            .then((amountOutData) => {
              let [amountOut] = processResult(amountOutData)
              return Web3.utils.fromWei(amountOut, 'ether')
            })
        } else if (token1.toLowerCase() == address2.toLowerCase()) {
          return multicallProvider
            .all(mdexRouterList2)
            .then((amountOutData) => {
              let [amountOut] = processResult(amountOutData)
              return Web3.utils.fromWei(amountOut, 'ether')
            })
        }
      })
    })
  }

  const getPrice = async (address1, address2, amount, path, _chainId) => {
    if (address1 === address2) {
      return ['1', '0.003']
    }
    console.log(address1, address2, amount, path, _chainId);
    const _path = [address1, ...path, address2]
    let _price = 0
    _price = amount
    let _fee = '0'
    let _fee_amount = amount.toString()
    for (let i = 1; i < _path.length; i++) {
      const from_address = _path[i - 1]
      const to_address = _path[i]
      _price = await getPairPrice(from_address, to_address, _price)
      // _fee = _fee + _fee_amount * FEE_RADIO
      // _fee_amount = _fee_amount - _fee_amount * FEE_RADIO
      _fee = new BigNumber(_fee)
        .plus(new BigNumber(_fee_amount).multipliedBy(new BigNumber(FEE_RADIO)))
        .toString()
      _fee_amount = new BigNumber(_fee_amount)
        .minus(
          new BigNumber(_fee_amount).multipliedBy(new BigNumber(FEE_RADIO))
        )
        .toString()
    }
    console.log('_price, _fee', _price, _fee)
    return [_price, _fee]
  }

  useMemo(() => {
    console.log('mdexReward', mdexReward)
    if ( mdexReward && Web3.utils.isAddress(address1) && amount > 0 && blockHeight > 0) {
      // use path
      getPrice(address1, address2, amount, path, _chainId).then(
        ([_price, _fee]) => {
          setPrice(_price)
          setFee(_fee)
        }
      )
    }
    return () => {}
  }, [blockHeight, address1, address2, amount])
  if (amount == 0) return ['0', '0']

  return [price, fee]
}

/**
 * 获取ltp的价值
 * @param address
 */
export const useLTPValue = (
  address,
  token_address,
  pool_address,
  pool_abi,
  _chainId
) => {
  const [value, setValue] = useState(0)
  const blockHeight = useBlockHeight()
  useMemo(() => {
    if (pool_address) {
      const multicallProvider = getOnlyMultiCallProvider(_chainId)

      const pool_contract = new Contract(pool_address, pool_abi)

      const contract = new Contract(address, LPT)

      const promise_list = [
        contract.token0(),
        contract.token1(),
        contract.getReserves(),
        contract.totalSupply(),
        pool_contract.totalSupply(),
      ]
      // console.log('request___6')
      multicallProvider
        .all(promise_list)
        .then((data) => {
          // console.log(data)
          // console.log('#############')
          data = processResult(data)
          const [
            token0_address,
            token1_address,
            [_reserve0, _reserve1],
            totalSupply,
            poolTotalSupply,
          ] = data
          // console.log('_reserve0', _reserve0)
          // console.log('_reserve1', _reserve1)
          // console.log('token0_address', token0_address)
          // console.log('token1_address', token1_address)
          // console.log('token_address', token_address)
          // console.log('totalSupply', totalSupply)
          // console.log('poolTotalSupply', poolTotalSupply)
          if (token_address == token0_address) {
            setValue(
              new BigNumber(_reserve0)
                .multipliedBy(new BigNumber(2))
                .multipliedBy(
                  new BigNumber(poolTotalSupply).div(new BigNumber(totalSupply))
                )
            )
          } else if (token_address == token1_address) {
            setValue(
              new BigNumber(_reserve1)
                .multipliedBy(new BigNumber(2))
                .multipliedBy(
                  new BigNumber(poolTotalSupply).div(new BigNumber(totalSupply))
                )
            )
          }
        })
        .catch((e) => {
          // 报错默认是token
          multicallProvider.all([pool_contract.totalSupply()]).then((data) => {
            data = processResult(data)
            const [poolTotalSupply] = data
            setValue(new BigNumber(poolTotalSupply))
          })
        })
    }
    return () => {}
  }, [blockHeight])
  return value
}

/**
 * 获取奖励的价值
 * @param address1 发放的token
 * @param address2 计价的token
 * @param vol
 */
export const useRewardsValue = (address1, address2, vol) => {
  const [price, fee] = useMDexPrice(address1, address2)
  const [value, setValue] = useState(0)
  useMemo(() => {
    const _value = new BigNumber(price).multipliedBy(new BigNumber(vol))
    setValue(_value)
    return () => {}
  }, [price])
  return value
}

export const useAllow = (pool) => {
  const { account } = useActiveWeb3React()
  const [allow, setArrow] = useState(false)

  useMemo(() => {
    if (account) {
      if (pool.accessType === 'private') {
        const multicallProvider = getOnlyMultiCallProvider(pool.networkId)
        const contract = new Contract(pool.address, pool.abi)
        multicallProvider.all([
          contract.allowList(account),
        ]).then((data)=>{
          const [allow_] = processResult(data)
          setArrow({
            'false': false,
            'true': true
          }[allow_])
        })
      }
    }
  }, [account])
  return allow
}