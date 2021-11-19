import React, { useContext, useEffect, useState } from 'react'
import { usage } from 'browserslist'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import cs from 'classnames'
import { Modal, message, Button } from 'antd'
import Web3 from 'web3'
import { GAS_FEE, voteMain } from '../../web3/address'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'
import { mainContext } from '../../reducer'

const ApplicationClaimPopup = (props) => {
  const { intl, onClose, voteDate, usersData, visible, getUser } = props
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
   const [loadFlag, setLoadFlag] = useState(false)

  const onConfirm = (e) => {
    if (!active) {
      return false
    }
    if (
      !(voteDate && voteDate.isClaim) ||
      !(usersData && usersData.totalVote && !usersData.claimed)
    ) {
      return false
    }
    if (loadFlag) return
    setLoadFlag(true)
    const contract = getContract(library, voteMain.abi, voteMain.address)
    contract.methods
      .claim(voteDate.ProjectId)
      .send({
        from: account,
        ...GAS_FEE(chainId),
      })
      .on('transactionHash', (hash) => {})
      .on('receipt', (_, receipt) => {
        message.success('Claim Success')
        setLoadFlag(false)
        onClose()
        getUser()
      })
      .on('error', (err, receipt) => {
        console.log('claim error', err)
        setLoadFlag(false)
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
            {voteDate && voteDate.isClaim && !usersData.claimed
              ? formatAmount(usersData.totalVote, 18, 6)
              : '0'}{' '}
            WAR
          </span>
        </p>

        <div className='form-app__submit form-app__submit--row'>
          <Button
            type='primary'
            className={cs('ant-btn-primary_' + 128, 'vote_popup_btn')}
            onClick={onConfirm}
            loading={loadFlag}
          >
            <FormattedMessage id='poolsDetailText5' />
          </Button>
          {/* <button
            type='button'
            className='btn btn--medium compound_claim vote_popup_btn'
            onClick={onConfirm}
          >
            <FormattedMessage id='poolsDetailText5' />
          </button> */}
        </div>
      </div>
    </Modal>
  )
}

export default injectIntl(ApplicationClaimPopup)
