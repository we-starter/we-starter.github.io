import React, { useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../web3'
import { WAR_ADDRESS, ChainId } from '../web3/address'
import { formatAddress, formatAmount } from '../utils/format'
import { mainContext } from '../reducer'
import { HANDLE_WALLET_MODAL, HANDLE_CHANGE_NETWORKS, HANDLE_SHOW_MENUMASK_MODAL } from '../const'
import dot from '../assets/icon/dot.png'
import BSC from '../assets/icon/BSC@2x.png'
import HECO from '../assets/icon/HECO@2x.png'
import MATIC from '../assets/icon/MATIC@2x.png'
import { useBalance } from '../pages/Hooks'
import { FormattedMessage } from 'react-intl'

const ConnectWallet = () => {
  const { active, account, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const { balance } = useBalance(WAR_ADDRESS(chainId), chainId)
  return <div className='connect-wallet-h5'>
    {active && (
      <div className='ht-balance'>
        {chainId == ChainId.BSC && (
          <img
            onClick={() => {
              dispatch({
                type: HANDLE_CHANGE_NETWORKS,
                changeNetworkStatus: true,
              })
            }}
            className='header-network'
            src={BSC}
          />
        )}
        {chainId == ChainId.HECO && (
          <img
            onClick={() => {
              dispatch({
                type: HANDLE_CHANGE_NETWORKS,
                changeNetworkStatus: true,
              })
            }}
            className='header-network'
            src={HECO}
          />
        )}
        {chainId == ChainId.MATIC && (
          <img
            onClick={() => {
              dispatch({
                type: HANDLE_CHANGE_NETWORKS,
                changeNetworkStatus: true,
              })
            }}
            className='header-network'
            src={MATIC}
          />
        )}
        {/* <span>
                  <img
                    src={chainId === ChainId.MATIC ? RAW_ICON : WAR_ICON}
                    alt=''
                  />
                </span> */}
        <p>{formatAmount(balance)} WAR</p>
      </div>
    )}
    {active && (
      <div className='header-account'>
        <div
          className='address'
          onClick={() => {
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'status',
            })
          }}
        >
          {formatAddress(account)}
          {/* <img src={doubleLine} /> */}
        </div>
      </div>
    )}

    {!active && (
      <div className='header__btn'>
        <button className='connect-btn'>
          <span
            onClick={() => {
              dispatch({
                type: HANDLE_WALLET_MODAL,
                walletModal: 'connect',
              })
            }}
          >
            <FormattedMessage id='linkWallet' />
          </span>
          <img src={dot} />
        </button>
      </div>
    )}
  </div>
}
export default ConnectWallet