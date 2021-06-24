import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { Button, message } from 'antd'
import { WAR_ADDRESS } from '../../web3/address'
import { getContract, useActiveWeb3React } from '../../web3'
import { mainContext } from '../../reducer'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatAmount, fromWei, numToWei } from '../../utils/format'
import { useAllowance, useBalance } from '../../pages/Hooks'
import Web3 from 'web3'
import {
  HANDLE_WALLET_MODAL
} from '../../const'
import { getRandomIntInclusive } from '../../utils/index'
import WAR from '../../assets/icon/WAR@2x.png'
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import SwapLine from '../../assets/icon/swap-line@2x.png'

const BridgeCard = (props) => {

  const { intl } = props

  const { account, active, library, chainId } = useActiveWeb3React()

  const [amount, setAmount] = useState('')
  const [approve, setApprove] = useState(true)
  const { balance } = useBalance(WAR_ADDRESS(chainId))
  const address = ''
  const abi = null

  const { dispatch, state } = useContext(mainContext)

  const { slippageVal } = state

  const allowance = useAllowance(
    WAR_ADDRESS(chainId),
    address,
    account
  )

  useEffect(() => {
    if (allowance > 0) {
      setApprove(false)
    }
  }, [allowance])

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

  const onMax = async () => {
    if (balance <= 0) {
      setAmount(0)
      return false
    }

    let max = balance
    const maxB = new BigNumber(max)
    const contract = getContract(library, abi, address)

    let gas_fee = 0
    try {
      // 估算一下gas费
      const strapOut = await contract.methods
        .getStrapOut(max)
        .call({ from: account })
      let minOut = new BigNumber(strapOut)
        .multipliedBy(
          new BigNumber(100)
            .minus(new BigNumber(slippageVal))
            .dividedBy(new BigNumber(100))
        )
        .toFixed(0, 1)
        .toString()
      const gas_limit = await contract.methods.strap(minOut).estimateGas({
        from: account,
        value: max,
      })
      const gas_price = Web3.utils.toWei('100', 'gwei')
      gas_fee = new BigNumber(gas_limit).multipliedBy(
        new BigNumber(gas_price)
      )
    } catch (e) {
      const gas_limit = new BigNumber('1006182')
      const gas_price = new BigNumber(Web3.utils.toWei(`${getRandomIntInclusive(5, 20)}`, 'gwei'))
      gas_fee = gas_limit.multipliedBy(gas_price).toString()
    }


    max = maxB.gt(gas_fee) ? maxB.minus(gas_fee).toString() : 0

    setAmount(formatAmount(max, 18, 6))
  }

  const onApprove = () => {}


    return (
      <div className='bridge_card'>
        <div className='bridge_card_title'>
          <FormattedMessage id='bridge1' />
        </div>
        <div className='deposit__inputbox form-app__inputbox'>
          <div className='form-app__inputbox-control'>
            <div className='form-app__inputbox-input'>
              <input
                style={{ background: '#fff' }}
                value={amount}
                onChange={onChange}
                className='input'
                placeholder={intl.formatMessage({
                  id: 'money',
                })}
              />
            </div>

            <div className='form-app__inputbox-up' onClick={onMax}>
              <div className='form-app__inputbox-up-pref'>
                <FormattedMessage id='poolText19' />
              </div>
            </div>
            {/* 选择币种 */}
            <a className='set_slippage'>
              <img src={WAR} />
              WAR
            </a>
          </div>
        </div>
        <div className='bridge_card_from_to'>
          <div className='bridge_card_from'>
            <p className='bridge_card_from_text'><FormattedMessage id='bridge7' /></p>
            <p className='bridge_card_from_chain'>
              <img src={HECO} />
              Heco
            </p>
          </div>
          <img className='bridge_card_transform' src={SwapLine} />
          <div className='bridge_card_from'>
            <p className='bridge_card_from_text'><FormattedMessage id='bridge8' /></p>
            <p className='bridge_card_from_chain'>
              <img src={BSC} />
              Binance Smart Chain
            </p>
          </div>
        </div>
        <p className='bridge_card_input_title'><FormattedMessage id='bridge2' /></p>
        <div className='deposit__inputbox form-app__inputbox'>
          <div className='form-app__inputbox-control'>
            <div className='form-app__inputbox-input'>
              <input
                style={{ background: '#fff' }}
                disabled='disabled'
                className='input'
                placeholder={account}
              />
            </div>

            {/* 地址跳转 */}
            <a className='set_slippage copy_address'>
              <svg
                t='1619095072712'
                className='icon'
                viewBox='0 0 1024 1024'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                p-id='1281'
                width='20'
                height='20'
              >
                <path
                  d='M424.96 128v87.04H215.04v599.04h599.04v-215.04h87.04v256c0 25.6-20.48 40.96-40.96 40.96H168.96c-25.6 0-40.96-20.48-40.96-40.96V168.96c0-25.6 20.48-40.96 40.96-40.96h256z m327.68 87.04h-194.56V128h343.04v343.04h-87.04V271.36L512 573.44 450.56 512l302.08-296.96z'
                  p-id='1282'
                ></path>
              </svg>
            </a>
          </div>
        </div>

        {approve && (
          <Button
            className={'btn'}
            type='button'
            onClick={onApprove}
          >
            <FormattedMessage id='farm20' />
          </Button>
        )}
        {!approve && (
          <Button
            className={'btn'}
            type='button'
            onClick={() => {
              dispatch({
                type: HANDLE_WALLET_MODAL,
                walletModal: 'switchWithdraw',
              })
            }}
          >
            <FormattedMessage id='modalsText15' />
          </Button>
        )}
        <div className='lbp_tip'>
          <p>
            <FormattedMessage id='bridge3' />
          </p>
          <p>
            <FormattedMessage id='bridge4' />
          </p>
        </div>
      </div>
    )
}

export default injectIntl(BridgeCard)
