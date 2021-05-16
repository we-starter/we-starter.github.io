import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { useAllowance, useBalance, useHTBalance } from '../../pages/Hooks'
import MDexRouter from '../../web3/abi/MDexRouter.json'
import { Button } from 'antd'
import {
  WAR_ADDRESS,
  USDT_ADDRESS,
  WHT_ADDRESS,
  MDEX_ROUTER_ADDRESS,
  WETH_ADDRESS,
} from '../../web3/address'
import BigNumber from 'bignumber.js'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import ERC20 from '../../web3/abi/ERC20.json'
import WAR from '../../assets/icon/WAR@2x.png'
import HT from '../../assets/icon/HT@2x.png'
import USDT from '../../assets/icon/USDT@2x.png'
import SWAPLINE from '../../assets/icon/swap-line@2x.png'
import { FormattedMessage } from 'react-intl'
import { useMDexPrice } from '../../pages/pools/Hooks'
import { mainContext } from '../../reducer'

// 设置滑点
const sliding = 0.005

const BuyCoinPopup = (props) => {
  const { intl, icon, onClose } = props
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
  const [amount, setAmount] = useState('')
  const [tabFlag, setTabFlag] = useState('HT')
  const [fromToken, setFromToken] = useState(chainId && WHT_ADDRESS(chainId))
  const [loadFlag, setLoadFlag] = useState(false)
  const [approve, setApprove] = useState(false)
  const [fee, setFee] = useState(0)
  const HTbalance = useHTBalance()
  const USDTBalance = useBalance(USDT_ADDRESS(chainId))
  const [middlePath, setMiddlePath] = useState([])
  const outAmount = useMDexPrice(
    fromToken,
    chainId && WAR_ADDRESS(chainId),
    amount,
    middlePath
  )
  const radioOutAmount = useMDexPrice(
    fromToken,
    chainId && WAR_ADDRESS(chainId),
    1,
    middlePath
  )
  const USDTAllowance = useAllowance(
    chainId && USDT_ADDRESS(chainId),
    MDEX_ROUTER_ADDRESS,
    account
  )

  const [minAmount, setMinAmount] = useState('-')

  const [balance, setBalance] = useState(HTbalance && HTbalance.balance)

  useEffect(() => {
    if (USDTAllowance > 0) {
      setApprove(false)
    }
  }, [USDTAllowance])

  useEffect(() => {
    if (tabFlag === 'HT') setBalance(HTbalance && HTbalance.balance)
  }, [HTbalance])

  useEffect(() => {
    const _minAmount = outAmount * (1 - sliding)
    setMinAmount(_minAmount)
  }, [outAmount])

  useEffect(() => {
    if (tabFlag === 'HT') {
      setApprove(false)
      setBalance(HTbalance && HTbalance.balance)
    }
    if (tabFlag === 'USDT') {
      if (USDTAllowance > 0) {
        setApprove(false)
      } else {
        setApprove(true)
      }
      setBalance(USDTBalance && USDTBalance.balance)
    }
  }, [tabFlag])

  useEffect(() => {
    // amount && setFee(new BigNumber(amount).multipliedBy(new BigNumber(0.003)))
  }, [amount])

  const onMax = () => {
    let max = balance
    setAmount(formatAmount(max, 18, 6))
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

  const onApprove = (e) => {
    if (!active) {
      return false
    }
    if (loadFlag) return
    setLoadFlag(true)
    const contract = getContract(library, ERC20.abi, USDT_ADDRESS(chainId))
    contract.methods
      .approve(
        MDEX_ROUTER_ADDRESS,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      .send({
        from: account,
      })
      .on('receipt', (_, receipt) => {
        console.log('approve success')
        setLoadFlag(false)
        setApprove(false)
      })
      .on('error', (err, receipt) => {
        console.log('approve error', err)
        setLoadFlag(false)
      })
  }

  const onConfirmSwap = (e) => {
    if (!active) {
      return false
    }
    if (!balance) {
      return false
    }
    if (isNaN(parseInt(balance))) {
      return false
    }
    if (!amount) {
      return false
    }
    if (isNaN(parseInt(amount))) {
      return false
    }
    if (!(minAmount * 1)) {
      return false
    }
    if (loadFlag) return
    setLoadFlag(true)
    const contract = getContract(library, MDexRouter, MDEX_ROUTER_ADDRESS)
    const deadline = parseInt(Date.now() / 1000) + 60 * 20
    if (tabFlag === 'HT') {
      contract.methods
        .swapExactETHForTokens(
          numToWei(minAmount),
          [WHT_ADDRESS(chainId), WAR_ADDRESS(chainId)],
          account,
          deadline
        )
        .send({
          from: account,
          value: numToWei(amount),
        })
        .on('receipt', (_, receipt) => {
          console.log('success')
          setLoadFlag(false)
          onClose()
        })
        .on('error', (err, receipt) => {
          console.log('approve error', err)
          setLoadFlag(false)
        })
    } else {
      contract.methods
        .swapExactTokensForTokens(
          numToWei(amount),
          numToWei(minAmount),
          [USDT_ADDRESS(chainId), WETH_ADDRESS(chainId), WAR_ADDRESS(chainId)],
          account,
          deadline
        )
        .send({
          from: account,
        })
        .on('receipt', (_, receipt) => {
          console.log('approve success')
          setLoadFlag(false)
          onClose()
        })
        .on('error', (err, receipt) => {
          console.log('approve error', err)
          setLoadFlag(false)
        })
    }
  }

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app farm_popup' action='/'>
          <div className='form-app__inner deposit buy_popup_box'>
            <h1
              className='form-app__title h3'
              style={{
                marginTop: 0,
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FormattedMessage id='farm17' />
              &nbsp; WAR
              <a className='farm_popup_close_btn' onClick={onClose}></a>
            </h1>
            <div className='buy_popup_tab_box'>
              <a
                className={cs(
                  'buy_popup_tab',
                  tabFlag === 'HT' && 'buy_popup_tab_active'
                )}
                onClick={() => {
                  setTabFlag('HT')
                  setFromToken(WHT_ADDRESS(chainId))
                  setMiddlePath([])
                }}
              >
                HT
              </a>
              <a
                className={cs(
                  'buy_popup_tab',
                  tabFlag === 'USDT' && 'buy_popup_tab_active'
                )}
                onClick={() => {
                  setTabFlag('USDT')
                  setFromToken(USDT_ADDRESS(chainId))
                  setMiddlePath([WHT_ADDRESS(chainId)])
                }}
              >
                USDT
              </a>
            </div>
            <div className='buy_popup_balance_box'>
              <p className='form-app__inputbox-after-text farm_popup_avaliable'>
                <FormattedMessage id='poolText18' />
                <span>{formatAmount(balance)}</span>
              </p>
              {tabFlag === 'HT' && (
                <p className='form-app__inputbox-after-text buy_popup_ratio'>
                  1WAR ={' '}
                  {radioOutAmount * 1 > 0
                    ? new BigNumber(1)
                        .dividedBy(new BigNumber(radioOutAmount))
                        .toFixed(6)
                    : '--'}
                  HT
                </p>
              )}
              {tabFlag === 'USDT' && (
                <p className='form-app__inputbox-after-text buy_popup_ratio'>
                  1WAR ={' '}
                  {radioOutAmount * 1 > 0
                    ? new BigNumber(1)
                        .dividedBy(new BigNumber(radioOutAmount))
                        .toFixed(5)
                    : '--'}
                  USDT
                </p>
              )}
            </div>

            <div className='deposit__inputbox form-app__inputbox'>
              <div className='form-app__inputbox-control'>
                <div className='form-app__inputbox-input'>
                  <input
                    value={amount}
                    onChange={onChange}
                    className='input buy_popup_input'
                    placeholder='0.0'
                  />
                </div>

                <div
                  className='form-app__inputbox-up buy_popup_onMax'
                  onClick={onMax}
                >
                  <div className='form-app__inputbox-up-pref buy_popup_onMax_value'>
                    <FormattedMessage id='poolText19' />
                  </div>
                </div>
                {tabFlag === 'HT' && (
                  <div className='buy_popup_unit'>
                    <img src={HT} />
                    <span>HT</span>
                  </div>
                )}
                {tabFlag === 'USDT' && (
                  <div className='buy_popup_unit'>
                    <img src={USDT} />
                    <span>USDT</span>
                  </div>
                )}
              </div>
            </div>

            <img src={SWAPLINE} className='buy_popup_swap-line' />

            {/* 买入 token 数量 */}
            <div className='buy_popup_token_value'>
              <p>
                <FormattedMessage id='buyPopup7' />
              </p>
              {tabFlag === 'HT' && (
                <p>
                  {outAmount * 1 > 0 ? (outAmount * 1).toFixed(6) : '-'} WAR
                </p>
              )}
              {tabFlag === 'USDT' && (
                <p>
                  {outAmount * 1 > 0 ? (outAmount * 1).toFixed(8) : '-'} WAR
                </p>
              )}
            </div>

            <div className='form-app__submit form-app__submit--row'>
              {approve && (
                <Button type='primary' onClick={onApprove} loading={loadFlag}>
                  <FormattedMessage id='farm20' />
                </Button>
              )}
              {!approve && (
                <Button
                  type='primary'
                  onClick={onConfirmSwap}
                  loading={loadFlag}
                >
                  <FormattedMessage id='buyPopup6' />
                </Button>
              )}
            </div>

            <p
              className='form-app__inputbox-after-text farm_popup_avaliable'
              style={{ marginTop: '10px' }}
            >
              <span className='buy_popup_tips'>
                <FormattedMessage id='buyPopup3' />
                {/* <svg
                  t='1621064065432'
                  class='icon'
                  viewBox='0 0 1024 1024'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                  p-id='2895'
                  width='20'
                  height='20'
                >
                  <path
                    d='M512 43.885714c258.121143 0 468.114286 209.993143 468.114286 468.114286 0 258.121143-209.993143 468.114286-468.114286 468.114286A468.626286 468.626286 0 0 1 43.885714 512C43.885714 253.878857 253.878857 43.885714 512 43.885714z m0 643.657143a58.514286 58.514286 0 1 0-0.073143 116.955429A58.514286 58.514286 0 0 0 512 687.542857zM512 219.428571c-96.768 0-175.542857 71.460571-175.542857 159.305143 0 25.161143 22.454857 45.494857 50.176 45.494857 27.721143 0 50.102857-20.333714 50.102857-45.494857 0-37.668571 33.792-68.315429 75.264-68.315428s75.264 30.72 75.264 68.315428c0 34.962286-29.110857 63.853714-66.56 67.803429L512 446.902857c-27.794286 0-50.176 20.333714-50.176 45.494857v91.062857c0 25.161143 22.454857 45.494857 50.176 45.494858 27.794286 0 50.176-20.333714 50.176-45.494858v-52.955428C634.368 510.829714 687.542857 450.633143 687.542857 378.733714 687.542857 290.889143 608.768 219.428571 512 219.428571z'
                    p-id='2896'
                  ></path>
                </svg> */}
              </span>
              {tabFlag === 'HT' && (
                <span className='buy_popup_tips_value'>
                  {minAmount * 1 > 0 ? (minAmount * 1).toFixed(6) : '-'} WAR
                </span>
              )}
              {tabFlag === 'USDT' && (
                <span className='buy_popup_tips_value'>
                  {minAmount * 1 > 0 ? (minAmount * 1).toFixed(8) : '-'} WAR
                </span>
              )}
            </p>

            <p
              className='form-app__inputbox-after-text farm_popup_avaliable'
              style={{ marginTop: '10px' }}
            >
              <span className='buy_popup_tips'>
                <FormattedMessage id='buyPopup4' />
              </span>
              {tabFlag === 'HT' && (
                <span className='buy_popup_tips_value'>
                  {(amount &&
                    new BigNumber(amount)
                      .multipliedBy(new BigNumber(0.003))
                      .toNumber()) ||
                    '-'}{' '}
                  {tabFlag}
                </span>
              )}
              {tabFlag === 'USDT' && (
                <span className='buy_popup_tips_value'>
                  {(amount &&
                    (amount * 1 <= 1
                      ? new BigNumber(amount)
                          .multipliedBy(new BigNumber(0.0059))
                          .toNumber()
                      : new BigNumber(amount)
                          .multipliedBy(new BigNumber(0.0059))
                          .toNumber()
                          .toFixed(3))) ||
                    '-'}{' '}
                  {tabFlag}
                </span>
              )}
            </p>

            <a
              className='buy_popup_corner_tips'
              href='https://ht.mdex.com/#/swap?outputCurrency=0x910651f81a605a6ef35d05527d24a72fecef8bf0'
              target='_black'
            >
              <FormattedMessage id='buyPopup5' />
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default injectIntl(BuyCoinPopup)
