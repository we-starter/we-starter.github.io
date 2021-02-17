import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import PoolsHeader from '../../components/staterPools/poolsHeader'
import chromeLine from '../../assets/icon/chrome-line@2x.png'
import bookMarkLine from '../../assets/icon/book-mark-line@2x.png'
import Web3 from 'web3'
import transitions from '@material-ui/core/styles/transitions'
import pools from '../../configs/pools'
import { usePoolsInfo } from './Hooks'
import { getContract, useActiveWeb3React } from '../../web3'
import {
  HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_TRANSACTION_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  waitingForInit,
  waitingPending,
} from '../../const'
import { mainContext } from '../../reducer'
import Starter from '../../web3/abi/Starter.json'
import BigNumber from "bignumber.js";

export const PoolsDetail = (props) => {
  const { address } = props.match.params

  const { account, active, library, chainId } = useActiveWeb3React()
  const pools = usePoolsInfo(address)

  const [detailTab, setDetailTab] = useState('detail')
  const [recordTab, setRecordTab] = useState(1)
  const [pool, setPool] = useState(null)

  const { dispatch } = useContext(mainContext)

  useEffect(() => {
    setPool(pools.pop())
    console.log(pool)
  }, [pools, address])

  const onClaim = () => {
    getContract(library, Starter, address)
      .methods.settle()
      .send({
        from: account,
      })
      .on('transactionHash', (hash) => {
        dispatch({
          type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
          showWaitingWalletConfirmModal: { ...waitingPending, hash },
        })
      })
      .on('receipt', (_, receipt) => {
        console.log('BOT staking success')
        dispatch({
          type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
          showWaitingWalletConfirmModal: waitingForInit,
        })
        dispatch({
          type: HANDLE_SHOW_TRANSACTION_MODAL,
          showTransactionModal: true,
        })
      })
      .on('error', (err, receipt) => {
        console.log('BOT staking error', err)
        dispatch({
          type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
          showFailedTransactionModal: true,
        })
        dispatch({
          type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
          showWaitingWalletConfirmModal: waitingForInit,
        })
      })
  }
  return (
    <div style={{ background: '#fff' }}>
      <PoolsHeader address={address} pool={pool} />
      <div className='pools_detail_record'>
        <div className='pools_detail_record_tab'>
          <a
            onClick={() => setRecordTab(1)}
            className={cs(recordTab === 1 && 'active')}
          >
            募资记录
          </a>
          {
            pool && pool.status >= 2 && (
                <a
                    onClick={() => setRecordTab(2)}
                    className={cs(recordTab === 2 && 'active')}
                >
                  Claim
                </a>
            )
          }

        </div>
        {recordTab === 1 && (
          <div className='pools_detail_record_box'>
            <table className='pools_detail_record_title'>
              <thead>
                <tr>
                  <td>投入{pool && pool.currency.symbol}数量</td>
                  <td>预计中签率</td>
                  <td>预计中签量</td>
                </tr>
              </thead>
              <tbody>
              {
                (pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                    <tr>
                      <td>{Web3.utils.fromWei(pool.purchasedCurrencyOf, 'ether')}</td>
                      <td>{(Web3.utils.fromWei(pool.settleable.rate, 'ether') * 100).toFixed(2) * 1}%</td>
                      {/*<td>{Web3.utils.fromWei(pool.settleable.volume, 'ether')}</td>*/}
                      <td>{new BigNumber(Web3.utils.fromWei(pool.purchasedCurrencyOf, 'ether')).multipliedBy(new BigNumber(Web3.utils.fromWei(pool.settleable.rate, 'ether'))).dividedBy(new BigNumber(pool.price)).toString()}</td>
                    </tr>
                ) :
                    (
                        <tr>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                    )
              }
              </tbody>
            </table>
          </div>
        )}
        {recordTab === 2 && (
          <div className='pools_detail_record_box'>
            <table className='pools_detail_record_title'>
              <thead>
                <tr>
                  <td>未结算{pool && pool.currency.symbol}</td>
                  <td>获取{pool && pool.underlying.symbol}数量</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
              {
                (pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                    <tr>
                      <td>{pool && Web3.utils.fromWei(pool.settleable.amount, 'ether')}</td>
                      <td>{pool && Web3.utils.fromWei(pool.settleable.volume, 'ether')}</td>
                      <td>
                        {
                          pool && pool.settleable.volume > 0 && (
                              <a className='pools_detail_record_btn' onClick={() => onClaim()}>Claim</a>
                          )
                        }
                      </td>
                    </tr>
                ) : (
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td></td>
                    </tr>
                )
              }

              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className='pools_card'>
        <div className='pools_card_content'>
          <div className='pools_card_content_title'>
            <span>Swap Amount</span>
            <span>{pool && pool.ratio}</span>
          </div>
          <div className='pools_card_val'>
            {pool && pool.amount} {pool && pool.underlying.symbol}
          </div>
          <div className='pools_card_start'>
            {pool && renderStatus(pool.status)}
          </div>
          <div className='pools_card_content_title'>
            <span>Swap Progress</span>
          </div>
          <div className='pools_card_progress__bar'>
            <span
              style={{ left: pool ? `${pool.progress > 1 ? 100 : pool.progress * 100}%` : '0%' }}
            ></span>
            <p>
              <a style={{ width: pool ? `${pool.progress > 1 ? 100 : pool.progress * 100}%` : '0%' }}></a>
            </p>
          </div>
          <div className='pools_card_content_title pools_card_schedule'>
            <span>{pool && pool.progress * 100}%</span>
            <span>
              {pool && Web3.utils.fromWei(pool.totalPurchasedCurrency, 'ether')}
              /{pool && Web3.utils.fromWei(pool.totalPurchasedAmount, 'ether')}
            </span>
          </div>
        </div>
      </div>
      <div className='pools_detail'>
        <div className='pools_detail_content'>
          <div className='pools_detail_content_tab'>
            <a
              onClick={() => setDetailTab('detail')}
              className={cs(detailTab === 'detail' && 'active')}
            >
              Pool Details
            </a>
            <a
              onClick={() => setDetailTab('project')}
              className={cs(detailTab === 'project' && 'active')}
            >
              About the Project
            </a>
          </div>
          {detailTab === 'detail' && (
            <div className='pools_detail_table_box'>
              <table className='pools_detail_table pools-detail_table__left'>
                <thead>
                  <tr>
                    <th>Pool Information</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>
                        <span>Token Distribution</span>
                        <span>{pool && pool.pool_info.token_distribution}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Min. Allocation</span>
                        <span>{pool && pool.pool_info.min_allocation}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Max. Allocation</span>
                        <span>{pool && pool.pool_info.max_allocation}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Min Swap Level</span>
                        <span>{pool && pool.pool_info.min_swap_level}</span>
                      </p>
                    </td>
                  </tr>
                  {/*<tr>*/}
                  {/*  <td>*/}
                  {/*    <p>*/}
                  {/*      <span>Access Type</span>*/}
                  {/*      <span>Private</span>*/}
                  {/*    </p>*/}
                  {/*  </td>*/}
                  {/*</tr>*/}
                </tbody>
              </table>
              <table className='pools_detail_table pools-detail_table__right'>
                <thead>
                  <tr>
                    <th>Token Information</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>
                        <span>Name</span>
                        <span>{pool && pool.underlying.name}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Address</span>
                        <span>{pool && pool.underlying.address}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Total Supply</span>
                        <span>{pool && pool.underlying.total_supply}</span>
                      </p>
                    </td>
                  </tr>
                  {/*需要提供api获取*/}
                  {/*<tr>*/}
                  {/*  <td>*/}
                  {/*    <p>*/}
                  {/*      <span>Holders</span>*/}
                  {/*      <span>3,433</span>*/}
                  {/*    </p>*/}
                  {/*  </td>*/}
                  {/*</tr>*/}
                  {/*<tr>*/}
                  {/*  <td>*/}
                  {/*    <p>*/}
                  {/*      <span>Transfers</span>*/}
                  {/*      <span>10,041</span>*/}
                  {/*    </p>*/}
                  {/*  </td>*/}
                  {/*</tr>*/}
                </tbody>
              </table>
            </div>
          )}
          {detailTab === 'project' && (
            <div className='pools_detail_content_link'>
              <a>
                <img src={chromeLine} />
                {pool && pool.website}
              </a>
              <a>
                <img src={bookMarkLine} />
                {pool && pool.white_paper}
              </a>
              <a>
                <svg width='24' height='24' viewBox='0 0 30 30'>
                  <path d='M27.7 7.07c-.95.42-1.96.7-3 .82A5.25 5.25 0 0027 5a10.45 10.45 0 01-3.32 1.27 5.23 5.23 0 00-8.9 4.77A14.84 14.84 0 014 5.57a5.21 5.21 0 001.61 6.98 5.21 5.21 0 01-2.36-.65v.06a5.23 5.23 0 004.2 5.13c-.78.21-1.59.24-2.37.1a5.23 5.23 0 004.88 3.62 10.49 10.49 0 01-7.74 2.17 14.79 14.79 0 008.02 2.35c9.61 0 14.87-7.97 14.87-14.88 0-.22 0-.45-.02-.67 1.03-.74 1.91-1.66 2.61-2.7v-.01z' />
                </svg>
                {pool && pool.twitter}
              </a>
              <a>
                Westarter是一个连接加密货币创新者和投资者的对接平台，
                任何创新者都可以无需许可的使用标准化的界面来发起和管理流动性的拍卖。
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderStatus = (status) => {
  switch (status) {
    case 0:
      return '即将上线...'
    case 1:
      return '募集中'
    case 2:
      return '结算中'
    case 3:
      return '已完成'
  }
}
