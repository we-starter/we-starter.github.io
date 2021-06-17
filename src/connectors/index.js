import React, {useCallback, useEffect} from 'react'
import {InjectedConnector, NoEthereumProviderError, UserRejectedRequestError} from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import {ChainId, SCAN_ADDRESS} from '../web3/address'
import {UnsupportedChainIdError, useWeb3React} from "@web3-react/core";

export const POLLING_INTERVAL = 12000

export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.HECO, ChainId.BSC],
})


const bscWalletConnector = new WalletConnectConnector({
  rpc: { 56: 'https://bsc-dataseed.binance.org/' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const hecoWalletConnector = new WalletConnectConnector({
  rpc: { 128: 'https://http-mainnet-node.huobichain.com\n' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const walletConnector = {
  [ChainId.HECO]: hecoWalletConnector,
  [ChainId.BSC]: bscWalletConnector
}

const bscNetwork =  {
  chainId: '0x38',
  chainName: 'BSC',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: [SCAN_ADDRESS[ChainId.BSC]],
}

const hecoNetwork = {
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
  blockExplorerUrls: [SCAN_ADDRESS[ChainId.HECO]],
}

const networkConf = {
  [ChainId.HECO]: hecoNetwork,
  [ChainId.BSC]: bscNetwork
}

export const changeNetwork = (chainId) => {
  return new Promise(reslove => {
    const {ethereum} = window
    if(ethereum && ethereum.isMetaMask && networkConf[chainId]){
      ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networkConf[chainId]
            }
          ],
        })
        .then(() => {
          setTimeout(reslove, 500)
        })
    }else{
      reslove()
    }
  })
}

export function getScanLink(chainId, data, type) {
  const prefix = SCAN_ADDRESS[chainId]
  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export const useConnectWallet = () => {
  const {activate, deactivate, active} = useWeb3React()
  const connectWallet = useCallback((connector, chainId) => {
    return changeNetwork(chainId).then(() => {
      return new Promise((reslove, reject) => {
        activate(connector, undefined, true)
          .then((e) => {
            if (window.ethereum.on) {
              // 监听钱包事件
              console.log('注册事件')
              // const { ethereum } = window
              window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                  //无账号，则代表锁定了,主动断开
                  deactivate()
                }
                // 账号改了，刷新网页
                window.location.reload()
              })

              window.ethereum.on('disconnect', () => {
                // 断开连接
                deactivate()
              })

              window.ethereum.on('close', () => {
                // 断开连接
                deactivate()
              })

              window.ethereum.on('message', (e) => {
                console.log('message', e)
              })

            }
            reslove(e)
          })
          .catch((error) => {
            switch (true) {
              case error instanceof UnsupportedChainIdError:
                console.log('链错了')
                break
              case error instanceof NoEthereumProviderError:
                console.log('不是钱包环境')
                break
              case error instanceof UserRejectedRequestError:
                console.log('用户拒绝连接钱包')
                break
              default:
                console.log(error)
            }
            reslove(error)
          })
      })
    })


  },[])

  useEffect(() => {
    !active && connectWallet(injected)
    window.ethereum.on('networkChanged', () => {
      // 切换网络后，尝试连接
      !active && connectWallet(injected)
    })
  }, [])
  return connectWallet
}