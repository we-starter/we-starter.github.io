import React, {useContext, useEffect} from 'react'
import { IntlProvider } from 'react-intl'
import { mainContext } from '../reducer'
import zh_CN from './cn'
import en_US from './en'
import ru from './ru'
import Web3 from "web3";
import {ChainId, RPC_URLS, WAR_ADDRESS} from "../web3/address";
import {BLOCK_HEIGHT} from "../const";
// var web3 = new Web3(window.ethereum);
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.HECO)))



const Inter = (props) => {
  const { dispatch, state } = useContext(mainContext)
  const getBlockHeight = async () => {
    let height = await web3.eth.getBlockNumber()
    dispatch({
      type: BLOCK_HEIGHT,
      blockHeight: height
    })
    setTimeout(getBlockHeight, 15000)
  }
  useEffect(()=>{
    getBlockHeight()
  }, [])
  const chooseLocale = (val) => {
    let _val = val || navigator.language.split('_')[0]
    switch (_val) {
      case 'en':
        return en_US
      case 'zh':
        return zh_CN
      case 'ru':
        return ru
      default:
        return en_US
    }
  }
  let { children } = props
  let locale = state.locale

  return (
    <IntlProvider
      key={locale}
      locale={locale}
      defaultLocale='zh'
      messages={chooseLocale(locale)}
    >
      {children}
    </IntlProvider>
  )
}

export default Inter
