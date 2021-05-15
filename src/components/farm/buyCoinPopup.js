import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { getRandomIntInclusive } from '../../utils/index'
import { useBalance, useHTBalance } from '../../pages/Hooks'
import { Button } from 'antd'
import { WAR_ADDRESS, USDT_ADDRESS, WHT_ADDRESS } from '../../web3/address'
import { getPointAddress } from '../../web3/address'
import Web3 from 'web3'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import ERC20 from '../../web3/abi/ERC20.json'
import WAR from '../../assets/icon/WAR@2x.png'
import HT from '../../assets/icon/HT@2x.png'
import SWAPLINE from '../../assets/icon/swap-line@2x.png'
import { FormattedMessage } from 'react-intl'

import { mainContext } from '../../reducer'
import BigNumber from 'bignumber.js'

const BuyCoinPopup = (props) => {
  const { intl, icon, onClose, pool } = props
  const farmPools = pool
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState(0)
  const [tabFlag, setTabFlag] = useState('HT')
  const [loadFlag, setLoadFlag] = useState(false)
  const HTbalance = useHTBalance()
  const USDTBalance = useBalance(USDT_ADDRESS(chainId))
  const [balance, setBalance] = useState(HTbalance && HTbalance.balance)

  useEffect(() => {
    const gas_limit = new BigNumber('1006182')
    const gas_price = new BigNumber(
      Web3.utils.toWei(`${getRandomIntInclusive(5, 20)}`, 'gwei')
    )
    const _fee = gas_limit.multipliedBy(gas_price).toString()
    setFee(_fee)
  }, [])

  useEffect(() => {
    if (tabFlag === 'HT') setBalance(HTbalance && HTbalance.balance)
  }, [HTbalance])

  useEffect(() => {
    if (tabFlag === 'HT') setBalance(HTbalance && HTbalance.balance)
    if (tabFlag === 'USDT') setBalance(USDTBalance && USDTBalance.balance)
  }, [tabFlag])

  const onMax = () => {
    let max = balance
    setAmount(formatAmount(max, farmPools && farmPools.decimal, 6))
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
              <FormattedMessage id='poolText16' />
              {pool && pool.underlying.symbol}
              <FormattedMessage id='poolText17' />
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
              <p className='form-app__inputbox-after-text buy_popup_ratio'>
                1HT = 143.22 WAR
              </p>
            </div>

            <div className='deposit__inputbox form-app__inputbox'>
              <div className='form-app__inputbox-control'>
                <div className='form-app__inputbox-input'>
                  <input
                    value={amount}
                    onChange={onChange}
                    className='input buy_popup_input'
                    placeholder={intl.formatMessage({
                      id: 'farm15',
                    })}
                  />
                </div>

                <div
                  className='form-app__inputbox-up buy_popup_onMax'
                  onClick={onMax}
                >
                  <div className='form-app__inputbox-up-pref'>
                    <FormattedMessage id='poolText19' />
                  </div>
                </div>
                <div className='buy_popup_unit'>
                  <img src={HT} />
                  <span>HT</span>
                </div>
              </div>
            </div>

            <img src={SWAPLINE} className='buy_popup_swap-line' />

            {/* 买入 token 数量 */}
            <div className='deposit__inputbox form-app__inputbox'>
              <div className='form-app__inputbox-control'>
                <div className='form-app__inputbox-input'>
                  <input
                    value={amount}
                    onChange={onChange}
                    className='input buy_popup_input'
                    placeholder={intl.formatMessage({
                      id: 'farm15',
                    })}
                  />
                </div>

                <div
                  className='form-app__inputbox-up buy_popup_onMax'
                  onClick={onMax}
                >
                  <div className='form-app__inputbox-up-pref'>
                    <FormattedMessage id='poolText19' />
                  </div>
                </div>
                <div className='buy_popup_unit'>
                  <img src={WAR} />
                  <span>WAR</span>
                </div>
              </div>
            </div>

            <div className='form-app__submit form-app__submit--row'>
              <Button type='primary' onClick={onConfirmSwap} loading={loadFlag}>
                <FormattedMessage id='buyPopup6' />
              </Button>
            </div>
            <p
              className='form-app__inputbox-after-text farm_popup_avaliable'
              style={{ marginTop: '8px' }}
            >
              <span className='buy_popup_tips'>
                <FormattedMessage id='buyPopup1' />
                <svg
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
                </svg>
              </span>

              <span className='buy_popup_tips_value'>0.5%</span>
            </p>
            <p className='form-app__inputbox-after-text farm_popup_avaliable'>
              <span className='buy_popup_tips'>
                <FormattedMessage id='buyPopup2' />
                <svg
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
                </svg>
              </span>
              <span
                className='buy_popup_tips_value'
                style={{ color: '#FF9600' }}
              >
                {'<' + '0.01%'}
              </span>
            </p>
            <p className='form-app__inputbox-after-text farm_popup_avaliable'>
              <span className='buy_popup_tips'>
                <FormattedMessage id='buyPopup3' />
                <svg
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
                </svg>
              </span>
              <span className='buy_popup_tips_value'>16.13 WAR</span>
            </p>
            <p className='form-app__inputbox-after-text farm_popup_avaliable'>
              <span className='buy_popup_tips'>
                <FormattedMessage id='buyPopup4' />
                <svg
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
                </svg>
              </span>
              <span className='buy_popup_tips_value'>0.003 HT</span>
            </p>
            <p className='buy_popup_corner_tips'>
              <FormattedMessage id='buyPopup7' />
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default injectIntl(BuyCoinPopup)
