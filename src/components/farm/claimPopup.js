import React, { useContext, useEffect, useState } from 'react'
import { usage } from 'browserslist'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { getRandomIntInclusive } from '../../utils/index'
import { Select } from 'antd'
import { useBalance } from '../../pages/Hooks'
import { getPointAddress } from '../../web3/address'
import Web3 from 'web3'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import ERC20 from '../../web3/abi/ERC20.json'
import { FormattedMessage } from 'react-intl'

import {
  HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_TRANSACTION_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  waitingForInit,
  waitingPending,
} from '../../const'
import { mainContext } from '../../reducer'
import BigNumber from 'bignumber.js'

const ClaimPopup = (props) => {
  const { intl, icon, onClose, pool } = props
  const farmPools = pool
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState(0)

  const { balance = 0 } = useBalance(farmPools && farmPools.address)

  useEffect(() => {
    const gas_limit = new BigNumber('1006182')
    const gas_price = new BigNumber(
      Web3.utils.toWei(`${getRandomIntInclusive(5, 20)}`, 'gwei')
    )
    const _fee = gas_limit.multipliedBy(gas_price).toString()
    setFee(_fee)
  }, [])

  const onMax = () => {
    return
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

  const onConfirmAll = (e) => {
    if (!farmPools && farmPools.balanceOf) {
      return false
    }
    if (isNaN(parseInt(farmPools && farmPools.balanceOf))) {
      return false
    }
    const contract = getContract(library, farmPools.abi, farmPools.address)
    contract.methods
      .exit()
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
        onClose()
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

  const onConfirm = (e) => {
    if (!farmPools && farmPools.balanceOf) {
      return false
    }
    if (isNaN(parseInt(farmPools && farmPools.balanceOf))) {
      return false
    }
    const contract = getContract(library, farmPools.abi, farmPools.address)
    contract.methods
      .getDoubleReward()
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
        onClose()
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
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app farm_popup' action='/'>
          <div className='form-app__inner deposit'>
            <h1 className='form-app__title h1' style={{ marginTop: 0 }}>
              <FormattedMessage id='farm16' />
              <a className='farm_popup_close_btn' onClick={onClose}></a>
            </h1>
            <p className='form-app__inputbox-after-text farm_popup_avaliable'>
              <FormattedMessage id='farm12' />
              <span>
                {farmPools && farmPools.balanceOf
                  ? farmPools.balanceOf + ' ' + farmPools.rewards
                  : '--'}
              </span>
            </p>

            <div className='deposit__inputbox form-app__inputbox'>
              <div className='form-app__inputbox-control'>
                <div className='form-app__inputbox-input'>
                  <input
                    value={(farmPools && farmPools.balanceOf) || 0}
                    onChange={onChange}
                    className='input'
                    disabled
                    placeholder={intl.formatMessage({
                      id: 'farm15',
                    })}
                  />
                </div>

                <div className='form-app__inputbox-up' onClick={onMax}>
                  <div className='form-app__inputbox-up-pref'>
                    <FormattedMessage id='poolText19' />
                  </div>
                </div>
              </div>
            </div>

            <div className='form-app__submit form-app__submit--row'>
              <button
                type='button'
                className='btn btn--medium'
                onClick={onConfirmAll}
              >
                <FormattedMessage id='farm5' />
              </button>
            </div>
            <p className='form-app__inputbox-after-text farm_popup_avaliable'>
              <FormattedMessage
                id='farm6'
                values={{ coin: farmPools && farmPools.rewards1 }}
              />
              <span>
                {farmPools && farmPools.earned
                  ? formatAmount(farmPools.earned) + ' ' + farmPools.rewards1
                  : '--'}
              </span>
            </p>
            <p className='form-app__inputbox-after-text farm_popup_avaliable'>
              <FormattedMessage
                id='farm6'
                values={{ coin: farmPools && farmPools.rewards2 }}
              />
              <span>
                {farmPools && farmPools.earned2
                  ? formatAmount(farmPools.earned2) + ' ' + farmPools.rewards2
                  : '--'}
              </span>
            </p>
            <div className='form-app__submit form-app__submit--row'>
              <button
                type='button'
                className='btn btn--medium compound_claim'
                onClick={onConfirm}
              >
                <FormattedMessage id='farm7' />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default injectIntl(ClaimPopup)
