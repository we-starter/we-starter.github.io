import React, { useContext, useEffect, useState } from 'react'
import { usage } from 'browserslist'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { getRandomIntInclusive } from '../../utils/index'
import { Select } from 'antd'
import { useBalance } from '../../pages/Hooks'
import Web3 from 'web3'
// 处理格式 千位符
import { formatNumber } from 'accounting'
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
import {GAS_FEE} from "../../web3/address";

const UnstakePopup = (props) => {
  const { intl, icon, onClose, pool } = props
  const farmPools = pool
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState(0)

  // const { balance = 0 } = useBalance(farmPools && farmPools.address)

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
    // let max = balance
    // setAmount(formatAmount(max, farmPools && farmPools.decimal, 6))
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
    if (!active) {
      return false
    }
    if (!(farmPools && farmPools.balanceOf)) {
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
    <div style={{ paddingTop: '30px' }}>
      <p className='form-app__inputbox-after-text farm_popup_avaliable'>
        <FormattedMessage id='farm12' />
        <span>
          {farmPools &&
          farmPools.balanceOf &&
          farmPools.name !== 'WAR POOL (DAO)'
            ? formatNumber(farmPools.balanceOf, {
                thousand: ',',
                decimal: '.',
                precision: farmPools.balanceOf - 0 > 0 ? 6 : 0,
              }) +
              ' ' +
              farmPools.rewards
            : farmPools &&
              farmPools.balanceOf &&
              farmPools.name === 'WAR POOL (DAO)'
            ? formatNumber(farmPools.balanceOf, {
                thousand: ',',
                decimal: '.',
                precision: farmPools.balanceOf - 0 > 0 ? 4 : 0,
              }) +
              ' ' +
              farmPools.rewards
            : '--'}
        </span>
      </p>

      <div className='deposit__inputbox form-app__inputbox'>
        <div className='form-app__inputbox-control'>
          <div className='form-app__inputbox-input'>
            <input
              value={
                (farmPools && farmPools.name === 'WAR POOL (DAO)'
                  ? splitFormat(farmPools.balanceOf, 4)
                  : farmPools.balanceOf) || ''
              }
              onChange={onChange}
              className='input'
              disabled
              placeholder={intl.formatMessage({
                id: 'farm15',
              })}
            />
          </div>

          {/* <div className='form-app__inputbox-up' onClick={onMax}>
            <div className='form-app__inputbox-up-pref'>
              <FormattedMessage id='poolText19' />
            </div>
          </div> */}
        </div>
      </div>

      <div className='form-app__submit form-app__submit--row margin-b-20'>
        <button
          type='button'
          className='btn btn--medium compound_claim'
          onClick={onConfirmAll}
        >
          <FormattedMessage id='farm5' />
        </button>
      </div>
      {
        !(farmPools && farmPools.address === '0x777d69a99fE220471f23e2643007f9d086B7d714' && Number(farmPools.earned) === 0 || !farmPools.earned) && (

          <p
            className='form-app__inputbox-after-text farm_popup_avaliable'
            style={{ marginTop: '20px' }}
          >
            <FormattedMessage
              id='farm6'
              values={{ coin: (farmPools && farmPools.rewards1) || '--' }}
            />
            <span>
          {farmPools && farmPools.earned && farmPools.name !== 'WAR POOL (DAO)'
            ? formatNumber(
              formatAmount(farmPools.earned, farmPools.decimal, 6),
              {
                thousand: ',',
                decimal: '.',
                precision: formatAmount(farmPools.earned) - 0 > 0 ? 6 : 0,
              }
            ) +
            ' ' +
            farmPools.rewards1
            : farmPools &&
            farmPools.earned &&
            farmPools.name === 'WAR POOL (DAO)'
              ? formatNumber(
                formatAmount(farmPools.earned, farmPools.decimal, 4),
                {
                  thousand: ',',
                  decimal: '.',
                  precision: formatAmount(farmPools.earned) - 0 > 0 ? 4 : 0,
                }
              )
              : '--'}
        </span>
          </p>
        )
      }

      {farmPools.rewards2 && (
        <p className='form-app__inputbox-after-text farm_popup_avaliable'>
          <FormattedMessage
            id='farm6'
            values={{ coin: (farmPools && farmPools.rewards2) || '--' }}
          />
          <span>
            {farmPools && farmPools.earned2
              ? formatNumber(
                  formatAmount(farmPools.earned2, farmPools.decimal, 6),
                  formatAmount(farmPools.earned2) - 0 > 0 ? 6 : 0
                ) +
                ' ' +
                farmPools.rewards2
              : '--'}
          </span>
        </p>
      )}
    </div>
  )
}

export default injectIntl(UnstakePopup)
