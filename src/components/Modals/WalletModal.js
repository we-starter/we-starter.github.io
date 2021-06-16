import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  GALLERY_SELECT_WEB3_CONTEXT,
  HANDLE_SHOW_TRANSACTION_MODAL,
  HANDLE_WALLET_MODAL,
} from '../../const'
import { mainContext } from '../../reducer'
import close from '../../assets/icon/close.png'
import { useActiveWeb3React } from '../../web3'
import { formatAddress } from '../../utils/format'
import copy from '../../assets/icon/copy.png'
import { message } from 'antd'
import switchIcon from '../../assets/icon/switch.png'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useWeb3React } from '@web3-react/core'
import { FormattedMessage } from 'react-intl'

export const WalletModal = ({ onChange, onClose }) => {
  const context = useWeb3React()
  const { dispatch, state } = useContext(mainContext)

  const {
    connector,
    library,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner transction-submitted'>
            <div
              className='form-app__inner__header'
              style={{ maxWidth: 'inherit' }}
            >
              <FormattedMessage id='modalsText59' />
            </div>
            <p className='form-app__inner__address'>
              {account && formatAddress(account)}
            </p>

            <CopyToClipboard
              text={account}
              onCopy={() => {
                message.success('copy success')
                // alert('copy success!')
              }}
            >
              <div
                className='form-app__inner__frame'
                style={{ marginBottom: 24 }}
              >
                <img src={copy} alt='' />
                <p>
                  <FormattedMessage id='modalsText60' />
                </p>
              </div>
            </CopyToClipboard>

            <div className='form-app__inner__frame' style={{marginBottom: '24px'}} onClick={onChange}>
              <img src={switchIcon} alt='' />
              <p>
                <FormattedMessage id='modalsText61' />
              </p>
            </div>

            <button
              style={{ marginTop: 30, width: '100%' }}
              type='button'
              className='btn transction-submitted__btn'
              onClick={() => {
                deactivate()
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
                window &&
                  window.localStorage.removeItem(GALLERY_SELECT_WEB3_CONTEXT)
              }}
            >
              <FormattedMessage id='modalsText62' />
            </button>
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
