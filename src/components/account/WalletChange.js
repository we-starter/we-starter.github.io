import React, { useContext, useEffect, useState } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import {
  InjectedConnector,
  NoEthereumProviderError,
} from '@web3-react/injected-connector'
import {
  GALLERY_SELECT_WEB3_CONTEXT,
  HANDLE_CHANGE_NETWORKS,
  HANDLE_WALLET_MODAL,
} from '../../const'
import { formatAddress } from '../../utils/format'
import metamask from '../../assets/icon/metamask.png'
import walletConnect from '../../assets/icon/walletConnect.png'
import { FormattedMessage } from 'react-intl'

import dot from '../../assets/icon/dot.png'

import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import close from '../../assets/icon/close.png'
import back from '../../assets/icon/back.png'
import { mainContext } from '../../reducer'

const injected = new InjectedConnector({
  supportedChainIds: [3, 128],
})

const POLLING_INTERVAL = 12000
const RPC_URLS = {
  1: 'https://eth-mainnet.alchemyapi.io/v2/k2--UT_xVVXMOvAyoxJYqtKhlmyBbqnX',
  4: 'https://rinkeby.infura.io/v3/8f6d3d5d7a1442a38d9e8050c31c1884',
}

const walletChange = new WalletConnectConnector({
  rpc: { 128: 'https://http-mainnet-node.huobichain.com' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const WalletChange = ({ onClose, onCancel }) => {
  const context = useWeb3React()
  const { dispatch } = useContext(mainContext)

  const [connectedName, setConnectedName] = useState()
  const [activatingConnector, setActivatingConnector] = useState()

  console.log('context', context)

  const { connector, library, account, activate, deactivate, active } = context

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector])

  useEffect(() => {
    const localContent =
      window && window.localStorage.getItem(GALLERY_SELECT_WEB3_CONTEXT)
    console.log('wallet content', localContent)
    if (localContent && active) {
      setConnectedName(localContent)
    }
  }, [active])

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner transction-submitted'>
            <div
              onClick={() => {
                if (connectedName !== 'MetaMask') {
                  activate(injected, (e) => {
                    // 钱包无法连接
                    if (e instanceof UnsupportedChainIdError) {
                      // TODO网络不支持
                      dispatch({
                        type: HANDLE_CHANGE_NETWORKS,
                        changeNetworkStatus: true,
                      })
                      console.log('network not support')
                    } else if (e instanceof NoEthereumProviderError) {
                      dispatch({
                        type: HANDLE_WALLET_MODAL,
                        walletModal: 'connecting',
                      })
                    }
                  })
                    .then(() => {
                      setConnectedName('MetaMask')
                      // dispatch({
                      //   type: HANDLE_WALLET_MODAL,
                      //   walletModal: null,
                      // });
                      window &&
                        window.localStorage.setItem(
                          GALLERY_SELECT_WEB3_CONTEXT,
                          'MetaMask'
                        )
                    })
                    .catch(() => {})
                }
              }}
              className='form-app__inner__frame'
              style={{ marginTop: 50 }}
            >
              {connectedName === 'MetaMask' ? (
                <>
                  <img
                    alt=''
                    src={dot}
                    className='form-app__inner__frame__dot'
                  />
                  <p>{account && formatAddress(account)}</p>
                </>
              ) : (
                <>
                  <img
                    alt=''
                    src={''}
                    className='form-app__inner__frame__dot-default'
                  />
                  <p>
                    <FormattedMessage id='accountText6' />
                  </p>
                </>
              )}

              <img
                alt=''
                className='form-app__inner__frame__right-icon'
                src={metamask}
              />
            </div>

            <div
              onClick={() => {
                if (connectedName !== 'WalletConnect') {
                  activate(walletChange)
                    .then(() => {
                      console.log('WalletConnect---->')
                      setConnectedName('WalletConnect')
                      window &&
                        window.localStorage.setItem(
                          GALLERY_SELECT_WEB3_CONTEXT,
                          'WalletConnect'
                        )
                      // dispatch({
                      //   type: HANDLE_WALLET_MODAL,
                      //   walletModal: null,
                      // });
                    })
                    .catch(() => {})
                }
              }}
              className='form-app__inner__frame'
              style={{ marginTop: 24 }}
            >
              {connectedName === 'WalletConnect' ? (
                <>
                  <img
                    alt=''
                    src={dot}
                    className='form-app__inner__frame__dot'
                  />
                  <p>{account && formatAddress(account)}</p>
                </>
              ) : (
                <>
                  <img
                    alt=''
                    src={''}
                    className='form-app__inner__frame__dot-default'
                  />
                  <p>
                    <FormattedMessage id='accountText7' />
                  </p>
                </>
              )}

              <img
                alt=''
                className='form-app__inner__frame__right-icon'
                src={walletConnect}
              />
            </div>
            <img
              src={close}
              alt=''
              className='form-app__close-btn'
              onClick={onClose}
              aria-label='Close'
            />

            <img
              src={back}
              alt=''
              className='form-app__back-btn'
              onClick={onCancel}
              aria-label='Close'
            />
          </div>
        </form>
      </div>
    </div>
  )
}
