import React, { useContext, useEffect, useState } from 'react'
import { usage } from 'browserslist'
import cs from 'classnames'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { getRandomIntInclusive } from '../../utils/index'
import { Button } from 'antd'
import { useBalance } from '../../pages/Hooks'
import Web3 from 'web3'
import { HANDLE_WALLET_MODAL } from '../../const'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import ERC20 from '../../web3/abi/ERC20.json'
// 处理格式 千位符
import { formatNumber } from 'accounting'
import { FormattedMessage } from 'react-intl'
import { useFarmInfo } from '../../pages/pools/Hooks'
import {
  HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_TRANSACTION_MODAL,
  HANDLE_SHOW_SUCCESS_TRANSACTION_MODAL,
  HANDLE_SHOW_APPROVE_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  waitingForInit,
  waitingPending,
  RANDOM_NUMBER,
} from '../../const'
import { mainContext } from '../../reducer'
import BigNumber from 'bignumber.js'

const DepositPopup = (props) => {
  const { intl, icon, onClose, pool } = props
  const [farmPools, setFarmPools] = useState(pool)
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const [approve, setApprove] = useState(true)
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState(0)
  const [loadFlag, setLoadFlag] = useState(false)
  const [nowTime, setNowTime] = useState(parseInt(Date.now() / 1000))

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
     setFarmPools(props.pool)
   }, [props])

useEffect(() => {
  const timerId = setTimeout(() => {
    const nowTime = parseInt(Date.now() / 1000)
    setNowTime(nowTime)
  }, 1000)
  return () => {
    clearTimeout(timerId)
  }
}, [nowTime])

  let disableBtn = false
  if (
    farmPools &&
    !farmPools.dueDate &&
    farmPools.openDate > nowTime
  ) {
    disableBtn = true
  }
    useEffect(() => {
      if (farmPools && farmPools.allowance > 0) {
        setApprove(false)
      }
    }, [farmPools, farmPools && farmPools.allowance, state.randomNumber])

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
    if (!active) {
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
         dispatch({
           type: RANDOM_NUMBER,
           randomNumber: Math.random(),
         })
        setLoadFlag(false)
        setApprove(false)
      })
      .on('error', (err, receipt) => {
        console.log('approve error', err)
        dispatch({
          type: HANDLE_SHOW_APPROVE_FAILED_TRANSACTION_MODAL,
          showApproveFailedTransactionModal: true,
        })
        dispatch({
          type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
          showWaitingWalletConfirmModal: waitingForInit,
        })
        setLoadFlag(false)
      })
  }

  const onConfirm = (e) => {
    if (!active) {
      return false
    }
    if (!amount) {
      return false
    }
    if (isNaN(parseInt(amount))) {
      return false
    }
    if (disableBtn) {
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
          type: HANDLE_SHOW_SUCCESS_TRANSACTION_MODAL,
          showSuccessTransactionModal: true,
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
          {farmPools && farmPools.name !== 'WAR POOL (DAO)'
            ? formatNumber(formatAmount(balance, farmPools.decimal, 6), {
                thousand: ',',
                decimal: '.',
                precision: formatAmount(balance) - 0 > 0 ? 6 : 0,
              }) +
              ' ' +
              farmPools.rewards
            : farmPools && farmPools.name === 'WAR POOL (DAO)'
            ? formatNumber(formatAmount(balance, farmPools.decimal, 4), {
                thousand: ',',
                decimal: '.',
                precision: formatAmount(balance) - 0 > 0 ? 4 : 0,
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
      {farmPools && farmPools.name !== 'WAR POOL (DAO)' && (
        <a
          className='farm_index_card_getMLP'
          href='https://ht.mdex.com/#/add/HT/0x910651F81a605a6Ef35d05527d24A72fecef8bF0'
          target='_black'
        >
          <FormattedMessage id='farm13' /> {farmPools && farmPools.name}(
          {farmPools && farmPools.lpToken})
        </a>
      )}
      {farmPools && farmPools.name === 'WAR POOL (DAO)' && (
        <a
          className='farm_index_card_getMLP'
          onClick={() => {
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'buyCoin',
            })
          }}
        >
          <FormattedMessage id='farm17' /> {farmPools.rewards}
        </a>
      )}
      <div className='form-app__submit form-app__submit--row'>
        {approve && (
          <Button type='primary' onClick={onApprove} loading={loadFlag}>
            <FormattedMessage id='farm20' />
          </Button>
        )}

        {!approve && (
          <Button
            type='primary'
            className={cs(disableBtn && 'disable_btn')}
            onClick={onConfirm}
            loading={loadFlag}
          >
            <FormattedMessage id='farm3' />
          </Button>
        )}
      </div>
    </div>
  )
}

export default injectIntl(DepositPopup)
