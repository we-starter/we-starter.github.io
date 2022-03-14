import React, { useContext, useState, useEffect, useMemo } from 'react'
import {getHttpWeb3, getLogs, useActiveWeb3React} from '../../web3'
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
import { voteMain } from '../../web3/address'
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
import { formatAmount, fromWei, numToWei } from '../../utils/format'
import PoolsLBP from '../../configs/poolsLBP'
import {ClientContract, multicallClient,} from '../../utils/multicall'

import warnAboutDeprecatedESMImport from 'react-router-dom/es/warnAboutDeprecatedESMImport'
import { mainContext } from '../../reducer'
import { debounce } from 'lodash'
import { CALC_ADDRESS } from '../../web3/address'
import CalcAbi from '../../web3/abi/Calc.json'

const sameAddress = (address1, address2) => {
  if (address1.toLowerCase() === address2.toLowerCase()) {
    return [address1]
  }
  return [address1, address2]
}

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
  const all = pools.map(async (pool) => {
    // 链不匹配 不调用合约
    // if (chainId !== pool.networkId) return pool
    // 如果还未开始，则不调用合约

    if (pool.is_coming) return pool

    const currency_token = pool.currency.is_ht
      ? null
      : new ClientContract(pool.currency.symbol === 'LPT' ? LPT : ERC20, pool.currency.address, pool.networkId)

    const pool_contract = new ClientContract(pool.abi, pool.address, pool.networkId)
    let underlying_token = pool.underlying.address ? new ClientContract(ERC20, pool.underlying.address, pool.networkId) : null

    if (pool.type === 0) {
      const promise_list = [
        pool_contract.price(), // 结算时间点
        pool_contract.totalPurchasedCurrency(), //总申购的量
        pool_contract.purchasedCurrencyOf(account),
        pool_contract.totalSettleable(),
        pool_contract.settleable(account),
        pool_contract.totalSettledUnderlying(),
        pool_contract.underlying(),
        pool_contract.settledUnderlyingOf(account), // claimOf
      ]
      let balanceOf = 0
      // 获取链上的原生资产,
      if (pool.currency.is_ht){
        const web3 = getHttpWeb3(pool.networkId)
        balanceOf = await web3.eth.getBalance(pool.address)
      } else {
        // 或者合约的余额
        const currency_contract = new ClientContract(pool.currency.symbol === 'LPT' ? LPT : ERC20, pool.currency.address, pool.networkId)
        promise_list.push(currency_contract.balanceOf(pool.address))
      }


      // 追加可能存在的
      pool_contract.time && promise_list.push(pool_contract.time())
      if (pool.abi.find(item => item.name === 'timeSettle' && item.type === 'function')) {
        promise_list.push(pool_contract.timeSettle())
      }
      currency_token &&
        promise_list.push(currency_token.allowance(account, pool.address))

      return multicallClient(promise_list)
        .then((data) => {
          let [
            price,
            totalPurchasedCurrency,
            purchasedCurrencyOf,
            totalSettleable = {},
            settleable,
            totalSettledUnderlying,
            underlyingAddress,
            claimOf
          ] = data
          let time = 0,timeSettle = 0,currency_allowance = 0
          if (pool.currency.is_ht) {
            time = data[8]
            timeSettle = data[9]
            currency_allowance = data[10]
          } else {
            balanceOf = data[8]
            time = data[9]
            timeSettle = data[10]
            currency_allowance = data[11]
          }

          const [
            total_completed_,
            total_amount,
            total_volume,
            total_rate,
          ] = totalSettleable
          const [completed_, amount, volume, rate, unlockVolume, unlockRate] = settleable
          let status = pool.status || 0 // 即将上线
          const timeClose = time
          if (timeSettle > 0) {
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

          price = new BigNumber(
            numToWei(1, pool.underlying.decimal)
          )
            .multipliedBy(new BigNumber(price))
            .div(new BigNumber(10).pow(pool.currency.decimal))
            .div(new BigNumber(Web3.utils.toWei('1', 'ether'))).toString()

          console.log('price', price.toString())

          balanceOf = fromWei(balanceOf, pool.currency.decimal)
          const totalPurchasedAmount = new BigNumber(pool.amount).multipliedBy(new BigNumber(price))
          // 手动计算rate，合约取的将弃用
          // 1. 取合约地址的usdt/ht/bnb的余额
          // 2. 中签率： totalPurchasedAmount / 余额  > 1 ? 1 : rate
          const new_rate = Math.min(totalPurchasedAmount.div(new BigNumber(balanceOf)).toNumber(), 1).toString()
          // console.log('new_rate', new_rate, totalPurchasedAmount.toString(), balanceOf.toString())
          // 3. 当前用户购买的数量(USDT) * rate * ratio = 预计能获得的token
          // const obtain_amount = new BigNumber(purchasedCurrencyOf).multipliedBy(rate).div(price)
          // 4. 剩余usdt 当前用户购买的数量(USDT) * ( 1 - rate)
          // const surplus_amount = new BigNumber(purchasedCurrencyOf).multipliedBy(1 - rate)

          // console.log('rate', rate)

          totalPurchasedCurrency = fromWei(totalPurchasedCurrency, pool.currency.decimal)
          const totalPurchasedUnderlying =
            new BigNumber(totalPurchasedCurrency)
              .dividedBy(new BigNumber(price))
              .toFixed(0, 1)


          let is_join = false
          if (purchasedCurrencyOf > 0) {
            is_join = true
          }

          Object.assign(pool.currency, {
            allowance: currency_allowance,
          })
          Object.assign(pool.underlying, {
            address: underlyingAddress === '0x0000000000000000000000000000000000000000' ? '' : underlyingAddress,
          })
          const rate_ = rate < 10 ? new BigNumber(new_rate).multipliedBy(new BigNumber(10).pow(18)).toString() : rate

          // console.log('rate_', rate_, new BigNumber(new_rate).multipliedBy(new BigNumber(10).pow(18)).toString())

          const progress = new BigNumber(totalPurchasedCurrency)
            .dividedBy(totalPurchasedAmount)
            .toFixed(10, 1)
            .toString() * 1
          return Object.assign({}, pool, {
            ratio: `1${pool.underlying.symbol}=${price}${
              pool.currency.symbol
            }`,
            progress,
            status: status,
            time: time,
            timeClose,
            price,
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
              rate: rate_,
              // rate: rate < 10 ? Web3.utils.toWei(`${new_rate}`, 'ether') : rate,
              unlockVolume: pool.lock ? formatAmount(unlockVolume, pool.underlying.decimal) : formatAmount(volume, pool.underlying.decimal),
              unlockRate
            },
          })
        })
        .catch((e) => {
          console.log(e, '===== usePoolsInfo =====')
          return pool
        })
    }
    else if (pool.type === 1) {      // TODO 默认HT，后面需要根据通货来查询进度
      let currency_decimals = pool.currency.decimal
      // 白名单是offering合约
      let promise_list = []
      if (pool.nft) {
        const nft_contract = new ClientContract(pool.nft.abi, pool.nft.address, pool.networkId)
        promise_list = [
          pool_contract.timeOffer(), // 结算时间点
          pool_contract.timeClaim(), // 结算时间点
          pool_contract.totalOffered(), //总申购的量
          pool_contract.totalClaimed(), //总领取的量
          pool_contract.offeredOf(account), // 已经认购的量
          pool_contract.claimedOf(account), // 已经领取的量
          pool_contract.token(),
          pool_contract.currencyValue(),//最大申购额度
          pool_contract.tokenValue(),//固定能获得
          nft_contract.balanceOf(account),//nft个数
          pool_contract.curUser(),//参与人数
          pool_contract.maxUser() // 最多参与
        ]
      } else {
        promise_list = [
          pool_contract.timeOffer(), // 结算时间点
          pool_contract.timeClaim(), // 结算时间点
          pool_contract.totalOffered(), //总申购的量
          pool_contract.totalClaimed(), //总领取的量
          pool_contract.offeredOf(account), // 已经认购的量
          pool_contract.claimedOf(account), // 已经领取的量
          pool_contract.token(),
          pool_contract.ratio(), // 比例
          pool_contract.totalQuota(), //总申购的量
          pool_contract.quotaOf(account), // 最大申购额度
        ]
      }
      if (pool.lock){
        promise_list.push(pool_contract.getUnlockRate())
      }
      currency_token &&
        promise_list.push(currency_token.allowance(account, pool.address))

      underlying_token &&
        promise_list.push(underlying_token.decimals())
      return multicallClient(promise_list)
        .then((data) => {

          let [
            start_at,
            time,
            totalOffered,
            totalClaimed,
            offeredOf,
            claimedOf,
            tokenAddress,
          ] = data
          let ratio,
            totalQuota,
            quotaOf,
            currency_allowance = 0,
            underlying_decimals = 18,
            nftBalanceOf = 0,
            tokenValue = 0,
            nftRatio = null,
            userFull = false,
            unlockRate;

          if (pool.nft){
            quotaOf = data[7]
            tokenValue=data[8]
            nftBalanceOf = data[9][0]
            nftRatio = new BigNumber(quotaOf).div(tokenValue).toFixed(2)*1
            userFull = data[10] >= data[11]
          } else{
            ratio = data[7]
            totalQuota = data[8]
            quotaOf = data[9]
            if (pool.lock) {
              unlockRate = data[10]
              currency_allowance = data[11]||0
              underlying_decimals = data[12]||18
            } else {
              currency_allowance = data[10]||0
              underlying_decimals = data[11]||18
            }
          }
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
          // nft的中签率是100%
          const _ratio = nftRatio ? 1 : new BigNumber(ratio).dividedBy(
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
          console.log('__ratio', __ratio.toString())

          const totalPurchasedAmount =
            new BigNumber(pool.amount)
              .multipliedBy(new BigNumber(__ratio))
              .toFixed(6, 1)
              .toString()
          totalOffered = fromWei(totalOffered, pool.underlying.decimal)//当前已购买underlying的量
          const totalPurchasedCurrency = fromWei(
            new BigNumber(totalOffered)
              .dividedBy(new BigNumber(_ratio))
              .toFixed(6, 1)
              .toString(),
            pool.currency.decimal
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
           Object.assign(pool.underlying, {
             address:
               tokenAddress === '0x0000000000000000000000000000000000000000'
                 ? ''
                 : tokenAddress,
           })

          let purchasedCurrencyOf = new BigNumber(fromWei(offeredOf, pool.underlying.decimal))
            .multipliedBy(new BigNumber(__ratio))
            .toFixed(6, 1)
            .toString()
          purchasedCurrencyOf = numToWei(purchasedCurrencyOf, pool.currency.decimal)
          return Object.assign({}, pool, {
            userFull,
            nftBalanceOf,
            nftRatio,
            ratio: `1${pool.underlying.symbol}=${nftRatio ? nftRatio :
              __ratio.toFixed(5, 1).toString() * 1
            }${pool.currency.symbol}`,
            progress:
              new BigNumber(totalOffered)
                .dividedBy(pool.nft ? new BigNumber(pool.amount).div(nftRatio): new BigNumber(pool.amount))
                .toNumber()
                .toFixed(2) * 1,
            status: status,
            start_at,
            time: time,
            timeClose: 0,
            price: __ratio,
            is_join,
            totalPurchasedCurrency,
            totalPurchasedAmount,
            totalPurchasedUnderlying: totalOffered,
            purchasedCurrencyOf,
            quotaOf, //最大可申购额度 大于0则在白名单里面
            totalSettleable: {
              amount: 0,
              volume: totalClaimed,
              rate: Web3.utils.toWei('1', 'ether'),
            },
            settleable: {
              amount: 0, // 未结算数量
              volume: pool.nft ? tokenValue : offeredOf, // 预计中签量,nft是全量
              claimedOf, // 获取募资币种数量
              rate: Web3.utils.toWei('1', 'ether'), // 预计中签率
              unlockVolume: pool.lock ? (fromWei(offeredOf, pool.underlying.decimal).toNumber() * (unlockRate/100) - fromWei(claimedOf).toNumber()) : (
                fromWei(offeredOf, pool.underlying.decimal).toNumber() - fromWei(claimedOf, pool.underlying.decimal).toNumber()
              )
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
      quotaOf: item.quotaOf || 0, //设置默认不在白名单
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
    Promise.all(
      poolsLBP.map((pool) => {
        // 如果还未开始，则不调用合约
        if (pool.is_coming) return pool

        // 如果是已完成状态，则不调用合约
        if (pool.status == 3) return pool

        const pool_contract = new ClientContract(pool.abi, pool.address, pool.networkId)

        const promise_list = [
          pool_contract.begin(), // 开始时间
          pool_contract.span(), // lbp持续时间
          pool_contract.priceLBP(), // 价格
        ]
        return multicallClient(promise_list)
          .then((data) => {
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

const FEE_RADIO = '0.003'
const getPairPrice = (address1, address2, amount, _chainId) => {
  const factoryConfig = MDEX_FACTORY_ADDRESS(_chainId)
  const factory = new ClientContract(factoryConfig.abi, factoryConfig.address, _chainId)
  const promise_list = [factory.getPair(address1, address2)]

  // console.log('request___3')
  return multicallClient(promise_list).then((data) => {
    let [pair_address] = data
    const pair_contract = new ClientContract(LPT, pair_address, _chainId)
    const routerConfig = MDEX_ROUTER_ADDRESS(_chainId)

    const mdex_router_contract = new ClientContract(
      routerConfig.abi,
      routerConfig.address,
      _chainId
    )
    const promiseList = [
      pair_contract.token0(),
      pair_contract.token1(),
      pair_contract.getReserves(),
    ]

    return multicallClient(promiseList).then((promiseListData) => {
      const [token0, token1, getReserves] = promiseListData
      const [ _reserve0, _reserve1 ] = getReserves
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
        return multicallClient(mdexRouterList1).then((amountOutData) => {
          let [amountOut] = amountOutData
          return Web3.utils.fromWei(amountOut, 'ether')
        })
      } else if (token1.toLowerCase() == address2.toLowerCase()) {
        return multicallClient(mdexRouterList2).then((amountOutData) => {
          let [amountOut] = amountOutData
          return Web3.utils.fromWei(amountOut, 'ether')
        })
      }
    }).catch((e)=>{
      console.log(e)
    })
  })
}
const getPrice = async (address1, address2, amount, path, _chainId) => {
  if (address1 === address2) {
    return ['1', '0.003']
  }
  console.log(address1, address2, amount, path, _chainId)
  const _path = [address1, ...path, address2]
  let _price = 0
  _price = amount
  let _fee = '0'
  let _fee_amount = amount.toString()
  for (let i = 1; i < _path.length; i++) {
    const from_address = _path[i - 1]
    const to_address = _path[i]
    _price = await getPairPrice(from_address, to_address, _price, _chainId)
    // _fee = _fee + _fee_amount * FEE_RADIO
    // _fee_amount = _fee_amount - _fee_amount * FEE_RADIO
    _fee = new BigNumber(_fee)
      .plus(new BigNumber(_fee_amount).multipliedBy(new BigNumber(FEE_RADIO)))
      .toString()
    _fee_amount = new BigNumber(_fee_amount)
      .minus(new BigNumber(_fee_amount).multipliedBy(new BigNumber(FEE_RADIO)))
      .toString()
  }
  console.log('_price, _fee', _price, _fee)
  return [_price, _fee]
}
export const useMDexPrice = (
  address1,
  address2,
  amount = 1,
  path = [],
  _chainId,
  farmPools,
  mdexReward = true,
  passMdexReward = true
) => {
  const blockHeight = useBlockHeight()
  const [price, setPrice] = useState(0)
  const [fee, setFee] = useState(0)

  useMemo(() => {
    if (
      farmPools &&
      address1 === farmPools.rewards1Address &&
      farmPools.rewards_price &&
      passMdexReward
    ) {
      // 配置上静态写死的奖励的价格
      setPrice(farmPools.rewards_price)
    } else if (
      mdexReward &&
      Web3.utils.isAddress(address1) &&
      amount > 0 &&
      blockHeight > 0
    ) {
      // use path
      console.log('address1, address2', address1, address2)
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
 * 获取奖励的价值
 * @param address1 发放的token
 * @param address2 计价的token
 * @param vol
 */
// export const useRewardsValue = (address1, address2, vol) => {
//   const [price, fee] = useMDexPrice(address1, address2)
//   const [value, setValue] = useState(0)
//   useMemo(() => {
//     const _value = new BigNumber(price).multipliedBy(new BigNumber(vol))
//     setValue(_value)
//     return () => {}
//   }, [price])
//   return value
// }

export const useAllow = (pool) => {
  const { account } = useActiveWeb3React()
  const [allow, setArrow] = useState(false)

  useMemo(() => {
    if (account) {
      if (pool.accessType === 'private') {
        const contract = new ClientContract(pool.abi, pool.address, pool.networkId)
        multicallClient([contract.allowList(account)]).then((data) => {
          const [allow_] = data
          setArrow(
            {
              false: false,
              true: true,
            }[allow_]
          )
        })
      }
    }
  }, [account])
  return allow
}

// 临时的获取apr （配置价格固定生效）
const getApr = (pool) => {
  const pool_contract = new ClientContract(pool.abi, pool.address, pool.networkId)
  const rewards_contract = new ClientContract(ERC20, pool.rewards1Address, pool.networkId)
  // console.log('xxxx', pool.MLP, pool.settleToken)
  const promiseAll = [
    rewards_contract.allowance(
      MINE_MOUNTAIN_ADDRESS(pool.networkId),
      pool.address
    ), // 获取奖励1在矿山的总量
    pool_contract.rewardsDuration(), // span
    pool_contract.rewards(ADDRESS_0), // 获取奖励1未发放的量
  ]
  return multicallClient(promiseAll).then(async (data) => {
    const [allowance, span, rewards] = data
    // 剩余
    const dRewards = new BigNumber(allowance).minus(new BigNumber(rewards))
    // console.log('dRewards', dRewards.toString())
    const [stakePrice] = await getPrice(
      pool.MLP,
      pool.settleToken,
      1,
      [],
      pool.networkId
    )
    // 年奖励 = 奖励未发放的量 * 转成USDC的价值(price) * (1/奖励天数((span/86400)-(当前时间-开始时间)/86400)) * 365
    const now = parseInt(new Date().getTime() / 1000)
    const yearRate = new BigNumber(1)
      .div(
        new BigNumber(Number(pool.start_at) + Number(span) - now).div(
          new BigNumber(86400)
        )
      )
      .multipliedBy(dRewards)
      .multipliedBy(365)
      .multipliedBy(new BigNumber(pool.rewards_price))

    // 总质押价值
    const stakeTokenValue = fromWei(
      new BigNumber(pool.totalSupply)
        .multipliedBy(new BigNumber(stakePrice))
        .toString(),
      pool.mlpDecimal
    )
    const apr = yearRate.div(stakeTokenValue)
    return apr
  })
}

export const useFarmInfo = (address = '') => {
  const { account } = useActiveWeb3React()
  const blockHeight = useBlockHeight()
  const pool = Farm.find((o) => o.address === address)
  const now = parseInt(Date.now() / 1000)

  const [farmPoolsInfo, setFarmPoolsInfo] = useState(pool)
  const [reward2Radio, setReward2Radio] = useState(0)

  const hasApr = (pool.dueDate > now || !pool.dueDate) && !pool.isEnd

  useMemo(() => {
    if(hasApr && pool.poolType === 2 && pool.rewards2) {
      const contract = new ClientContract(MDexPool, MDEX_POOL_ADDRESS , pool.networkId)
      const pool_contract = new ClientContract(pool.abi, pool.address, pool.networkId)
      const promiseList = [contract.poolInfo(pool.mdexPid), pool_contract.totalSupply()]
      // // console.log('request___2')
      multicallClient(promiseList).then((data) => {
        const [poolInfo, totalSupply] = data
        const totalAmount = poolInfo[5]
        const radio = new BigNumber(totalSupply).div(new BigNumber(totalAmount)).toFixed(4)
        setReward2Radio(radio)
      })
    }
  }, [blockHeight])

  useMemo(() => {
    const pool_contract = new ClientContract(pool.abi, pool.address, pool.networkId)
    const currency_token = new ClientContract(ERC20, pool.MLP, pool.networkId)
    const promise_list = [
      pool_contract.begin(), // 开始时间
      pool_contract.totalSupply(), // 总抵押
    ]


    // 还没结束，算apr
    if (hasApr) {
      const calc_contract = new ClientContract(CalcAbi, CALC_ADDRESS(pool.networkId), pool.networkId)
      if (pool.poolType === 1) {
        if (pool.rewards_price) {
        } else {
          // 单池奖励1 apr
          promise_list.push(
            calc_contract.getApr(
              pool.address,
              [pool.MLP],
              [pool.rewards1Address],
              MINE_MOUNTAIN_ADDRESS(pool.networkId)
            )
          )
        }
      } else if (pool.poolType === 2) {
        // LP  奖励1 apr
        promise_list.push(
          calc_contract.getLPTApr(
            pool.address,
            sameAddress(pool.reserve0, pool.settleToken),
            sameAddress(pool.rewards1Address, pool.settleToken),
            MINE_MOUNTAIN_ADDRESS(pool.networkId)
          )
        )

        if(pool.rewards2 && reward2Radio > 0){
          promise_list.push(
            calc_contract.getSwapRewardLPTApr(
              pool.address,
              sameAddress(pool.reserve0, pool.settleToken),
              numToWei(pool.mdexDaily * reward2Radio, pool.reserve0Decimal),
              sameAddress(pool.rewards2Address, pool.settleToken)
            )
          )
        }
      }
    }
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
    multicallClient(promise_list).then(async (data) => {
      const begin = data[0],
        totalSupply = data[1]

      let APR = 0,
        APR2 = 0,
        earned = 0,
        balanceOf = 0,
        currency_allowance = 0,
        earned2 = 0

      if (hasApr && pool.poolType === 1) {
        if (pool.rewards_price) {
          APR = await getApr({
            ...pool,
            totalSupply,
          })
          earned = data[2]
          balanceOf = data[3]
          currency_allowance = data[4]
          earned2 = data[5]
        } else {
          APR = data[2]
          earned = data[3]
          balanceOf = data[4]
          currency_allowance = data[5]
          earned2 = data[6]
        }
      } else if (hasApr && pool.poolType === 2 && !pool.rewards_price) {
        // lpt
        APR = data[2]
        APR2 = data[3] || 0
        earned = data[4]
        balanceOf = data[5]
        currency_allowance = data[6]
        earned2 = data[7]
      } else if (account) {
        earned = data[2]
        balanceOf = data[3]
        currency_allowance = data[4]
        earned2 = data[5]
      }

      if (pool.networkId === ChainId.HECO) {
        // 处理mdx奖励减半问题
        const blockNumber = await multicallClient.getBlockInfo(ChainId.HECO).then(res => res.number)
        const mdexPoolContract = new ClientContract(MDexPool, '0xfb03e11d93632d97a8981158a632dd5986f5e909', pool.networkId)
         await multicallClient([
           mdexPoolContract.startBlock(),
           mdexPoolContract.halvingPeriod()
        ]).then(res => {
          const [startBlock, halvingPeriod] = res
          const n = Math.floor((blockNumber - startBlock) / halvingPeriod) - 3
           for (let i = 0; i < n; i++) {
             APR2 =  new BigNumber(APR2).div(2)
           }
         })
      }
      let APR_ = fromWei(
        new BigNumber(APR).plus(new BigNumber(APR2)).toString(),
        18
      ).toString()
      if (pool.earnName === 'APY') {
        APR_ = (1 + APR_ / 365) ** 365 - 1
      }
      // console.log(balanceOf, 'balanceOfbalanceOf')
      const format_APR = (APR_ * 100).toFixed(2)
      const newPool = Object.assign({}, pool, {
        start_at: begin,
        earned,
        earned2,
        totalSupply,
        balanceOf: fromWei(balanceOf, 18),
        allowance: currency_allowance,
        APR: hasApr && format_APR > 0 ? format_APR : '-',
      })
      setFarmPoolsInfo(newPool)
    })
  }, [account, address, reward2Radio, blockHeight])
  return farmPoolsInfo
}

// 获取价格-购买war弹窗
export const useAmountsOut = (path, amount, _chainId) => {
  const [outAmount, setOutAmount] = useState(0)
  const [fee, setFee] = useState(0)
  // const [outAmountTotal, setOutAmountTotal] = useState(0)


  useMemo(() => {
    if (amount > 0) {
      const routerConfig = MDEX_ROUTER_ADDRESS(_chainId)
      const mdex_router_contract = new ClientContract(
        routerConfig.abi,
        routerConfig.address,
        _chainId
      )
      multicallClient([mdex_router_contract.getAmountsOut(numToWei(amount, 18), path)]).then(data_ => {
        const data = data_[0]
        const outAmountTotal_ = fromWei(data[data.length - 1], 18).toFixed(6)*1
        // setOutAmountTotal(outAmountTotal_)
        // 1 - (1-0.003)^len
        const fee_ = new BigNumber(amount).multipliedBy(
          new BigNumber(1).minus((new BigNumber(1).minus(new BigNumber(0.003))).pow(path.length - 1))
        ).toFixed(6)*1
        console.log('outAmount, outFee, new', outAmountTotal_, fee_, path.length)
        setFee(fee_)
        setOutAmount(outAmountTotal_)
      })
    }
  }, [amount, path])
  if (!amount){
    return [0, 0]
  }
  return [outAmount, fee]
}

export const VoteSpanVal = () => {
  const { account, active, library } = useActiveWeb3React()
  const blockHeight = useBlockHeight()
  const [val, setVal] = useState('')
  useEffect(() => {
    const pool_contract = new ClientContract(voteMain.abi, voteMain.address, ChainId.HECO)
    multicallClient([pool_contract.voteSpan()]).then((res) => {
      setVal(res)
    })
    .catch((err) => {
      console.log('error', err)
    })
  }, [library, account, active, blockHeight])
  return val
}

export const VoteEndToClaimSpan = () => {
  const { account, active, library } = useActiveWeb3React()
  const blockHeight = useBlockHeight()
  const [claimSpanVal, setClaimSpanVal] = useState('')
  useEffect(() => {
    const pool_contract = new ClientContract(voteMain.abi, voteMain.address, ChainId.HECO)
    multicallClient([pool_contract.voteEndToClaimSpan()])
      .then((res) => {
        setClaimSpanVal(res)
      })
      .catch((err) => {
        console.log('error', err)
      })
  }, [account, active, blockHeight, library])
  return claimSpanVal
}

export const SuccessPercent = () => {
  const { account, active, library } = useActiveWeb3React()
  const blockHeight = useBlockHeight()
  const [successPercentVal, setSuccessPercentVal] = useState('')
  useEffect(() => {
    const pool_contract = new ClientContract(voteMain.abi, voteMain.address, ChainId.HECO)
    multicallClient([pool_contract.successPercent()])
      .then((res) => {
        let val = res[0]
        setSuccessPercentVal(val)
      })
      .catch((err) => {
        console.log('error', err)
      })
  }, [account, active, blockHeight, library])
  return successPercentVal
}

export const VotesData = (propId, voteMax) => {
   const { account, active, library } = useActiveWeb3React()
   const blockHeight = useBlockHeight()
  const [progressData, setProgressData] = useState('')
   useEffect(() => {
     const pool_contract = new ClientContract(voteMain.abi, voteMain.address, ChainId.HECO)
     multicallClient([pool_contract.getVotes(propId)])
       .then((res) => {
         let resData = res[0]
         setProgressData(
           new BigNumber(formatAmount(resData[1]))
             .div(new BigNumber(formatAmount(voteMax)).div(2))
             .toFixed(2, 1)
             .toString()
         )
       })
       .catch((err) => {
         console.log('error', err)
       })
   }, [account, active, blockHeight, library])
   return progressData
 }
