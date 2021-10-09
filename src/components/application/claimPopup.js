import React, { useContext, useEffect, useState } from 'react'
import { usage } from 'browserslist'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { getRandomIntInclusive } from '../../utils/index'
import { Modal } from 'antd'
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
import { GAS_FEE } from "../../web3/address";

const ApplicationClaimPopup = (props) => {
  const { intl, icon, onClose, pool, visible } = props
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
    <Modal style={{ paddingBottom: '0', top: '40%' }} title='Claim' visible={visible} onCancel={onClose} footer={null}>
      <div>
        <p className='form-app__inputbox-after-text farm_popup_avaliable'>
          <FormattedMessage
            id='farm6'
            values={{ coin: 'WAR' }}
          />
          <span>
            {'--'}
          </span>
        </p>

        <div className='form-app__submit form-app__submit--row'>
          <button
            type='button'
            className='btn btn--medium compound_claim vote_popup_btn'
            onClick={onConfirm}
          >
            <FormattedMessage id='poolsDetailText5' />
          </button>
        </div>
      </div>
    </Modal>
    
  )
}

export default injectIntl(ApplicationClaimPopup)
