import React, { useContext, useEffect, useState } from 'react'
import { usage } from 'browserslist'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { getRandomIntInclusive } from '../../utils/index'
import { Button } from 'antd'
import { useBalance } from '../../pages/Hooks'
import { getPointAddress } from '../../web3/address'
import Web3 from 'web3'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import ERC20 from '../../web3/abi/ERC20.json'
import { FormattedMessage } from 'react-intl'
import { useFarmInfo } from '../../pages/pools/Hooks'
import {
  HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_TRANSACTION_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  waitingForInit,
  waitingPending,
} from '../../const'
import { mainContext } from '../../reducer'
import BigNumber from 'bignumber.js'

const DepositPopup = (props) => {
  const { intl, icon, onClose, pool } = props
  const farmPools = pool
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
  const [approve, setApprove] = useState(true)
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState(0)
  const [loadFlag, setLoadFlag] = useState(false)

  const { balance } = useBalance(farmPools && farmPools.MLP)

  useEffect(() => {
    const gas_limit = new BigNumber('1006182')
    const gas_price = new BigNumber(
      Web3.utils.toWei(`${getRandomIntInclusive(5, 20)}`, 'gwei')
    )
    const _fee = gas_limit.multipliedBy(gas_price).toString()
    setFee(_fee)
  }, [])

  useEffect(() => {
    if (farmPools && farmPools.allowance > 0) {
      setApprove(false)
    }
  }, [farmPools])

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

  const onApprove = (e) => {
    if (!amount) {
      return false
    }
    if (isNaN(parseInt(amount))) {
      return false
    }
    if (loadFlag) return
    setLoadFlag(true)
    const contract = getContract(library, ERC20.abi, farmPools.MLP)
    contract.methods
      .approve(
        farmPools.address,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      .send({
        from: account,
      })
      .on('receipt', (_, receipt) => {
        console.log('approve success')
        setLoadFlag(false)
        setApprove(false)
      })
      .on('error', (err, receipt) => {
        console.log('approve error', err)
        dispatch({
          type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
          showFailedTransactionModal: true,
        })
        dispatch({
          type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
          showWaitingWalletConfirmModal: waitingForInit,
        })
        setLoadFlag(false)
      })
  }

  const onConfirm = (e) => {
    if (!amount) {
      return false
    }
    if (isNaN(parseInt(amount))) {
      return false
    }
    if (loadFlag) return
    setLoadFlag(true)
    const pool_contract = getContract(library, farmPools.abi, farmPools.address)
    pool_contract.methods
      .stake(Web3.utils.toWei(`${amount}`, 'ether'))
      .send({
        from: account,
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
        setLoadFlag(false)
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
        setLoadFlag(false)
      })
  }

  return (
    <div style={{ paddingTop: '30px' }}>
      <p className='form-app__inputbox-after-text farm_popup_avaliable'>
        <FormattedMessage id='farm4' />
        <span>
          {farmPools ? formatAmount(balance) + ' ' + farmPools.rewards : '--'}
        </span>
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

          <div className='form-app__inputbox-up' onClick={onMax}>
            <div className='form-app__inputbox-up-pref'>
              <FormattedMessage id='poolText19' />
            </div>
          </div>
        </div>
      </div>
      <a
        className='farm_index_card_getMLP'
        href='https://ht.mdex.com/#/add/0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f/0x910651f81a605a6ef35d05527d24a72fecef8bf0'
        target='_black'
      >
        <FormattedMessage id='farm13' /> {farmPools && farmPools.name}(MDEX LP
        Token)
      </a>
      <div className='form-app__submit form-app__submit--row'>
        {approve && (
          <Button type='primary' onClick={onApprove} loading={loadFlag}>
            <FormattedMessage id='farm20' />
          </Button>
        )}

        {!approve && (
          <Button type='primary' onClick={onConfirm} loading={loadFlag}>
            <FormattedMessage id='farm3' />
          </Button>
        )}
      </div>
    </div>
  )
}

export default injectIntl(DepositPopup)
