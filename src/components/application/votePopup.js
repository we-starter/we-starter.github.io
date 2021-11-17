import React, { useContext, useEffect, useState, useMemo } from 'react'
import { usage } from 'browserslist'
import cs from 'classnames'
import { formatAmount, numToWei } from '../../utils/format'
import { Button, Modal, message } from 'antd'
import { useBalance, useAllowance } from '../../pages/Hooks'
import Web3 from 'web3'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import ERC20 from '../../web3/abi/ERC20.json'
import { WAR_ADDRESS, ChainId, GAS_FEE, voteMain } from '../../web3/address'
// 处理格式 千位符
import { formatNumber } from 'accounting'
import { FormattedMessage } from 'react-intl'
import { mainContext } from '../../reducer'
import BigNumber from 'bignumber.js'

const VotePopup = (props) => {
  const { intl, onClose, propID, visible } = props
  const { account, active, library, chainId } = useActiveWeb3React()
  const allowance = useAllowance(
    WAR_ADDRESS(ChainId.HECO),
    voteMain.address,
    account,
    ChainId.HECO
  )
  const { dispatch, state } = useContext(mainContext)
  const [approve, setApprove] = useState(true)
  const [amount, setAmount] = useState('')
  const [loadFlag, setLoadFlag] = useState(false)

  const { balance = 0 } = useBalance(WAR_ADDRESS(ChainId.HECO), ChainId.HECO)

  useEffect(() => {
    if (allowance > 0) {
      setApprove(false)
    }
  }, [allowance])


  const onMax = () => {
    let max = formatAmount(balance, 18, 6)
    setAmount(max)
  }

  const onChange = (e) => {
    const { value } = e.target
    const re = /^[0-9]+([.|,][0-9]+)?$/g
    if (
      value === '' ||
      re.test(value) ||
      (value.split('.').length === 2 && value.slice(value.length - 1) === '.')
    ) {
      let v = value
      setAmount(v)
    }
  }

  const onApprove = (e) => {
    if (!active) {
      return false
    }
    if (loadFlag) return
    setLoadFlag(true)
    const contract = getContract(library, ERC20.abi, WAR_ADDRESS(chainId))
    contract.methods
      .approve(
        voteMain.address,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', (_, receipt) => {
        message.success('Approve Success')
        setLoadFlag(false)
        setApprove(false)
      })
      .on('error', (err, receipt) => {
        console.log('approve error', err)
        setLoadFlag(false)
      })
  }

  const onConfirm = (e) => {
    if (!active) {
      return false
    }
    if (!(amount - 0) || formatAmount(balance) < amount) {
      return false
    }
    if (isNaN(parseInt(amount))) {
      return false
    }
    if (loadFlag) return
    setLoadFlag(true)
    const pool_contract = getContract(library, voteMain.abi, voteMain.address)
    pool_contract.methods
      .vote(propID, 1, Web3.utils.toWei(`${amount}`, 'ether'))
      .send({
        from: account,
        ...GAS_FEE(chainId),
      })
      .on('receipt', (_, receipt) => {
        message.success('Success')
        setLoadFlag(false)
        onClose()
      })
      .on('error', (err, receipt) => {
        console.log('error', err)
        setLoadFlag(false)
      })
  }

  return (
    <Modal
      style={{ paddingBottom: '0', top: '40%' }}
      title='Vote'
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        <p className='form-app__inputbox-after-text farm_popup_avaliable'>
          <FormattedMessage id='farm4' />
          <span>{balance && formatAmount(balance)} WAR</span>
        </p>

        <div className='deposit__inputbox form-app__inputbox'>
          <div className='form-app__inputbox-control'>
            <div className='form-app__inputbox-input'>
              <input
                value={amount}
                onChange={onChange}
                className='input'
                placeholder={intl.formatMessage({
                  id: 'farm15',
                })}
              />
            </div>

            <div
              className={cs(
                `form-app__inputbox-up ${'form-app__inputbox-up_' + 128}`
              )}
              onClick={onMax}
            >
              <div
                className={cs(
                  `form-app__inputbox-up-pref ${
                    ('form-app__inputbox-up-pref_' + 128, 'vote_popup_onMax')
                  }`
                )}
              >
                <FormattedMessage id='poolText19' />
              </div>
            </div>
          </div>
        </div>
        <div className='form-app__submit form-app__submit--row'>
          {approve && (
            <Button
              type='primary'
              className={cs('ant-btn-primary_' + 128, 'vote_popup_btn')}
              onClick={onApprove}
              loading={loadFlag}
            >
              <FormattedMessage id='farm20' />
            </Button>
          )}

          {!approve && (
            <Button
              type='primary'
              className={cs('ant-btn-primary_' + 128, 'vote_popup_btn')}
              onClick={onConfirm}
              loading={loadFlag}
            >
              <FormattedMessage id='workShopText5' />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default injectIntl(VotePopup)
