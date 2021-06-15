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
import { useActiveWeb3React } from '../../web3'
import metamask from '../../assets/icon/metamask.png'
import close from '../../assets/icon/close.png'
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import walletConnect from '../../assets/icon/walletConnect.png'

import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'

const injected = new InjectedConnector({
  supportedChainIds: [3, 128, 56],
})

const POLLING_INTERVAL = 12000

const walletChange = new WalletConnectConnector({
  rpc: { 128: 'https://http-mainnet-node.huobichain.com'},
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const walletChangeBSC = new WalletConnectConnector({
  rpc: { 56: 'https://bsc-dataseed.binance.org/' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const WalletConnect = ({ onClose, onCancel }) => {
  const { dispatch, state } = useContext(mainContext)
  const { chainId } = useActiveWeb3React()
  const [connectedName, setConnectedName] = useState()

  const context = useWeb3React()

  const [activatingConnector, setActivatingConnector] = useState()

  const { connector, activate, active } = context

    const {
      changeNetworkStatus,
    } = state

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
          <div className='form-app__inner transction-submitted link-wallet'>
            <div className='form-app__inner__header'>
              {changeNetworkStatus ? '切换网络' : '链接钱包'}
              {/* <FormattedMessage id='modalsText1' /> */}
            </div>{' '}
            <div className='choose-network-box'>
              {!changeNetworkStatus && (
                <p className='choose-network-title'>选择网络</p>
              )}

              <div
                className={`choose-network ${
                  changeNetworkStatus ? 'change-network' : ''
                }`}
                style={{ justifyContent: changeNetworkStatus && 'center' }}
              >
                <p
                  className={`${chainId == 56 ? 'active' : ''}`}
                  onClick={() => {
                    window.ethereum &&
                      window.ethereum
                        .request({
                          method: 'wallet_addEthereumChain',
                          params: [
                            {
                              chainId: '0x38',
                              chainName: 'BSC',
                              nativeCurrency: {
                                name: 'BNB',
                                symbol: 'BNB',
                                decimals: 18,
                              },
                              rpcUrls: ['https://bsc-dataseed.binance.org/'],
                              blockExplorerUrls: ['https://bscscan.com/'],
                            },
                          ],
                        })
                        .then(() => {
                          window.location.reload()
                        })
                        .catch((e) => {
                          window.location.reload()
                        })
                  }}
                >
                  <img src={BSC} />
                  <span>Binance</span>
                  <svg
                    t='1623750759643'
                    class='icon'
                    viewBox='0 0 1077 1024'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    p-id='1980'
                    width='20'
                    height='20'
                  >
                    <path
                      d='M0 1024h862.315789a215.578947 215.578947 0 0 0 215.578948-215.578947V0L0 1024z m949.248-384.215579l-225.333895 225.333895a24.252632 24.252632 0 0 1-34.492631 0l-34.492632-34.492632-114.256842-110.807579a36.594526 36.594526 0 0 1 0-51.900631 36.648421 36.648421 0 0 1 51.900632 0l96.794947 93.345684a24.252632 24.252632 0 0 0 34.546526 0l173.379369-173.433263a36.594526 36.594526 0 0 1 51.954526 0 36.594526 36.594526 0 0 1 0 51.954526z'
                      p-id='1981'
                    ></path>
                  </svg>
                </p>
                <p
                  className={`${chainId == 128 ? 'active' : ''}`}
                  onClick={() => {
                    window.ethereum &&
                      window.ethereum
                        .request({
                          method: 'wallet_addEthereumChain',
                          params: [
                            {
                              chainId: '0x80',
                              chainName: 'HECO',
                              nativeCurrency: {
                                name: 'HT',
                                symbol: 'HT',
                                decimals: 18,
                              },
                              rpcUrls: [
                                'https://http-mainnet-node.huobichain.com',
                              ],
                              blockExplorerUrls: ['https://hecoinfo.com'],
                            },
                          ],
                        })
                        .then(() => {
                          window.location.reload()
                        })
                        .catch((e) => {
                          window.location.reload()
                        })
                  }}
                >
                  <img src={HECO} />
                  <span>Heco</span>
                  <svg
                    t='1623750759643'
                    class='icon'
                    viewBox='0 0 1077 1024'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    p-id='1980'
                    width='20'
                    height='20'
                  >
                    <path
                      d='M0 1024h862.315789a215.578947 215.578947 0 0 0 215.578948-215.578947V0L0 1024z m949.248-384.215579l-225.333895 225.333895a24.252632 24.252632 0 0 1-34.492631 0l-34.492632-34.492632-114.256842-110.807579a36.594526 36.594526 0 0 1 0-51.900631 36.648421 36.648421 0 0 1 51.900632 0l96.794947 93.345684a24.252632 24.252632 0 0 0 34.546526 0l173.379369-173.433263a36.594526 36.594526 0 0 1 51.954526 0 36.594526 36.594526 0 0 1 0 51.954526z'
                      p-id='1981'
                    ></path>
                  </svg>
                </p>
              </div>
            </div>
            {!changeNetworkStatus && (
              <div className='form-app__inner wallet-connect'>
                <p className='choose-network-title'>选择钱包</p>
                <div className='form-app__inner__wallets'>
                  <div
                    onClick={() => {
                      activate(injected, (e) => {}, true)
                        .then((e) => {
                          dispatch({
                            type: HANDLE_WALLET_MODAL,
                            walletModal: null,
                          })
                          window &&
                            window.localStorage.setItem(
                              GALLERY_SELECT_WEB3_CONTEXT,
                              'MetaMask'
                            )
                        })
                        .catch((e) => {
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
                  >
                    <img src={metamask} />
                    {/* <p>
                    <FormattedMessage id='accountText8' />
                  </p> */}
                  </div>

                  <div
                    onClick={() => {
                      activate(
                        changeNetworkStatus ? walletChangeBSC : walletChange,
                        (e) => {},
                        true
                      )
                        .then(() => {
                          // 验证链接之后
                          dispatch({
                            type: HANDLE_WALLET_MODAL,
                            walletModal: null,
                          })
                          window &&
                            window.localStorage.setItem(
                              GALLERY_SELECT_WEB3_CONTEXT,
                              changeNetworkStatus
                                ? 'walletChangeBSC'
                                : 'WalletConnect'
                            )
                        })
                        .catch((e) => {
                          console.log(e)
                        })
                    }}
                    className='form-app__inner__wallets__item'
                  >
                    <img src={walletConnect} />
                    {/* <p>
                    <FormattedMessage id='accountText9' />
                  </p> */}
                  </div>
                </div>
              </div>
            )}
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
