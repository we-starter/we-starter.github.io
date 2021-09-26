import React, { useContext, useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'
import { mainContext } from '../../reducer'
import { Button } from 'antd'
import { getContract, useActiveWeb3React } from '../../web3'
import { formatAmount } from '../../utils/format'
import cs from 'classnames'
import {GAS_FEE} from "../../web3/address";

const FarmPopupTabPopup = (props) => {
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const { onClose, pool } = props
  const [loadFlag, setLoadFlag] = useState(false)
  const farmPools = pool

  const onConfirm = () => {
    if (!active) {
      return false
    }
    if (!(farmPools && farmPools.earned * 1)) {
      return false
    }
    if (loadFlag) return
    setLoadFlag(true)
    const contract = getContract(library, farmPools.abi, farmPools.address)
    contract.methods
      .compound()
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', (_, receipt) => {
        console.log('compound success')
        setLoadFlag(false)
        onClose()
      })
      .on('error', (err, receipt) => {
        console.log('compound error', err)
        setLoadFlag(false)
      })
  }

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app farm_popup' action='/'>
          <div className='form-app__inner deposit'>
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
              <FormattedMessage
                id='farm22'
                values={{ icon: farmPools && farmPools.name }}
              />
              <a className='farm_popup_close_btn' onClick={onClose}></a>
            </h1>
            <p
              style={{
                color: '#0f8c20',
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              <span>
                {farmPools && farmPools.earned
                  ? formatAmount(farmPools.earned)
                  : '--'}
              </span>
            </p>
            <div className='form-app__submit form-app__submit--row'>
              {active && (
                <Button type='primary' onClick={onConfirm} loading={loadFlag}>
                  <FormattedMessage id='poolText22' />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default injectIntl(FarmPopupTabPopup)
