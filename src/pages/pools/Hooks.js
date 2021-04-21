import React, { useState, useEffect } from 'react'
import { getContract, getLogs, useActiveWeb3React } from '../../web3'
import { WETH_ADDRESS } from '../../web3/address'
import StakingReward from '../../web3/abi/StakingReward.json'
import { abi as ERC20 } from '../../web3/abi/ERC20.json'
import Pools from '../../configs/pools'
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
import { formatAmount } from '../../utils/format'

export const useStakingInfo = (stakingInfo) => {
  const { account, library, chainId } = useActiveWeb3React()
  const [earned, setEarned] = useState()
  const [reward, setReward] = useState()
  const [staked, setStaked] = useState()
  const [earnedTotal, setEarnedTotal] = useState()
  const [balance, setBalance] = useState()

  console.log('address', stakingInfo)

  function queryStakingInfo() {
    const contract = getContract(
      library,
      StakingReward,
      stakingInfo.stakingAddress
    )

    try {
      contract.methods
        .earned(account)
        .call()
        .then((res) => {
          console.log('earned', res)
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
          console.log('getReward', res)
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
          console.log('staked', res)
          setStaked(res)
        })
    } catch (e) {
      console.log('staked error', e)
    }

    try {
      if (stakingInfo.address) {
        const tokenContract = getContract(
          library,
          StakingReward,
          stakingInfo.address
        )
        tokenContract.methods
          .balanceOf(account)
          .call()
          .then((res) => {
            console.log('balanceOf', res, stakingInfo.address)
            setBalance(res)
          })
      } else {
        const web3 = new Web3(library.provider)
        web3.eth.getBalance(account).then((res) => {
          console.log('eth balance', res)
          setBalance(res)
        })
      }
    } catch (e) {
      console.log('balanceOf error', e)
    }

    try {
      if (stakingInfo.address) {
        const tokenContract = getContract(
          library,
          StakingReward,
          stakingInfo.address
        )
        tokenContract.methods
          .balanceOf(stakingInfo.stakingAddress)
          .call()
          .then((res) => {
            console.log('earned total', res)
            setEarnedTotal(res)
          })
      } else {
        const tokenContract = getContract(
          library,
          StakingReward,
          WETH_ADDRESS(chainId)
        )
        tokenContract.methods
          .balanceOf(stakingInfo.stakingAddress)
          .call()
          .then((res) => {
            console.log('earned total', res)
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

  const { chainId } = useActiveWeb3React()

  useEffect(() => {
    console.log('chain id ---->', chainId)
    switch (chainId) {
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
    }
  }, [chainId])

  return stakingInfos
}

export const usePoolsInfo = (address = '') => {
  const { account, active, library, chainId } = useActiveWeb3React()

  const now = parseInt(Date.now() / 1000)

  const pools = Pools.filter((o) => address === '' || o.address === address)

  const [poolsInfo, setPoolsInfo] = useState(pools)

  const [blockNumber, setBlockNumber] = useState(0)

  console.log(pools)
  // 数据预处理
  pools.map((item) => {
    let status = item.status
    if (status === 0) {
      status = now < item.start_at ? 0 : now < item.time ? 1 : 2
    }

    Object.assign(item, {
      quotaOf: 0, //设置默认不在白名单
      status: status,
      // timeClose: '1619095500',
      timeClose: '1619017200',
      progress: status === 3 ? 1 : 0,
      totalPurchasedUnderlying:
        status === 3 ? Web3.utils.toWei(item.amount) : 0,
      currency: {
        is_ht: item.currency.address === '0x0',
        ...item.currency,
      },
    })
  })

  useEffect(() => {
    const updateBlockNumber = (blockNumber) => {
      console.log('block update')
      setBlockNumber(blockNumber)
    }
    if (library) {
      library.once('block', updateBlockNumber)

      Promise.all(
        pools.map((pool) => {
          // 如果还未开始，则不调用合约
          if (pool.is_coming) return pool

          const currency_token = pool.currency.is_ht
            ? null
            : getContract(library, ERC20, pool.currency.address)

          // const underlying_token = getContract(
          //     library,
          //     ERC20,
          //     pool.underlying.address,
          // )

          if (pool.type !== 1) {
            const pool_contract = getContract(library, pool.abi, pool.address)
            const promise_list = [
              pool_contract.methods.time
                ? pool_contract.methods.time().call()
                : 0, // 募资结束时间点
              pool_contract.methods.timeSettle
                ? pool_contract.methods.timeSettle().call()
                : 0, // 结算开始时间点 V2版本提供
              pool_contract.methods.price().call(), // 结算时间点
              pool_contract.methods.totalPurchasedCurrency().call(), //总申购的量
              pool_contract.methods.purchasedCurrencyOf(account).call(),
              pool_contract.methods.totalSettleable().call(),
              pool_contract.methods.settleable(account).call(),
              // getLogs(library, Starter, {fromBlock: 0, toBlock: 'latest', address: pool.address, topics: [null, Web3.utils.padLeft(account, 64)]}),
              getLogs(library, pool.abi, {
                address: pool.address,
                topics: [null, Web3.utils.padLeft(account, 64)],
              }),
              currency_token
                ? currency_token.methods.allowance(account, pool.address).call()
                : 0,
              pool_contract.methods.totalSettledUnderlying().call(),
              // underlying_token.methods.balanceOf(pool.address).call(),
            ]
            return Promise.all(promise_list).then(
              ([
                time,
                timeSettle,
                price,
                totalPurchasedCurrency,
                purchasedCurrencyOf,
                totalSettleable,
                settleable,
                logs,
                currency_allowance,
                totalSettledUnderlying,
              ]) => {
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
                console.log('update pools')
                return Object.assign({}, pool, {
                  ratio: `1${pool.underlying.symbol}=${Web3.utils.fromWei(
                    price,
                    'ether'
                  )}${pool.currency.symbol}`,
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
                  totalSettleable,
                  totalSettledUnderlying,
                  settleable,
                  logs,
                })
              }
            )
          } else {
            // TODO 默认HT，后面需要根据通货来查询进度
            let currency_decimals = pool.currency.decimal

            const underlying_token = getContract(
              library,
              ERC20,
              pool.underlying.address
            )

            // 白名单是offering合约
            const pool_contract = getContract(library, pool.abi, pool.address)
            const promise_list = [
              pool_contract.methods.timeOffer().call(), // 结算时间点
              pool_contract.methods.timeClaim().call(), // 结算时间点
              pool_contract.methods.ratio().call(), // 比例
              pool_contract.methods.totalQuota().call(), //总申购的量
              pool_contract.methods.totalOffered().call(), //总申购的量
              pool_contract.methods.totalClaimed().call(), //总领取的量
              pool_contract.methods.quotaOf(account).call(), // 最大申购额度
              pool_contract.methods.offeredOf(account).call(), // 已经认购的量
              pool_contract.methods.claimedOf(account).call(), // 已经领取的量
              underlying_token.methods.decimals().call(),
            ]
            return Promise.all(promise_list).then(
              ([
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
              ]) => {
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

                const _ratio = new BigNumber(ratio).dividedBy(
                  new BigNumber(10).pow(
                    parseInt(underlying_decimals) -
                      parseInt(currency_decimals) +
                      18
                  )
                )
                const __ratio = new BigNumber(1).dividedBy(
                  new BigNumber(ratio).dividedBy(
                    new BigNumber(10).pow(
                      parseInt(underlying_decimals) -
                        parseInt(currency_decimals) +
                        18
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
                Object.assign(pool.currency, {
                  allowance: 0,
                })

                console.log('update pools')
                return Object.assign({}, pool, {
                  ratio: `1${pool.underlying.symbol}=${
                    __ratio.toFixed(3, 1).toString() * 1
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
              }
            )
          }
        })
      ).then((pools) => {
        console.log(pools)
        setPoolsInfo(pools)
      })
    }

    return () => {
      library && library.off('block', updateBlockNumber)
    }
  }, [account, address, blockNumber])
  return poolsInfo
}
