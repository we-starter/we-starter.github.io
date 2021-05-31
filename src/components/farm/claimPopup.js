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
    <div style={{ paddingTop: '30px' }}>
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
      {farmPools.rewards2 && (
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
