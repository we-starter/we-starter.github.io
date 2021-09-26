import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import PoolsBanner from '../../components/banner/PoolsBanner'
import chromeLine from '../../assets/icon/chrome-line@2x.png'
import bookMarkLine from '../../assets/icon/book-mark-line@2x.png'
import Web3 from 'web3'
import {useAllowance, useBalance} from '../../pages/Hooks'
import { getRandomIntInclusive } from '../../utils/index'
import Timer from 'react-compound-timer'
import {
  HANDLE_SHOW_APPROVE_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  HANDLE_WALLET_MODAL, waitingForInit
} from '../../const'
import transitions from '@material-ui/core/styles/transitions'
// import pools from '../../configs/pools'
import { usePoolsLBPInfo } from './Hooks'
import {Button, message} from 'antd'
import { getContract, useActiveWeb3React } from '../../web3'
import { mainContext } from '../../reducer'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatAmount, fromWei, numToWei } from '../../utils/format'
import ERC20 from "../../web3/abi/ERC20.json";
import {GAS_FEE, MINE_MOUNTAIN_ADDRESS} from "../../web3/address";

const PoolsDetailLBP = (props) => {
  const { address } = props.match.params

  const { intl } = props

  const { account, active, library, chainId } = useActiveWeb3React()
  const pools = usePoolsLBPInfo(address)

  const [detailTab, setDetailTab] = useState('detail')
  const [pool, setPool] = useState(pools[0])
  const [now, setNow] = useState(parseInt(Date.now() / 1000))
  const [left_time, setLeftTime] = useState(0)
  const [amount, setAmount] = useState('')
  const [approve, setApprove] = useState(true)
  const [loadFlag, setLoadFlag] = useState(false)
  const [fee, setFee] = useState(0)

  const { dispatch, state } = useContext(mainContext)

  const { slippageVal } = state

  const currency_address = pool ? pool.currency.address : '0x0'
  const { balance = 0 } = useBalance(currency_address)

//  if (!pool || chainId !== pool.networkId) {
//    window.location.href = '/'
//  }
  
  const allowance = useAllowance(
    pool.currency.address,
    pool.address,
    account
  )

  useEffect(() => {
    if (allowance > 0) {
      setApprove(false)
    }
  }, [allowance])

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
        setLeftTime((time - now) * 1000)
      }
    }
  }, [pools, address])

  const renderStatus = (pool) => {
    const { status, timeClose = 0 } = pool
    switch (status) {
      case 0:
        return (
          <span className='pools_LBP_coming_status'>
            <FormattedMessage id='willStart' />
          </span>
        )
      case 1:
        if (timeClose === 0 || timeClose > now) {
          return (
            <span className='pools_LBP_progress_status'>
              <FormattedMessage id='recruit' />
            </span>
          )
        } else {
          return (
            <span className='pools_LBP_progress_status'>
              <FormattedMessage id='recruitOver' />
            </span>
          )
        }
      case 3:
        return (
          <span className='pools_LBP_over_status'>
            <FormattedMessage id='completed' />
          </span>
        )
    }
  }

  useEffect(() => {
    const gas_limit = new BigNumber('1006182')
    const gas_price = new BigNumber(
      Web3.utils.toWei(`${getRandomIntInclusive(5, 20)}`, 'gwei')
    )
    const _fee = gas_limit.multipliedBy(gas_price).toString()
    setFee(_fee)
  }, [])


  const onApprove = (e) => {
    if (!active) {
      return false
    }

    if(pool.status === 0) {
      message.info(intl.formatMessage({ id: 'cannotSubscribe' }))
      return
    }

    if (loadFlag) return
    setLoadFlag(true)
    const contract = getContract(
      library,
      ERC20.abi,
      pool.currency.address
    )
    contract.methods
      .approve(
        pool.address,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', (_, receipt) => {
        console.log('approve success')
        setLoadFlag(false)
        setApprove(false)
      })
      .on('error', (err, receipt) => {
        console.log('approve error', err)
        dispatch({
          type: HANDLE_SHOW_APPROVE_FAILED_TRANSACTION_MODAL,
          showApproveFailedTransactionModal: true,
        })
        dispatch({
          type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
          showWaitingWalletConfirmModal: waitingForInit,
        })
        setLoadFlag(false)
      })
  }

  const onMax = async () => {
    if (balance <= 0) {
      setAmount(0)
      return false
    }

    let max = balance
    const maxB = new BigNumber(max)

    const contract = getContract(library, pool.abi, pool.address)

    let gas_fee = 0
    try {
      // 估算一下gas费
      const strapOut = await contract.methods
        .getStrapOut(max)
        .call({ from: account })
      let minOut = new BigNumber(strapOut)
        .multipliedBy(
          new BigNumber(100)
            .minus(new BigNumber(slippageVal))
            .dividedBy(new BigNumber(100))
        )
        .toFixed(0, 1)
        .toString()
      const gas_limit = await contract.methods.strap(minOut).estimateGas({
        from: account,
        value: max,
      })
      const gas_price = Web3.utils.toWei('100', 'gwei')
      gas_fee = new BigNumber(gas_limit).multipliedBy(
        new BigNumber(gas_price)
      )
    }catch (e) {
      const gas_limit = new BigNumber('1006182')
      const gas_price = new BigNumber(Web3.utils.toWei(`${getRandomIntInclusive(5, 20)}`, 'gwei'))
      gas_fee =  gas_limit.multipliedBy(gas_price).toString()
    }


    max = maxB.gt(gas_fee) ? maxB.minus(gas_fee).toString() : 0

    setAmount(formatAmount(max, pool.currency.decimal, 6))
  }

  const onChange = (e) => {
    const { value } = e.target
    const re = /^[0-9]+([.|,][0-9]+)?$/g
    if (
      value === '' ||
      re.test(value) ||
      (value.split('.').length === 2 && value.slice(value.length - 1) === '.')
    ) {
      setAmount(value)
    }
  }

  useEffect(() => {
    console.log(slippageVal, 'slippageValslippageValslippageVal')
  }, [slippageVal])

  const purchaseBtn = async () => {
    if(pool.status === 0) {
      message.info(intl.formatMessage({ id: 'cannotSubscribe' }))
      return
    }
    if (pool.status === 3) return
    // TODO 校验amount 合法性
    if (!(amount * 1 > 0)) {
      return false
    }

    if (loadFlag) return
    setLoadFlag(true)

    const contract = getContract(library, pool.abi, address)

    // 买入数量 * （(100 - 滑点) / 100）
    // 当设置滑点后，进行
    const strapOut = await contract.methods.getStrapOut(numToWei(amount)).call({
      from: account,
    })

    let minOut = new BigNumber(strapOut)
      .multipliedBy(
        new BigNumber(100)
          .minus(new BigNumber(slippageVal))
          .dividedBy(new BigNumber(100))
      )
      .toFixed(0, 1)
      .toString()

    if(pool.is_ht) {
      let method = 'strapETH'
      if(typeof contract.methods[method] == 'undefined'){
        // V1版本合约
        method = 'strap'
      }

      return contract.methods[method](minOut)
        .send({
          from: account,
          value: numToWei(amount),
          ...GAS_FEE(chainId)
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          // 买入成功后弹框提示
          if (confirmationNumber - 0 === 0) {
            //根据池子的address
            localStorage.setItem(`is_join_${pool.address}`, true)
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'slippageSuccess',
            })
          }
        }).on('receipt', () => {
          setLoadFlag(false)
        }).on('error', () => {
          setLoadFlag(false)
        })
    }else{
      return contract.methods
        .strap(numToWei(amount), minOut)
        .send({
          from: account,
          ...GAS_FEE(chainId)
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          // 买入成功后弹框提示
          if (confirmationNumber - 0 === 0) {
            //根据池子的address
            localStorage.setItem(`is_join_${pool.address}`, true)
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'slippageSuccess',
            })
          }
        }).on('receipt', () => {
          setLoadFlag(false)
        }).on('error', () => {
          setLoadFlag(false)
        })
    }

  }

  return (
    <div className='pools_detail_box'>
      <PoolsBanner address={address} pool={pool} LBPFlag='LBP' />
      <div className='pools_LBP_card'>
        <div className='pools_LBP_card_title'>
          <h2 className='LBP_title'>
            <FormattedMessage
              id='warLBP1'
              values={{ LBPType: pool && pool.underlying.symbol }}
            />
          </h2>
          <p className='pools_LBP_card_title_right'>
            {renderStatus(pool)}
            {pool && pool.status < 3 && left_time > 0 && (
              <span className='pools_LBP_time'>
                <Timer
                  initialTime={left_time}
                  key={left_time}
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
            )}
          </p>
        </div>
        <p className='pools_LBP_card_ratio'>{pool && pool.ratio}</p>
        <div className='pools_LBP_card_purchase'>
          <span className='purchase_title'>
            <FormattedMessage id='warLBP2' />
          </span>
          <span className='balance'>
            <FormattedMessage id='warLBP3' />
            {balance &&
              pool &&
              `${formatAmount(balance)} ${pool.currency.symbol}`}
          </span>
        </div>
        <div className='deposit__inputbox form-app__inputbox'>
          <div className='form-app__inputbox-control'>
            <div className='form-app__inputbox-input'>
              <input
                style={{ background: '#fff' }}
                value={amount}
                onChange={onChange}
                className='input'
                placeholder={intl.formatMessage({
                  id: 'money',
                })}
              />
            </div>

            <div className='form-app__inputbox-up' onClick={onMax}>
              <div className='form-app__inputbox-up-pref'>
                <FormattedMessage id='poolText19' />
              </div>
            </div>
            {/* 设置滑点弹框 */}
            <a
              className='set_slippage'
              onClick={() => {
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: 'slippage',
                  pool,
                })
              }}
            >
              <svg
                t='1619325556317'
                className='icon'
                viewBox='0 0 1024 1024'
                version='1.1'
                p-id='2296'
                width='24'
                height='28'
              >
                <path
                  d='M146.285714 512c0-36.169143 4.022857-71.168 11.556572-104.667429 41.179429 2.486857 80.128-21.650286 100.754285-62.500571a140.8 140.8 0 0 0-2.962285-130.962286c44.214857-49.737143 98.742857-85.76 158.537143-104.704 18.724571 42.057143 56.502857 68.534857 97.792 68.534857s79.067429-26.477714 97.792-68.534857c59.757714 18.944 114.322286 55.003429 158.537142 104.704a140.8 140.8 0 0 0-2.998857 131.035429c20.662857 40.850286 59.611429 64.987429 100.827429 62.464 7.533714 33.462857 11.556571 68.461714 11.556571 104.630857 0 36.169143-4.022857 71.168-11.556571 104.667429-41.216-2.486857-80.128 21.650286-100.790857 62.464a140.8 140.8 0 0 0 2.962285 130.998857c-44.214857 49.737143-98.742857 85.76-158.537142 104.704-18.724571-42.057143-56.502857-68.534857-97.792-68.534857s-79.067429 26.477714-97.792 68.534857c-59.757714-18.944-114.322286-55.003429-158.537143-104.704a140.8 140.8 0 0 0 2.998857-131.035429c-20.662857-40.850286-59.611429-64.987429-100.827429-62.464A477.257143 477.257143 0 0 1 146.285714 512z m175.689143 125.403429a234.788571 234.788571 0 0 1 20.626286 147.273142 286.354286 286.354286 0 0 0 47.433143 31.341715c33.536-34.304 76.946286-53.284571 121.965714-53.248 46.08 0 89.161143 19.675429 121.965714 53.248a286.354286 286.354286 0 0 0 47.433143-31.341715 234.642286 234.642286 0 0 1 20.626286-147.273142c22.491429-44.544 58.550857-78.043429 101.302857-94.061715 1.682286-20.845714 1.682286-41.837714 0-62.683428-42.788571-16.018286-78.848-49.481143-101.339429-94.061715a234.642286 234.642286 0 0 1-20.626285-147.273142 285.696 285.696 0 0 0-47.433143-31.341715c-33.499429 34.304-76.946286 53.284571-121.929143 53.248-44.982857 0-88.429714-18.944-121.965714-53.248-16.64 8.740571-32.548571 19.2-47.433143 31.341715a234.642286 234.642286 0 0 1-20.626286 147.273142c-22.491429 44.544-58.550857 78.043429-101.302857 94.061715-1.682286 20.845714-1.682286 41.837714 0 62.683428 42.788571 16.018286 78.848 49.481143 101.339429 94.061715h-0.036572z m190.025143 0c-60.598857 0-109.714286-56.137143-109.714286-125.403429s49.115429-125.403429 109.714286-125.403429 109.714286 56.137143 109.714286 125.403429-49.115429 125.403429-109.714286 125.403429z m0-83.602286c20.187429 0 36.571429-18.724571 36.571429-41.801143s-16.384-41.801143-36.571429-41.801143-36.571429 18.724571-36.571429 41.801143 16.384 41.801143 36.571429 41.801143z'
                  p-id='2297'
                ></path>
              </svg>
            </a>
          </div>
        </div>
        {approve && (
          <Button
            className={'btn'}
            type='button'
            loading={loadFlag}
            onClick={onApprove}
          >
            <FormattedMessage id='farm20' />
          </Button>
        )}
        {!approve && (
          <Button
            className={'btn'}
            type='button'
            loading={loadFlag}
            onClick={purchaseBtn}
          >
            <FormattedMessage id='warLBP2' />
          </Button>
        )}
        <div className='lbp_tip'>
          <p>
            <FormattedMessage id='warLBP8' values={{ token: pool.farm_lpt }} />{' '}
            <a href={pool.farm_link} target='_blank'>
              <FormattedMessage
                id='warLBP9'
                values={{ token: pool.farm_lpt }}
              />
            </a>{' '}
            <FormattedMessage id='warLBP10' />
          </p>
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
                        <span>{pool && pool.underlying.symbol}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>
                          <FormattedMessage id='poolsDetailText14' />
                        </span>
                        <span>{pool && pool.underlying.address}</span>
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
              {pool && pool.underlying.symbol === 'PAUL' && (
                <>
                  <a className='no_link'>
                    <FormattedMessage id='paulAboutProject1' />
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default injectIntl(PoolsDetailLBP)
