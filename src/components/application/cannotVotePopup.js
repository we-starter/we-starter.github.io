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

const CannotVotePopup = (props) => {
  const { intl, icon, onClose, pool, visible } = props
  const farmPools = pool
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)

  return (
    <Modal style={{ paddingBottom: '0', top: '40%' }} visible={visible} closable={false} footer={null}>
      <div className='vote_popup'>
        <img src={require('../../assets/icon/application/vote-tip.png')} />
        <p className='vote_popup_title'>
          该地址身份为提案发起人，不可以参与投票
        </p>

        <a
          className='vote_popup_btn'
          onClick={onClose}
        >
          <FormattedMessage id='poolsDetailText5' />
        </a>
      </div>
    </Modal>

  )
}

export default injectIntl(CannotVotePopup)
