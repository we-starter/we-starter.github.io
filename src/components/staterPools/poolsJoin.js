import React, { useContext, useEffect, useState } from 'react'
import { usage } from 'browserslist'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { getRandomIntInclusive } from '../../utils/index'
import { Select } from 'antd'
import cs from 'classnames'
import { Button } from 'antd'
import { useBalance, useAllowance } from '../../pages/Hooks'
import Web3 from 'web3'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import ERC20 from '../../web3/abi/ERC20.json'
import { FormattedMessage } from 'react-intl'

import {
  HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_SUCCESS_TRANSACTION_MODAL,
  HANDLE_SHOW_APPROVE_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  waitingForInit,
  waitingPending,
} from '../../const'
import { mainContext } from '../../reducer'
import BigNumber from 'bignumber.js'

const { Option } = Select

const PoolsJoin = (props) => {
  const { intl, icon, onClose, pool } = props
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
  const [approve, setApprove] = useState(true)
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState(0)
  const [loadFlag, setLoadFlag] = useState(false)

  const currency_address = pool ? pool.currency.address : '0x0'
  const { balance = 0 } = useBalance(currency_address, pool.networkId)
  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  useEffect(() => {
    const gas_limit = new BigNumber('1006182')
    const gas_price = new BigNumber(
      Web3.utils.toWei(`${getRandomIntInclusive(5, 20)}`, 'gwei')
    )
    const _fee = gas_limit.multipliedBy(gas_price).toString()
    setFee(_fee)
  }, [])

  useEffect(() => {
    if (pool && (pool.currency.allowance > 0 || pool.currency.is_ht)) {
      setApprove(false)
    }
  }, [pool])

  const onMax = () => {
    let max = balance
    const maxB = new BigNumber(max)
    const balanceB = new BigNumber(balance)
    const quotaOfB = new BigNumber(pool.quotaOf)
    if (pool.type === 1 && quotaOfB.lt(balanceB)) {
      max = pool.quotaOf
    }

    if (pool.currency.is_ht && max == balance) {
      // 如果是ht,留部分手续费
      const feeB = new BigNumber(fee)
      max = maxB.gt(feeB) ? maxB.minus(feeB).toString() : 0
      // if(pool.type === 1) {
      //   // offering 合约
      //   const pool_contract = getContract(library, Offering, pool.address)
      //   fee = await pool_contract.methods.offerHT().estimateGas({
      //     from: account,
      //     value: Web3.utils.toWei(`${amount}`, 'ether'),
      //   })
      // }else{
      //   // starter合约
      //   const pool_contract = getContract(library, Starter, pool.address)
      //   const _amount = numToWei(amount, pool.currency.decimal)
      //   fee = await pool_contract.methods.purchaseHT().estimateGas({
      //         from: account,
      //         value: _amount
      //   })
      // }
    }

    setAmount(formatAmount(max, pool.currency.decimal, 6))
    // setAmount(new BigNumber(Web3.utils.fromWei(max, 'ether')).toFixed(6, 1) * 1)
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
    const contract = getContract(library, ERC20.abi, pool.currency.address)
    contract.methods
      .approve(
        pool.address,
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
    if (loadFlag) return
    setLoadFlag(true)
    if (pool.type === 1) {
      const pool_contract = getContract(library, pool.abi, pool.address)
      if (pool.currency.is_ht) {
        pool_contract.methods
          .offerHT()
          .send({
            from: account,
            value: Web3.utils.toWei(`${amount}`, 'ether'),
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
      } else {
        pool_contract.methods
          .offer(Web3.utils.toWei(`${amount}`, 'ether'))
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
    } else {
      const pool_contract = getContract(library, pool.abi, pool.address)
      const _amount = numToWei(amount, pool.currency.decimal)

      if (pool.currency.is_ht) {
        pool_contract.methods
          .purchaseHT()
          .send({
            from: account,
            value: _amount,
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
      } else {
        pool_contract.methods
          .purchase(_amount)
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
    }
  }

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div
            className='form-app__inner deposit'
            style={{ position: 'relative' }}
          >
            <h1
              className='form-app__title h3'
              style={{
                marginTop: 0,
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FormattedMessage id='poolText16' />
              {pool && pool.underlying.symbol}
              <FormattedMessage id='poolText17' />
              <a className='farm_popup_close_btn' onClick={onClose}></a>
            </h1>
            
            <p className={cs(`form-app__tip ${pool && 'form-app__tip_' + pool.networkId }`)}>{pool && pool.ratio}</p>
            {/*<Select*/}
            {/*  defaultValue='lucy'*/}
            {/*  style={{ width: 120 }}*/}
            {/*  onChange={handleChange}*/}
            {/*>*/}
            {/*  <Option value='jack'>*/}
            {/*    /!* <GLFIcon width={24} height={24} />*/}
            {/*    {icon} *!/*/}
            {/*    Jack*/}
            {/*  </Option>*/}
            {/*  <Option value='lucy'>Lucy</Option>*/}
            {/*  <Option value='Yiminghe'>yiminghe</Option>*/}
            {/*</Select>*/}
            <p
              className='form-app__inputbox-after-text'
              style={{
                marginBottom: 0,
                color: '#22292F',
                textAlign: 'left',
                opacity: 1,
              }}
            >
              <FormattedMessage id='poolText18' />
              {balance &&
                pool &&
                `${formatAmount(balance)} ${pool.currency.symbol}`}
              <br />
            </p>
            {pool && pool.type === 1 && (
              <p
                className='form-app__inputbox-after-text'
                style={{
                  marginBottom: 0,
                  color: '#22292F',
                  textAlign: 'left',
                  opacity: 1,
                }}
              >
                <FormattedMessage id='poolText23' />
                {pool &&
                  pool.type === 1 &&
                  pool.quotaOf > 0 &&
                  `${formatAmount(pool.quotaOf)} ${pool.currency.symbol}`}
                <br />
              </p>
            )}

            <div className='deposit__inputbox form-app__inputbox'>
              <div className='form-app__inputbox-control'>
                <div className='form-app__inputbox-input'>
                  <input
                    value={amount}
                    onChange={onChange}
                    className='input'
                    placeholder={intl.formatMessage({
                      id: 'money',
                    })}
                  />
                </div>

                <div className={cs(
                  `form-app__inputbox-up ${
                  pool && 'form-app__inputbox-up_' + pool.networkId
                  }`
                )} onClick={onMax}>
                  <div className={cs(
                    `form-app__inputbox-up-pref ${
                    pool &&
                    'form-app__inputbox-up-pref_' + pool.networkId
                    }`
                  )}>
                    <FormattedMessage id='poolText19' />
                  </div>
                </div>
              </div>
            </div>

            <div className='form-app__submit form-app__submit--row'>
              {approve ? (
                <Button type='primary' className={cs(pool && 'ant-btn-primary_' + pool.networkId )} onClick={onApprove} loading={loadFlag}>
                  <FormattedMessage id='poolText21' />
                </Button>
              ) : (
                <Button type='primary' className={cs(pool && 'ant-btn-primary_' + pool.networkId)} onClick={onConfirm} loading={loadFlag}>
                  <FormattedMessage id='poolText22' />
                </Button>
              )}
            </div>
            {pool && pool.LPTLink && (
              <a
                className='lpt_link'
                href='https://ht.mdex.com/#/add/HT/0x910651F81a605a6Ef35d05527d24A72fecef8bF0'
                target='_black'
              >
                <FormattedMessage id='farm13' /> WAR-HT LPT(MDEX LP Token)
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default injectIntl(PoolsJoin)
