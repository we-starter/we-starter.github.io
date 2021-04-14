import React, { useState, useEffect } from 'react'
import { getContract, getLogs, useActiveWeb3React } from '../../web3'
import { WETH_ADDRESS } from '../../web3/address'
import StakingReward from '../../web3/abi/StakingReward.json'
import { abi as ERC20 } from '../../web3/abi/ERC20.json'
import Pools from '../../configs/pools'
import Web3 from 'web3'

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
                : 0, // 结算时间点
              pool_contract.methods.timeSettle
                ? pool_contract.methods.timeSettle().call()
                : 0, // 结算时间点 V2版本提供
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
                  ratio: `1${pool.currency.symbol} = ${
                    new BigNumber(Web3.utils.toWei('1', 'ether'))
                      .div(new BigNumber(price))
                      .toFixed(3, 1) * 1
                  }${pool.underlying.symbol}`,
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
                  ratio: `1${pool.currency.symbol} = ${
                    _ratio.toFixed(3, 1).toString() * 1
                  }${pool.underlying.symbol}`,
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
                    amount: 0,
                    volume: offeredOf,
                    claimedOf,
                    rate: Web3.utils.toWei('1', 'ether'),
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
