import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import chromeLine from '../../assets/icon/chrome-line@2x.png'
import bookMarkLine from '../../assets/icon/book-mark-line@2x.png'
import PoolsBanner from '../../components/banner/PoolsBanner'
import Web3 from 'web3'
import Timer from 'react-compound-timer'
import { GALLERY_SELECT_WEB3_CONTEXT, HANDLE_WALLET_MODAL } from '../../const'
import transitions from '@material-ui/core/styles/transitions'
import { SCAN_ADDRESS } from '../../web3/address'
// import pools from '../../configs/pools'
import { usePoolsInfo } from './Hooks'
import { message } from 'antd'
import { getContract, useActiveWeb3React } from '../../web3'
import {
  HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_TRANSACTION_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  waitingForInit,
  waitingPending,
} from '../../const'
import { mainContext } from '../../reducer'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatAmount, fromWei } from '../../utils/format'
import { getScanLink } from "../../connectors";
import { ChainId, GAS_FEE } from "../../web3/address";
import BadgeStake from "../../components/Modals/BadgeStake";
import DefaultBanner from '../../assets/image/default-pool.png'
import { Link } from 'react-router-dom'
const PoolsDetail = (props) => {
  const { address } = props.match.params

  const { intl } = props

  const { account, active, library, chainId } = useActiveWeb3React()
  const pools = usePoolsInfo(address)

  const [detailTab, setDetailTab] = useState('detail')
  const [recordTab, setRecordTab] = useState(1)
  const [pool, setPool] = useState(pools[0])
  const [now, setNow] = useState(parseInt(Date.now() / 1000))
  const [left_time, setLeftTime] = useState(0)

  const { dispatch } = useContext(mainContext)
  const [showBadgeStake, setShowBadgeStake] = useState(false)
  //  if (!pool || chainId !== pool.networkId) {
  //    window.location.href = '/'
  //  }
  useEffect(() => {
    const timerId = setTimeout(() => {
      const now = parseInt(Date.now() / 1000)
      setNow(now)
    }, 1000)
    return () => {
      clearTimeout(timerId)
    }
  }, [now])

  useEffect(() => {
    setPool(pools[0])
    if (pools[0]) {
      const { status, start_at, time, timeClose, type } = pools[0]
      if (status === 0) {
        setLeftTime(start_at * 1000 - Date.now())
      } else if (status === 1) {
        if (type === 0) {
          if (now >= timeClose) {
            // 等待中
            setLeftTime((time - now) * 1000)
          } else {
            // 募资中
            setLeftTime((timeClose - now) * 1000)
          }
        } else {
          setLeftTime((time - now) * 1000)
        }
      }
    }
  }, [pools, address])

  const onClaim = () => {
    const contract = getContract(library, pool.abi, address)
    if (pool.type === 1) {
      contract.methods
        .claim()
        .send({
          from: account,
          ...GAS_FEE(chainId)
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
    } else {
      contract.methods
        .settle()
        .send({
          from: account,
          ...GAS_FEE(chainId)
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
  }
  console.log(pool)
  return (
    <div className='pools_detail_box'>
      {/* <PoolsBanner address={address} pool={pool} /> */}
      <div className='pool_back'>
        <svg width="24px" height="24px" viewBox="0 0 24 24">
          <g id="westar" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="enterpool" transform="translate(-370.000000, -110.000000)">
              <g transform="translate(370.000000, 110.000000)">
                <g transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) translate(8.000000, 5.000000)" fill="#03A678" fill-rule="nonzero">
                  <polygon points="7.7131 7 1.70209 0.99001 0.28809 2.40401 4.8881 7.004 0.28809 11.597 1.70209 13.011"></polygon>
                </g>
                <rect x="0" y="0" width="24" height="24"></rect>
              </g>
            </g>
          </g>
        </svg>
        <Link to='/pools/'>Pool</Link>
      </div>
      <div className='pool_info'>
        <img src={pool && pool.icon} />
        <div>
          <div>{pool && pool.name}  {pool && pool.isPrivate ? 'Private' : 'Public'}
            <span>
              {pool && pool.status === 0 && (
                <FormattedMessage id='comingSoon1' />
                + '...'
              )}
              {pool &&
                pool.status === 1 &&
                (pool.timeClose == 0 || pool.timeClose > now) && (
                  <FormattedMessage id='recruit' />
                )}
              {pool &&
                pool.status === 1 &&
                pool.timeClose > 0 &&
                pool.timeClose < now && (
                  <FormattedMessage id='recruitOver' />
                )}
              {pool && pool.status === 2 && (
                <FormattedMessage id='settlement' />
              )}
              {pool && pool.status === 3 && (
                <FormattedMessage id='completed' />
              )}</span>
          </div>
          <p>
            {pool && pool.address}
            <a href={`${SCAN_ADDRESS[pool.networkId]}/address/${pool.address}`} target='_blank'>
              <svg width="24px" height="24px" viewBox="0 0 24 24" >
                <g id="westar" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-1086.000000, -249.000000)">
                    <g transform="translate(462.000000, 243.000000)">
                      <g transform="translate(624.000000, 6.000000)">
                        <polygon points="0 0 24 0 24 24 0 24"></polygon>
                        <path d="M10,3 L10,5 L5,5 L5,19 L19,19 L19,14 L21,14 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 Z M17.586,5 L13,5 L13,3 L21,3 L21,11 L19,11 L19,6.414 L12,13.414 L10.586,12 L17.586,5 Z" id="形状" fill="#00C57B" fill-rule="nonzero"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </a>
          </p>
        </div></div>
      <div className='pools_card'>
        <div className='pools_card_banner'>
          <img src={DefaultBanner} />
        </div>
        <div className='pools_card_content'>
          <div className='pools_card_content_title'>
            <span>
              <FormattedMessage id='poolsDetailText1' />
            </span>
            <span>{pool && (pool.nft ? pool.nftRatio ? (pool.amount / pool.nftRatio) : '-' : pool.amount)} {pool && pool.underlying.symbol}</span>
          </div>
          <div className='pools_card_text'>
            <span>
              <FormattedMessage id='poolsIndexText1' />{' '}
            </span>
            <span>
              {pool && pool.ratio}
            </span>
          </div>
          {pool && pool.type === 1 && (
            <div className='pools_card_text'>
              <span>
                <FormattedMessage id='myQuota' />{' '}
              </span>
              <span>
                {pool && formatAmount(pool.quotaOf)}{' '}
                {pool && pool.currency.symbol}
              </span>
            </div>
          )}

          {pool && pool.status === 0 && (
            <div className='pools_card_start'>
              <FormattedMessage id='comingSoon1' />
              ...
            </div>
          )}
          {pool &&
            pool.status === 1 &&
            (pool.timeClose == 0 || pool.timeClose > now) && (
              <div className='pools_card_start'>
                <FormattedMessage id='recruit' />
              </div>
            )}
          {pool &&
            pool.status === 1 &&
            pool.timeClose > 0 &&
            pool.timeClose < now && (
              <div className='pools_card_start'>
                <FormattedMessage id='recruitOver' />
              </div>
            )}
          {pool && pool.status === 2 && (
            <div className='pools_card_start'>
              <FormattedMessage id='settlement' />
            </div>
          )}
          {pool && pool.status === 3 && (
            <div className='pools_card_start'>
              <FormattedMessage id='completed' />
            </div>
          )}
          <div className='pools_card_progress_title'>
            <span>
              <FormattedMessage id='poolsDetailText2' />
            </span>
          </div>
          <div className='pools_card_progress_bar'>
            <div>
              <p>
                <span>Progress</span>
                <span>{pool && (pool.progress * 100).toFixed(2) * 1}%</span>
              </p>
              {pool && (pool.nft ? (
                <span>
                  {pool.nftRatio && (`${formatAmount(pool.totalPurchasedUnderlying, 0, 2)} / ${pool.amount / pool.nftRatio}`)} {pool.underlying.symbol}
                </span>
              ) : (
                <span>
                  {pool && pool.progress == 1
                    ? Math.round(formatAmount(pool.totalPurchasedUnderlying, 0, 2))
                    : formatAmount(pool.totalPurchasedUnderlying, 0, 2)}
                  /{pool && pool.amount}
                </span>
              )
              )}
            </div>
            <p>
              <a
                style={{
                  width: pool
                    ? `${pool.progress > 1 ? 100 : pool.progress * 100}%`
                    : '0%',
                }}
              ></a>
            </p>
          </div>
          <div className='pools_detail_btn_box'>
            {/* pool.timeClose * 1 > now  timeClose 是超募的claim余额的结束时间 */}
            <a
              className={`pools_detail_btn ${pool ? 'pools_detail_btn_' + pool.networkId : ''
                } ${pool &&
                  pool.status === 1 &&
                  (pool.timeClose - 0 === 0 || pool.timeClose * 1 > now)
                  ? 'pools_detail_btn_active ' +
                  ('pools_detail_btn_active_' + pool.networkId)
                  : 'pools_detail_btn_disable'
                }`}
              onClick={() => {
                if (pool.status === 1) {
                  if (pool.userFull) {
                    message.info(intl.formatMessage({ id: 'ParticipantsAreFull' }))
                  } else if (pool.type === 1 && pool.purchasedCurrencyOf > 0) {
                    // 如果是 已经申购过的
                    // message.info('已申购过')
                    message.info(intl.formatMessage({ id: 'alreadySubscribed' }))
                  } else if (pool.type === 1 && pool.quotaOf == 0) {
                    //不在白名单里面
                    message.info(intl.formatMessage({ id: 'notInWhitelist' }))
                  } else {
                    if (pool.timeClose > 0 && pool.timeClose * 1 < now) {
                      message.info(intl.formatMessage({ id: 'undergoingOver' }))
                    } else {
                      if (pool.nft) {
                        if (pool.nftBalanceOf > 0) {
                          setShowBadgeStake(true)
                        } else {
                          message.info(intl.formatMessage({ id: 'notInWhitelist' }))
                        }
                      } else {
                        dispatch({
                          type: HANDLE_WALLET_MODAL,
                          walletModal: 'join',
                          pool,
                        })
                      }
                    }
                  }
                } else {
                  message.info(intl.formatMessage({ id: 'cannotSubscribe' }))
                }
              }}
            >
              <FormattedMessage id='poolsDetailText3' />
            </a>
            <a
              className={cs(
                `pools_detail_btn ${pool ? 'pools_detail_btn_' + pool.networkId : ''
                }`
              )}
              href={getScanLink(chainId, address, 'address')}
              target='_blank'
            >
              <FormattedMessage id={pool.networkId === ChainId.BSC ? 'poolsDetailText400' : pool.networkId === ChainId.AVALANCHE ? 'poolsDetailText4000' : 'poolsDetailText4'} />
            </a>
          </div>
        </div>
      </div>
      {pool && pool.underlying.symbol === 'HCT' && (
        <div className='pools_detail_tips_box'>
          <p className='pools_detail_tips'>
            <FormattedMessage id='poolsDetailText22' />
          </p>
        </div>
      )}
      <div className='pools_detail_record'>
        {pool &&
          pool.type === 1 &&
          pool.quotaOf == 0 &&
          left_time > 0 &&
          pool.status == 0 && (
            <div className='mask_layer'>
              <p style={{ lineHeight: '30px', marginBottom: '0' }}>
                <FormattedMessage id='countdown' />
                &nbsp;
                <span className='pools-type_time'>
                  <Timer
                    key={left_time}
                    initialTime={left_time}
                    direction='backward'
                    formatValue={(number) => {
                      if (number === 0) return '00'
                      if (number < 10) {
                        return `0${number}`
                      }
                      return number
                    }}
                  >
                    <span>
                      <Timer.Consumer>
                        {({ h, d, formatValue }) => formatValue(d * 24 + h)}
                      </Timer.Consumer>
                    </span>
                    &nbsp;:&nbsp;
                    <span>
                      <Timer.Minutes />
                    </span>
                    &nbsp;:&nbsp;
                    <span>
                      <Timer.Seconds />
                    </span>
                  </Timer>
                </span>
              </p>
            </div>
          )}
        {pool && pool.type === 1 && pool.quotaOf == 0 && pool.status > 0 && (
          <div className='mask_layer'>
            <p style={{ lineHeight: '30px', marginBottom: '0' }}>
              <FormattedMessage id='cannotProject' />
            </p>
          </div>
        )}
        <div className='pools_detail_record_wrap'>
          {pool &&
            pool.type === 1 &&
            pool.quotaOf == 0 &&
            left_time > 0 &&
            pool.status == 0 && (
              <div className='mask_layer'>
                <p style={{ lineHeight: '30px', marginBottom: '0' }}>
                  <FormattedMessage id='countdown' />
                  &nbsp;
                  <span className='pools-type_time'>
                    <Timer
                      key={left_time}
                      initialTime={left_time}
                      direction='backward'
                      formatValue={(number) => {
                        if (number === 0) return '00'
                        if (number < 10) {
                          return `0${number}`
                        }
                        return number
                      }}
                    >
                      <span>
                        <Timer.Consumer>
                          {({ h, d, formatValue }) => formatValue(d * 24 + h)}
                        </Timer.Consumer>
                      </span>
                      &nbsp;:&nbsp;
                      <span>
                        <Timer.Minutes />
                      </span>
                      &nbsp;:&nbsp;
                      <span>
                        <Timer.Seconds />
                      </span>
                    </Timer>
                  </span>
                </p>
              </div>
            )}
          {/* {pool && pool.type === 1 && pool.quotaOf == 0 && pool.status > 0 && (
          <div className='mask_layer'>
            <p style={{ lineHeight: '30px', marginBottom: '0' }}>
              <FormattedMessage id='cannotProject' />
            </p>
          </div>
        )} */}
          <div className='pools_detail_record_tab'>
            <a
              onClick={() => setRecordTab(1)}
              className={cs(recordTab === 1 && 'active')}
            >
              <FormattedMessage id='FundraisingRecord' />
            </a>
            {pool && pool.status >= 1 && (
              <a
                onClick={() => setRecordTab(2)}
                className={cs(recordTab === 2 && 'active')}
              >
                <FormattedMessage id='poolsDetailText5' />
              </a>
            )}
          </div>
          {recordTab === 1 && (
            <div className='pools_detail_record_box'>
              <table className='pools_detail_record_title'>
                <thead>
                  <tr>
                    <td>
                      <FormattedMessage id='invest' />
                      <FormattedMessage id='num' />
                    </td>
                    <td>
                      <FormattedMessage id='winningRate' />
                    </td>
                    <td>
                      <FormattedMessage id='winningAmount' />
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {(pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                    <tr>
                      <td>
                        {fromWei(pool.purchasedCurrencyOf, pool.currency.decimal).toFixed(6, 1) * 1}
                        &nbsp;
                        {pool && pool.currency.symbol}
                      </td>
                      <td>
                        {pool && pool.type === 1 && pool.quotaOf > 0 && (
                          <FormattedMessage id='whiteList' />
                        )}
                        {pool &&
                          pool.type === 0 &&
                          fromWei(pool.settleable.rate)
                            .multipliedBy(new BigNumber(100))
                            .toFixed(2, 1)
                            .toString() *
                          1 +
                          '%'}
                      </td>
                      {/*<td>{Web3.utils.fromWei(pool.settleable.volume, 'ether')}</td>*/}
                      <td>
                        {pool &&
                          pool.type === 0 &&
                          new BigNumber(
                            fromWei(pool.purchasedCurrencyOf, pool.currency.decimal)
                          )
                            .multipliedBy(
                              new BigNumber(
                                Web3.utils.fromWei(pool.settleable.rate, 'ether')
                              )
                            )
                            .dividedBy(new BigNumber(pool.price))
                            .toFixed(6, 1)
                            .toString() * 1}
                        {pool &&
                          pool.type === 1 &&
                          formatAmount(pool.settleable.volume, pool.underlying.decimal)}
                        &nbsp;
                        {pool && pool.underlying.symbol}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {recordTab === 2 && (
            <div className='pools_detail_record_box'>
              <table className='pools_detail_record_title'>
                <thead>
                  <tr>
                    <td>
                      <FormattedMessage id='unsettlement' />
                    </td>
                    <td>
                      <FormattedMessage id='obtain' />
                      <FormattedMessage id='num' />
                    </td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {(pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                    <tr>
                      <td>
                        {pool && formatAmount(pool.settleable.amount, pool.currency.decimal)}&nbsp;
                        {pool && pool.currency.symbol}
                        {/* 当 当前时间大于募资结束时间 && 小于结算开始时间则可以领回 */}
                        {pool &&
                          pool.settleable.amount > 0 &&
                          pool.status == 1 &&
                          now >= pool.timeClose // &&
                          // !((pool.lock && pool.settleable.unlockVolume > 0 || !pool.lock && pool.settleable.volume > 0) && now > pool.timeClose && now >= pool.time)
                          &&
                          (
                            <a
                              style={{ marginLeft: '4px' }}
                              className={cs(
                                `pools_detail_record_btn ${pool
                                  ? 'pools_detail_record_btn_' + pool.networkId
                                  : ''
                                }`
                              )}
                              onClick={() => onClaim()}
                            >
                              <FormattedMessage id='poolsDetailText5' />
                            </a>
                          )}
                      </td>
                      <td>
                        {pool && pool.settleable.unlockVolume}&nbsp;
                        {pool && pool.underlying.symbol}
                      </td>
                      <td>
                        {/*  && !pool.settleable.completed_ */}
                        {pool &&
                          pool.type === 0 &&
                          pool.status >= 2 && (pool.settleable.unlockVolume > 0) &&
                          now > pool.timeClose &&
                          now >= pool.time && (
                            <a
                              className={cs(
                                `pools_detail_record_btn ${pool
                                  ? 'pools_detail_record_btn_' + pool.networkId
                                  : ''
                                }`
                              )}
                              onClick={() => onClaim()}
                            >
                              <FormattedMessage id='poolsDetailText5' />
                            </a>
                          )}
                        {pool &&
                          pool.type === 1 &&
                          (pool.settleable.unlockVolume > 0) &&
                          pool.status >= 2 &&
                          now > pool.timeClose &&
                          now >= pool.time && (
                            <a
                              className={cs(
                                `pools_detail_record_btn ${pool
                                  ? 'pools_detail_record_btn_' + pool.networkId
                                  : ''
                                }`
                              )}
                              onClick={() => onClaim()}
                            >
                              <FormattedMessage id='poolsDetailText5' />
                            </a>
                          )}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {recordTab === 1 && (
            <div className='pools_detail_record_title_h5'>
              <p className='pools_detail_record_title_val'>
                <FormattedMessage id='invest' />
                <FormattedMessage id='num' />
              </p>
              {(pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                <p className='pools_detail_record_title_data'>
                  {fromWei(pool.purchasedCurrencyOf, pool.currency.decimal).toFixed(6, 1) * 1}
                  &nbsp;
                  {pool && pool.currency.symbol}
                </p>
              ) : (
                <p className='pools_detail_record_title_data'>-</p>
              )}

              <p className='pools_detail_record_title_val'>
                <FormattedMessage id='winningRate' />
              </p>
              {(pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                <p className='pools_detail_record_title_data'>
                  {pool && pool.type === 1 && pool.quotaOf > 0 && (
                    <FormattedMessage id='whiteList' />
                  )}
                  {pool &&
                    pool.type === 0 &&
                    fromWei(pool.settleable.rate)
                      .multipliedBy(new BigNumber(100))
                      .toFixed(2, 1)
                      .toString() *
                    1 +
                    '%'}
                </p>
              ) : (
                <p className='pools_detail_record_title_data'>-</p>
              )}
              <p className='pools_detail_record_title_val'>
                <FormattedMessage id='winningAmount' />
              </p>
              {(pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                <p className='pools_detail_record_title_data'>
                  {pool &&
                    pool.type === 0 &&
                    new BigNumber(
                      fromWei(pool.purchasedCurrencyOf, pool.currency.decimal)
                    )
                      .multipliedBy(
                        new BigNumber(
                          Web3.utils.fromWei(pool.settleable.rate, 'ether')
                        )
                      )
                      .dividedBy(new BigNumber(pool.price))
                      .toFixed(6, 1)
                      .toString() * 1}
                  {pool &&
                    pool.type === 1 &&
                    formatAmount(pool.settleable.volume, pool.underlying.decimal)}
                  &nbsp;
                  {pool && pool.underlying.symbol}
                </p>
              ) : (
                <p className='pools_detail_record_title_data'>-</p>
              )}
            </div>
          )}
          {recordTab === 2 && (
            <div className='pools_detail_record_title_h5'>
              <p className='pools_detail_record_title_val'>
                <FormattedMessage id='unsettlement' />
              </p>
              {(pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                <p className='pools_detail_record_title_data'>
                  {pool && formatAmount(pool.settleable.amount, pool.currency.decimal)}&nbsp;
                  {pool && pool.currency.symbol}
                  {/* 当 当前时间大于募资结束时间 && 小于结算开始时间则可以领回 */}
                  {pool &&
                    pool.settleable.amount > 0 &&
                    pool.status == 1 &&
                    now >= pool.timeClose &&
                    now < pool.time && (
                      <a
                        style={{ marginLeft: '4px' }}
                        className={cs(
                          `pools_detail_record_btn ${pool
                            ? 'pools_detail_record_btn_' + pool.networkId
                            : ''
                          }`
                        )}
                        onClick={() => onClaim()}
                      >
                        <FormattedMessage id='poolsDetailText5' />
                      </a>
                    )}
                </p>
              ) : (
                <p className='pools_detail_record_title_data'>-</p>
              )}

              <p className='pools_detail_record_title_val'>
                <FormattedMessage id='obtain' />
                <FormattedMessage id='num' />
              </p>
              {(pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                <p className='pools_detail_record_title_data'>
                  {pool && pool.settleable.unlockVolume}&nbsp;
                  {pool && pool.underlying.symbol}
                </p>
              ) : (
                <p className='pools_detail_record_title_data'>-</p>
              )}
              {(pool && pool.purchasedCurrencyOf.toString()) > 0 ? (
                <p className='pools_detail_record_title_data'>
                  {pool &&
                    pool.type === 0 &&
                    pool.status >= 2 && (pool.settleable.unlockVolume > 0) &&
                    now > pool.timeClose &&
                    now >= pool.time && (
                      <a
                        className={cs(
                          `pools_detail_record_btn ${pool
                            ? 'pools_detail_record_btn_' + pool.networkId
                            : ''
                          }`
                        )}
                        onClick={() => onClaim()}
                      >
                        <FormattedMessage id='poolsDetailText5' />
                      </a>
                    )}
                  {pool &&
                    pool.type === 1 &&
                    (pool.settleable.unlockVolume > 0) &&
                    pool.status >= 2 &&
                    now > pool.timeClose &&
                    now >= pool.time && (
                      <a
                        className={cs(
                          `pools_detail_record_btn ${pool
                            ? 'pools_detail_record_btn_' + pool.networkId
                            : ''
                          }`
                        )}
                        onClick={() => onClaim()}
                      >
                        <FormattedMessage id='poolsDetailText5' />
                      </a>
                    )}
                </p>
              ) : (
                <p className='pools_detail_record_title_data'></p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className='pools_detail'>
        <div className='pools_detail_content'>
          <div className='pools_detail_content_tab'>
            <a
              onClick={() => setDetailTab('detail')}
              className={cs(detailTab === 'detail' && 'active')}
            >
              <FormattedMessage id='poolsDetailText6' />
            </a>
            <a
              onClick={() => setDetailTab('project')}
              className={cs(detailTab === 'project' && 'active')}
            >
              <FormattedMessage id='poolsDetailText7' />
            </a>
          </div>
          {detailTab === 'detail' && (
            <div className='pools_detail_table_box'>
              <table className='pools_detail_table pools-detail_table__left'>
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage id='poolsDetailText8' />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>
                        <span>
                          <FormattedMessage id='poolsDetailText9' />
                        </span>
                        <span>{pool && pool.pool_info.token_distribution}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>
                          <FormattedMessage id='poolsDetailText10' />
                        </span>
                        <span>
                          {pool && pool.pool_info.min_allocation}-
                          {pool && pool.pool_info.max_allocation}
                        </span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>
                          <FormattedMessage id='poolsDetailText11' />
                        </span>
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
                    <th>
                      <FormattedMessage id='poolsDetailText12' />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>
                        <span>
                          <FormattedMessage id='poolsDetailText13' />
                        </span>
                        <span>{pool && pool.underlying.name}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>
                          <FormattedMessage id='poolsDetailText14' />
                        </span>
                        <span>
                          {pool &&
                            pool.underlying.address &&
                            pool.underlying.address || '-'}
                        </span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>
                          <FormattedMessage id='poolsDetailText15' />
                        </span>
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
              <a href={pool && pool.website} target='_blank'>
                <img src={chromeLine} />
                {pool && pool.website}
              </a>
              <a href={pool && pool.twitter} target='_blank'>
                <svg width='24' height='24' viewBox='0 0 30 30'>
                  <path d='M27.7 7.07c-.95.42-1.96.7-3 .82A5.25 5.25 0 0027 5a10.45 10.45 0 01-3.32 1.27 5.23 5.23 0 00-8.9 4.77A14.84 14.84 0 014 5.57a5.21 5.21 0 001.61 6.98 5.21 5.21 0 01-2.36-.65v.06a5.23 5.23 0 004.2 5.13c-.78.21-1.59.24-2.37.1a5.23 5.23 0 004.88 3.62 10.49 10.49 0 01-7.74 2.17 14.79 14.79 0 008.02 2.35c9.61 0 14.87-7.97 14.87-14.88 0-.22 0-.45-.02-.67 1.03-.74 1.91-1.66 2.61-2.7v-.01z' />
                </svg>
                {pool && pool.twitter}
              </a>
              <a href={pool && pool.Telegram_Channel} target='_blank'>
                <svg width='24' height='24' viewBox='0 0 30 30'>
                  <path
                    d='M15 27.5a12.5 12.5 0 110-25 12.5 12.5 0 010 25zm-3.89-11.04h.02l1.09 3.58c.14.39.33.46.56.43.24-.03.36-.16.52-.3l1.48-1.44 3.19 2.36c.58.32 1 .15 1.14-.54l2.07-9.78c.23-.91-.17-1.28-.87-.98l-12.17 4.7c-.83.33-.82.8-.15 1l3.12.97z'
                    fill='#22292F'
                  />
                </svg>
                {pool && pool.Telegram_Channel}
              </a>
              <a href={pool && pool.Github} target='_blank'>
                <svg width='24' height='24' viewBox='0 0 28 28'>
                  <path
                    d='M11.23823,22 C10.2198086,22.0035115 9.39035095,21.1913055 9.38327418,20.1836134 L9.37592774,18.8836151 C5.73031802,19.6681552 4.9613148,17.3536168 4.9613148,17.3536168 C4.36503551,15.8554314 3.50599711,15.4572398 3.50599711,15.4572398 C2.31715301,14.6517906 3.59605293,14.6681462 3.59605293,14.6681462 C4.91077706,14.7590518 5.60352999,16.0045108 5.60352999,16.0045108 C6.77217138,17.9863415 8.66941055,17.413608 9.4163538,17.0826971 C9.53395878,16.2445161 9.87389679,15.6727015 10.248751,15.3481613 C7.33813628,15.0208851 4.27867355,13.9081498 4.27867355,8.94087246 C4.27867355,7.52542498 4.79042749,6.36905421 5.62924254,5.46087681 C5.49327146,5.13360052 5.04491153,3.81542932 5.75603057,2.02996851 C5.75603057,2.02996851 6.85669673,1.68178313 9.36030623,3.35904347 C10.4294195,3.07122821 11.5322908,2.92450592 12.6402654,2.9226887 C13.7528592,2.92724215 14.8746567,3.07086964 15.9220405,3.35904347 C18.4238134,1.68180355 19.522643,2.02996851 19.522643,2.02996851 C20.2355986,3.81632775 19.7872387,5.13451937 19.6512676,5.46087681 C20.4910113,6.36815577 21,7.52542498 21,8.94089288 C21,13.9208912 17.9340988,15.0172505 15.0170662,15.338156 C15.4865575,15.7408806 15.905511,16.5290554 15.905511,17.7390669 C15.905511,19.4745215 15.8990726,20.1826945 15.8990726,20.1826945 C15.8920104,21.1898283 15.0638146,22.0020132 14.0459533,22 L11.2382094,22 L11.23823,22 Z'
                    fill='#22292F'
                  ></path>
                </svg>
                {pool && pool.Github}
              </a>
              <a href={pool && pool.white_paper} target='_blank'>
                <img src={bookMarkLine} />
                {pool && pool.white_paper}
              </a>
              <a href={pool && pool.yuque} target='_blank'>
                <svg width='24' height='24' viewBox='0 0 28 28'>
                  <path
                    d='M8.46424943,5.10249711 L8.47461061,5.109 L9.83620065,2.74070849 C9.93811703,1.90940768 9.58503922,1.02787459 8.77638646,0.0961091845 C8.76330143,0.081043992 8.75886764,0.0603157452 8.76464474,0.0412159218 C8.77042185,0.0221160985 8.78560064,0.0073200529 8.80484175,0.00203252033 L8.82023085,6.75015599e-14 L14.2087326,6.75015599e-14 L14.2093133,0.00464576982 C16.4357941,0.110046462 18.2093133,1.97125435 18.2093133,4.25203252 C18.2093133,5.4898374 17.6872459,6.6039489 16.8539126,7.38095239 C18.5287093,8.64982581 19.6088487,10.6489547 19.6088487,12.8980836 C19.6088487,16.6954123 16.5295804,19.7810685 12.7078615,19.8423345 L0.0136106136,19.8432056 L8.46424943,5.10249711 Z'
                    fill='#000000'
                  ></path>
                </svg>
                {pool && pool.yuque}
              </a>
              {pool && pool.underlying.symbol === 'MATTER' && (
                <a className='no_link'>
                  <FormattedMessage id='aboutProject' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'DFT' && (
                <a className='no_link'>{pool && pool.project_introduction}</a>
              )}
              {pool && pool.underlying.symbol === 'FIX' && (
                <a className='no_link'>
                  <FormattedMessage id='fixAboutProject' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'DORA' && (
                <a className='no_link'>
                  <FormattedMessage id='doraAboutProjectP1' />
                  <br />
                  <br />
                  <FormattedMessage id='doraAboutProjectP2' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'COOK' && (
                <a className='no_link'>
                  <FormattedMessage id='cookAboutProject' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'TOKEN' && (
                <a className='no_link'>
                  <FormattedMessage id='chainswapAboutProject1' />
                  <br />
                  <br />
                  <FormattedMessage id='chainswapAboutProject2' />
                  <br />
                  <br />
                  <FormattedMessage id='chainswapAboutProject3' />
                  <br />
                  <br />
                  <FormattedMessage id='chainswapAboutProject4' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'WAR' && (
                <a className='no_link'>
                  <FormattedMessage id='westarterAboutProject1' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'BLACK' && (
                <a className='no_link'>
                  <FormattedMessage id='blackAboutProject1' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'LEV' && (
                <a className='no_link'>
                  <FormattedMessage id='leverAboutProject1' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'YFX' && (
                <a className='no_link'>
                  <FormattedMessage id='yfxAboutProject1' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'O3' && (
                <a className='no_link'>
                  <FormattedMessage id='O3AboutProject1' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'CORA' && (
                <a className='no_link'>
                  <FormattedMessage id='corraAboutProject1' />
                </a>
              )}
              {pool && pool.underlying.symbol === 'COW' && (
                <>
                  <a className='no_link'>
                    <FormattedMessage id='cowAboutProject1' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='cowAboutProject2' />
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'PAUL' && (
                <>
                  <a className='no_link'>
                    <FormattedMessage id='paulAboutProject1' />
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'MOMAT' && (
                <>
                  <a className='no_link'>
                    <FormattedMessage id='momatAboutProject1' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='momatAboutProject2' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='momatAboutProject3' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='momatAboutProject4' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='momatAboutProject5' />
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'XNFT' && (
                <>
                  <a className='no_link'>
                    <FormattedMessage id='xNFTAboutProject1' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='xNFTAboutProject2' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='xNFTAboutProject3' />
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'PLUT' && (
                <>
                  <a className='no_link'>
                    <FormattedMessage id='plutAboutProject1' />
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'PHM' && (
                <>
                  <a className='no_link'>
                    <FormattedMessage id='phmAboutProject1' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='phmAboutProject2' />
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'HCT' && (
                <>
                  <a className='no_link'>
                    <FormattedMessage id='hctAboutProject1' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='hctAboutProject2' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='hctAboutProject3' />
                  </a>
                  <a className='no_link'>
                    <FormattedMessage id='hctAboutProject4' />
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'BTCMT' && (
                <>
                  <a className='no_link'>
                    Minto is a decentralized mining platform that creates a token secured by actively operating Bitcoin mining equipment. This equipment is tokenized by the BTCMT token, each of which equals a unit of actively operating Bitcoin mining power. Holding the token is effectively equivalent to owning Bitcoin mining power. The BTCMT token is based on the HECO blockchain and the Minto project is part of the Huobi chain ecosystem.
                  </a>
                  <a className='no_link'>
                    Minto’s token is backed by a state-of-the-art data center located in Karelia, which
                    houses the Project’s mining operation. The 86,000-square-meter data center is just 2 years old and has been fitted with the most powerful mining equipment available. Power for the mining equipment is supplied via a private hydroelectric plant with a current cap of 64.5 MW, which ensures that the facility always has more than enough available power.
                  </a>
                  <a className='no_link'>
                    Currently, Minto is housed in one data center but others are being built to
                    accommodate the future growth of the Project. Total mining power allocated to Minto, for now, is 50,000 TH/s and we have the ability to increase it in the future since it’s only part of the whole data center’s mining power.
                  </a>
                  <a className='no_link'>
                    For the first batch, Minto team issued 5 000 000 tokens. Each token is backed by
                    0,01 th/s of mining power. Thus, the total mining power currently allocated to Minto Project is 50 PHS.
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'MATE' && (
                <>
                  <a className='no_link'>
                    Vmates is a social game for developing NFT virtual pets based on blockchain technology. In Vmates, players can participate in the cultivation of NFT virtual pets, interactions, and a series of games with social attributes, and build their own homes and commercial facilities in the PLAZA social square.
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'LOST' && (
                <>
                  <a className='no_link'>
                    The Lost Throne is the first chain game project released by Liberty Land. A new round of financing led by Blue Mountains Venture Capital and VCs such as Spiral Capital has been completed. The TLT system is supported by realizable crypto assets including equity token — CP, economic token — DD, and NFT cards, etc. CP is the equity and governance token of TLT ecosystem, also the only proof of ownership of the game.
                  </a>
                  <a className='no_link'>
                    The Lost Throne is a two-player trading card game that focuses on the concept of Metaverse NFT and TCG featuring token economy + NFT + war chess + RPG into the ecology of Play to Earn and Play for Fun. Players can earn valuable assets through card skills and contributions to the ecosystem by collecting, building, fighting, and trading in this mysterious fantasy world of swords and magic.
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'HRS' && (
                <>
                  <a className='no_link'>
                    Heres" is a free mobile game that builds a cross entry between the game world and the Metaverse through the Blockchain-based NFT ecological architecture and open game community. Based on the core game, realize the implantation of diversified businesses, and over time, through the power of the HRS main creative team and the community, gradually develop and finally form the Metaverse ecology:
                  </a>
                  <a className='no_link'>
                    ● NFT trading market;
                  </a>
                  <a className='no_link'>
                    ● Digital asset trading platform;
                  </a>
                  <a className='no_link'>
                    ● Regular game and activity rules;
                  </a>
                  <a className='no_link'>
                    ● Social Center: Provide a meeting place for like-minded players;
                  </a>
                  <a className='no_link'>
                    ● Metaverse: expand to third-party developed games and more applications
                  </a>
                  <a className='no_link'>
                    ● Intelligent hardware: the development and maturity of VR and AR will serve as the hardware foundation of the HRS Metaverse.
                  </a>
                </>
              )}
              {pool && pool.underlying.symbol === 'PLAYER' && (
                <>
                  <a className="no_link">CryptoSteam disrupts the traditional Steam-like publishing platform model by directing all platform revenue and revenue from games, like DeDragon, into the DAO treasury, which is controlled by protocols to buy back governance tokens when they fall below a set price, while the liquidity of governance tokens is bought back from the market through the mechanism of bonds. Cryptosteam combines this model with “Play To Earn” to create the new GameFi 2.0.</a>
                  <a className="no_link">CryptoSteam also uses Tokens and NFTs to connect the economic model of all games. Allowing game developers to become the managers of CryptoSteam through the DAO. All of the profits will be used to maintain the stability of the platform’s GameFi 2.0 economic model.</a>
                </>
              )}
              {pool && pool.underlying.symbol === 'GRVS' && (
                <>
                  <a className="no_link">Unique ecosystem that unites DeFi with Gmart NFT marketplace for in-game assets and the highly anticipated online game – Evervoid. At Gravis Finance, we provide all the necessary instruments for managing your crypto assets on any chain.</a>
                  <a className="no_link">Gravis Finance ecosystem consists of 3 main parts:</a>
                  <a className="no_link">🎮 Evervoid (http://evervo.id/) -a revolutionary game that comes out on mobile devices 2022 with well-balanced economy, advanced graphics, and unique features from the ecosystem..</a>
                  <a className="no_link">🛍 Gmart (http://gmart.io/) - the first NFT marketplace for gaming assets, "STEAM" on blockchain. Buy and sell your favorite NFT assets from any game on any blockchain. Coming out on mobile devices in 2022.</a>
                  <a className="no_link">💸 Gswap (http://gswap.exchange/) - multi-chain AMM DEX which combines high functionality with a simple interface and advanced DeFi functions: liquidity migration from other exchanges, staking, Yield farming, Auto-farming, etc. By using a multi-chain bridge you can quickly move assets from one blockchain network to another. We use our own blockchain nodes to quickly process transactions and orders. Now on BNB, Polygon, and Heco, coming soon on Solana, Polkadot, Avalanche and Near.</a>
                  <a className="no_link">With balanced tokenomics, two tokens woven seamlessly into the project and a clearly calculated economic model, Gravis Finance strives to provide any user with maximum comfort and profitability. Our mission is to give our users a tool to generate basic income in crypto.</a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <BadgeStake visible={showBadgeStake} setVisible={() => setShowBadgeStake(false)} pool={pool} />
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

export default injectIntl(PoolsDetail)
