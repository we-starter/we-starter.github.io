import React, { useContext, useEffect, useState } from 'react'
import { usage } from 'browserslist'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { getRandomIntInclusive } from '../../utils/index'
import { Modal, message } from 'antd'
import Web3 from 'web3'
import { GAS_FEE, voteMain } from '../../web3/address'
// 处理格式 千位符
import { formatNumber } from 'accounting'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import ERC20 from '../../web3/abi/ERC20.json'
import { FormattedMessage } from 'react-intl'
import { mainContext } from '../../reducer'
import BigNumber from 'bignumber.js'

const ApplicationClaimPopup = (props) => {
  const { intl, onClose, propID, usersData, visible } = props
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)

  const onConfirm = (e) => {
    if (!active) {
      return false
    }
    if (
      !(usersData && usersData.claimed) ||
      !(usersData && usersData.totalVote)
    ) {
      return false
    }
    const contract = getContract(library, voteMain.abi, voteMain.address)
    contract.methods
      .claim(propID)
      .send({
        from: account,
        ...GAS_FEE(chainId),
      })
      .on('transactionHash', (hash) => {})
      .on('receipt', (_, receipt) => {
        message.success('Claim Success')
        onClose()
      })
      .on('error', (err, receipt) => {
        console.log('claim error', err)
      })
  }
  return (
    <Modal
      style={{ paddingBottom: '0', top: '40%' }}
      title='Claim'
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        <p className='form-app__inputbox-after-text farm_popup_avaliable'>
          <FormattedMessage id='farm6' values={{ coin: 'WAR' }} />
          <span>
            {usersData && usersData.claimed ? usersData.totalVote : '0'} WAR
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
