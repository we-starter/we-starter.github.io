import React, { useContext, useEffect, useState } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { mainContext } from '../../reducer'
import { useActiveWeb3React } from '../../web3'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import {
  NoEthereumProviderError,
} from '@web3-react/injected-connector'
import { FormattedMessage } from 'react-intl'
import {
  GALLERY_SELECT_WEB3_CONTEXT,
  HANDLE_CHANGE_NETWORKS,
  HANDLE_WALLET_MODAL,
} from '../../const'
import metamask from '../../assets/icon/metamask.png'
import close from '../../assets/icon/close.png'
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import walletConnect from '../../assets/icon/walletConnect.png'
import {changeNetwork, injected, useConnectWallet, walletConnector} from "../../connectors";
import {ChainId} from "../../web3/address";

export const WalletConnect = ({ onClose, onCancel }) => {
  const { dispatch, state } = useContext(mainContext)
  const { chainId } = useActiveWeb3React()
  const [connectedName, setConnectedName] = useState()
  const connectWallet = useConnectWallet()


  const initChainId = chainId || ChainId.HECO
  const [netWorkFlag, setNetWorkFlag] = useState(initChainId)


  useEffect(() => {
    const localContent =
      window && window.localStorage.getItem(GALLERY_SELECT_WEB3_CONTEXT)
    console.log('wallet content', localContent)
    if (localContent) {
      setConnectedName(localContent)
    }
  }, [])

  const selectNetWork = (_chainId) => {
    setNetWorkFlag(_chainId)
  }

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner transction-submitted link-wallet'>
            <div className='form-app__inner__header'>
              链接钱包
              {/* <FormattedMessage id='modalsText1' /> */}
            </div>{' '}
            <div className='choose-network-box'>
              <p className='choose-network-title'>选择网络</p>

              <div className={`choose-network`}>
                <p
                  className={`${netWorkFlag == ChainId.BSC ? 'active' : ''}`}
                  onClick={() => {
                    selectNetWork(ChainId.BSC)
                  }}
                >
                  <img src={BSC} />
                  <span>Binance</span>
                  <svg
                    t='1623750759643'
                    className='icon'
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
                  className={`${netWorkFlag == ChainId.HECO ? 'active' : ''}`}
                  onClick={() => {
                    selectNetWork(ChainId.HECO)
                  }}
                >
                  <img src={HECO} />
                  <span>Heco</span>
                  <svg
                    t='1623750759643'
                    className='icon'
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
            <div className='form-app__inner wallet-connect'>
              <p className='choose-network-title'>选择钱包</p>
              <div className='form-app__inner__wallets'>
                <div
                  onClick={() => {
                    connectWallet(injected, netWorkFlag).then(() => {
                        dispatch({
                          type: HANDLE_WALLET_MODAL,
                          walletModal: null,
                        })
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
                    connectWallet(walletConnector[netWorkFlag]).then(() => {
                      dispatch({
                        type: HANDLE_WALLET_MODAL,
                        walletModal: null,
                      })
                    })
                    // activate(
                    //   netWorkFlag == 'BSC' ? walletChangeBSC : walletChange,
                    //   (e) => {},
                    //   true
                    // )
                    //   .then(() => {
                    //     // 验证链接之后
                    //     dispatch({
                    //       type: HANDLE_WALLET_MODAL,
                    //       walletModal: null,
                    //     })
                    //     window &&
                    //       window.localStorage.setItem(
                    //         GALLERY_SELECT_WEB3_CONTEXT,
                    //         netWorkFlag == 'BSC'
                    //           ? 'walletChangeBSC'
                    //           : 'WalletConnect'
                    //       )
                    //   })
                    //   .catch((e) => {
                    //     console.log(e)
                    //   })
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
