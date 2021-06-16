import React, { useEffect } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ChainId, NetworkRPC } from '../constants'

export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.RINKEBY, ChainId.ETH, ChainId.BSC],
})

export const walletChange = new WalletConnectConnector({
  rpc: { 56: 'https://bsc-dataseed.binance.org/' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000,
})

export const Web3ReactActivate = () => {
  // const { activate } = useWeb3React()
  // useEffect(() => {
  //   activate(injected).then(() => {
  //     console.log(injected, 'injected')
  //   })
  // }, [])
}
