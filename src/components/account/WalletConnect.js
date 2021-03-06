import React, { useContext, useEffect, useState } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { mainContext } from '../../reducer'
import {
  InjectedConnector,
  NoEthereumProviderError,
} from '@web3-react/injected-connector'
import { FormattedMessage } from 'react-intl'
import {
  GALLERY_SELECT_WEB3_CONTEXT,
  HANDLE_CHANGE_NETWORKS,
  HANDLE_WALLET_MODAL,
} from '../../const'
import metamask from '../../assets/icon/metamask.png'
import walletConnect from '../../assets/icon/walletConnect.png'

import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'

const injected = new InjectedConnector({
  supportedChainIds: [3, 128],
})

const POLLING_INTERVAL = 12000

const walletChange = new WalletConnectConnector({
  rpc: { 128: 'https://http-mainnet-node.huobichain.com'},
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const WalletConnect = ({ onClose, onCancel }) => {
  const { dispatch, state } = useContext(mainContext)
  const [connectedName, setConnectedName] = useState()

  const context = useWeb3React()

  const [activatingConnector, setActivatingConnector] = useState()

  const { connector, activate, active } = context

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector])

  useEffect(() => {
    const localContent =
      window && window.localStorage.getItem(GALLERY_SELECT_WEB3_CONTEXT)
    console.log('wallet content', localContent)
    if (localContent) {
      setConnectedName(localContent)
    }
  }, [])

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner wallet-connect'>
            <div className='form-app__inner__wallets'>
              <div
                onClick={() => {
                  activate(injected, (e) => {}, true).then((e) => {
                    dispatch({
                      type: HANDLE_WALLET_MODAL,
                      walletModal: null,
                    })
                    window &&
                      window.localStorage.setItem(
                        GALLERY_SELECT_WEB3_CONTEXT,
                        'MetaMask'
                      )
                  }).catch(e => {
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
                }}
                className='form-app__inner__wallets__item'
                style={{
                  borderRight: '1px rgba(235, 233, 227, 1) solid',
                }}
              >
                <img src={metamask} />
                <p>
                  <FormattedMessage id='accountText8' />
                </p>
              </div>

              <div
                onClick={() => {
                  activate(walletChange, (e) => {}, true)
                    .then(() => {
                      // 验证链接之后
                      dispatch({
                        type: HANDLE_WALLET_MODAL,
                        walletModal: null,
                      })
                      window &&
                      window.localStorage.setItem(
                          GALLERY_SELECT_WEB3_CONTEXT,
                          'WalletConnect'
                      )
                    })
                    .catch((e) => {
                      console.log(e)
                    })
                }}
                className='form-app__inner__wallets__item'
              >
                <img src={walletConnect} />
                <p>
                  <FormattedMessage id='accountText9' />
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
