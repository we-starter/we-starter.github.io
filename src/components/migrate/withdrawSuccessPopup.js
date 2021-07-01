import React, { useContext, useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'
import { mainContext } from '../../reducer'
import { Button } from 'antd'
import { getContract, useActiveWeb3React } from '../../web3'
import { WAR_ADDRESS } from '../../web3/address'
import { message } from 'antd'
import { formatAmount } from '../../utils/format'
import cs from 'classnames'
import Right from '../../assets/icon/right@2x.png'

const WithdrawSuccessPopup = (props) => {
  const { onClose } = props

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app farm_popup' action='/'>
          <div className='form-app__inner withdraw_success'>
            <img className='success_logo' src={Right} />
            <p className='withdraw_success_text'>Withdraw success</p>
            <div className='form-app__submit form-app__submit--row'>
              <a className='withdraw_btn' onClick={onClose}>
                Confirm
              </a>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  )
}

export default injectIntl(WithdrawSuccessPopup)
