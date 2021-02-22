import React, { useContext, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { FormattedMessage } from 'react-intl'

import close from '../../assets/icon/close.png'
import change from '../../assets/icon/change@2x.png'
import { HANDLE_WALLET_MODAL } from '../../const'
import { mainContext } from '../../reducer'

export const ChangeNetworks = ({ onClose }) => {
  const { dispatch } = useContext(mainContext)

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner transction-submitted transction-submitted-box'>
            <div
              className='form-app__inner__header'
              style={{ justifyContent: 'start', maxWidth: '90%' }}
            >
              <img
                style={{ marginRight: '16px', width: '24px', height: '24px' }}
                src={change}
              />
              <FormattedMessage id='modalsText1' />
            </div>

            <p
              className='transction-submitted__tip'
              style={{ maxWidth: '100%' }}
            >
              <FormattedMessage id='modalsText2' />
            </p>
            <p
              className='transction-submitted__tip'
              style={{ maxWidth: '100%' }}
            >
              <FormattedMessage id='modalsText3' />
            </p>

            <footer>
              <p
                style={{ color: '#0f8c20', marginBottom: '0' }}
                onClick={() => {
                  onClose()
                  dispatch({
                    type: HANDLE_WALLET_MODAL,
                    walletModal: 'connect',
                  })
                }}
              >
                <FormattedMessage id='modalsText4' />
              </p>
              <button className='btn'>
                <FormattedMessage id='modalsText4' />
              </button>
            </footer>

            <img
              src={close}
              alt=''
              className='form-app__close-btn'
              onClick={onClose}
              aria-label='Close'
            />
          </div>
        </form>
      </div>
    </div>
  )
}
