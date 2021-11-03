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

const ClaimPopup = (props) => {
  const { intl, icon, onClose, pool } = props
  const farmPools = pool
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)

  const onConfirm = (e) => {
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
    const method = pool.rewards2 ? 'getDoubleReward' : 'getReward'
    contract.methods[method]()
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
      {
        !(farmPools && farmPools.address === '0x777d69a99fE220471f23e2643007f9d086B7d714' && Number(farmPools.earned) === 0 || !farmPools.earned) && (
          <p className='form-app__inputbox-after-text farm_popup_avaliable'>
            <FormattedMessage
              id='farm6'
              values={{ coin: farmPools && farmPools.rewards1 }}
            />
            <span>
          {farmPools && farmPools.earned
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
            : '--'}
        </span>
          </p>)
      }
      {farmPools.rewards2 && (
        <p className='form-app__inputbox-after-text farm_popup_avaliable'>
          <FormattedMessage
            id='farm6'
            values={{ coin: farmPools && farmPools.rewards2 }}
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
  )
}

export default injectIntl(ClaimPopup)
