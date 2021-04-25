import React, { useState, useEffect } from 'react'
import { getContract, getLogs, useActiveWeb3React } from '../../web3'
import { abi as ERC20 } from '../../web3/abi/ERC20.json'
import PoolsLBP from '../../configs/poolsLBP'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

export const usePoolsLBPInfo = (address = '') => {
  const { account, active, library, chainId } = useActiveWeb3React()

  const now = parseInt(Date.now() / 1000)

  const poolsLBP = PoolsLBP.filter(
    (o) => address === '' || o.address === address
  )

  const [poolsInfo, setPoolsInfo] = useState(poolsLBP)

  const [blockNumber, setBlockNumber] = useState(0)

  // 数据预处理
  poolsLBP.map((item) => {
    let status = item.status
    if (status === 0) {
      status = now < item.start_at ? 0 : now < item.time ? 1 : 2
    }

    return Object.assign(item, {
      quotaOf: 0, //设置默认不在白名单
      status: status,
      timeClose: item.timeClose || '0',
      progress: status === 3 ? 1 : 0,
      totalPurchasedUnderlying:
        status === 3 ? Web3.utils.toWei(item.amount) : 0,
      currency: {
        is_ht: item.currency.address === '0x0',
        ...item.currency,
      },
    })
  })
  console.log('poolsLBP', poolsLBP)

  useEffect(() => {
    const updateBlockNumber = (blockNumber) => {
      console.log('block update')
      setBlockNumber(blockNumber)
    }
    if (library) {
      library.once('block', updateBlockNumber)

      Promise.all(
        poolsLBP.map((pool) => {
          // 如果还未开始，则不调用合约
          if (pool.is_coming) return pool

          const currency_token = pool.currency.is_ht
            ? null
            : getContract(library, ERC20, pool.currency.address)

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
              console.log('update pools', status)
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
        })
      ).then((poolsLBP) => {
        console.log(poolsLBP)
        setPoolsInfo(poolsLBP)
      })
    }

    return () => {
      library && library.off('block', updateBlockNumber)
    }
  }, [account, address, blockNumber])
  return poolsInfo
}
