import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { formatAmount, numToWei, splitFormat } from '../../utils/format'
import { getRandomIntInclusive } from '../../utils/index'
import { useBalance } from '../../pages/Hooks'
import { getPointAddress } from '../../web3/address'
import Web3 from 'web3'
import { getContract, useActiveWeb3React } from '../../web3'
import { injectIntl } from 'react-intl'
import ERC20 from '../../web3/abi/ERC20.json'
import { FormattedMessage } from 'react-intl'

import { mainContext } from '../../reducer'
import BigNumber from 'bignumber.js'

const BuyCoinPopup = (props) => {
  const { intl, icon, onClose, pool } = props
  const farmPools = pool
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState(0)
  const [tabFlag, setTabFlag] = useState('HT')

  const { balance = 0 } = useBalance(farmPools && farmPools.address)

  useEffect(() => {
    const gas_limit = new BigNumber('1006182')
    const gas_price = new BigNumber(
      Web3.utils.toWei(`${getRandomIntInclusive(5, 20)}`, 'gwei')
    )
    const _fee = gas_limit.multipliedBy(gas_price).toString()
    setFee(_fee)
  }, [])

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

  const onConfirmSwap = (e) => {
    if (!active) {
      return false
    }
    if (!(farmPools && farmPools.balanceOf)) {
      return false
    }
    if (isNaN(parseInt(farmPools && farmPools.balanceOf))) {
      return false
    }
  }

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app farm_popup' action='/'>
          <div className='form-app__inner deposit farm_popup_box'>
            <div className='farm_popup_tab_box'>
              <div>
                <a
                  className={cs(
                    'farm_popup_tab',
                    tabFlag === 'HT' && 'farm_popup_tab_active'
                  )}
                  onClick={() => {
                    setTabFlag('HT')
                  }}
                >
                  <FormattedMessage id='farm3' />
                </a>
                <a
                  className={cs(
                    'farm_popup_tab',
                    tabFlag === 'USDT' && 'farm_popup_tab_active'
                  )}
                  onClick={() => {
                    setTabFlag('USDT')
                  }}
                >
                  <FormattedMessage id='farm16' />
                </a>
              </div>
              <a className='farm_popup_close_btn' onClick={onClose}></a>
            </div>
            <div style={{ paddingTop: '30px' }}>
              <p className='form-app__inputbox-after-text farm_popup_avaliable'>
                <FormattedMessage id='farm12' />
                <span>
                  {farmPools && farmPools.balanceOf
                    ? farmPools.balanceOf + ' ' + farmPools.rewards
                    : '--'}
                </span>
              </p>

              <div className='deposit__inputbox form-app__inputbox'>
                <div className='form-app__inputbox-control'>
                  <div className='form-app__inputbox-input'>
                    <input
                      value={(farmPools && farmPools.balanceOf) || ''}
                      onChange={onChange}
                      className='input'
                      disabled
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

              <div className='form-app__submit form-app__submit--row'>
                <button
                  type='button'
                  className='btn btn--medium compound_claim'
                  onClick={onConfirmSwap}
                >
                  <FormattedMessage id='farm5' />
                </button>
              </div>
              <p
                className='form-app__inputbox-after-text farm_popup_avaliable'
                style={{ marginTop: '20px' }}
              >
                <FormattedMessage
                  id='farm6'
                  values={{ coin: (farmPools && farmPools.rewards1) || '--' }}
                />
                <span>
                  {farmPools && farmPools.earned
                    ? formatAmount(farmPools.earned) + ' ' + farmPools.rewards1
                    : '--'}
                </span>
              </p>
              <p className='form-app__inputbox-after-text farm_popup_avaliable'>
                <FormattedMessage
                  id='farm6'
                  values={{ coin: (farmPools && farmPools.rewards2) || '--' }}
                />
                <span>
                  {farmPools && farmPools.earned2
                    ? formatAmount(farmPools.earned2) + ' ' + farmPools.rewards2
                    : '--'}
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default injectIntl(BuyCoinPopup)
