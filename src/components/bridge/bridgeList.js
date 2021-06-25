import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { Button } from 'antd'
import {
  HANDLE_WALLET_MODAL
} from '../../const'
import { mainContext } from '../../reducer'
// 处理格式 千位符
import { formatNumber } from 'accounting'
import { formatAmount, formatAddress } from '../../utils/format'
import Right from '../../assets/icon/right@2x.png'
import Web3 from "web3";
import {ChainId, RPC_URLS, WAR_ADDRESS} from "../../web3/address";
import ChainSwapAbi from "../../web3/abi/ChainSwap.json";
import {changeNetwork} from "../../connectors";

const CurrencyIcon = {
    [ChainId.HECO]: {
      icon: 'HECO',
      title: 'Heco'
    },
    [ChainId.BSC]: {
      icon: 'BSC',
      title: 'Binance Smart Chain'
    }
  }

var web3HECO = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.HECO)));
let fromContract = new web3HECO.eth.Contract(ChainSwapAbi, WAR_ADDRESS(ChainId.HECO));
var web3BSC = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.BSC)));
let toContract = new web3BSC.eth.Contract(ChainSwapAbi, WAR_ADDRESS(ChainId.BSC));

const BridgeList = ({onExtractItem}) => {
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const [historyData, setHistoryData] = useState([])
    // {
    //   account: '0x12xxx',
    //   extractAmount: "0",
    //   fromChainId: 128,
    //   nonce: 2,
    //   pledgeAmount: "0.00001",
    //   toChainId: 56
    // }
  /**
   * 获取跨链数据
   */
  const getCrossChainData = () => {
    // 查询 源链 ChainSwap合约中 sentCount(toChainId, to) ，得到 maxNonce
    const getMaxNonce = (toChainId, fromChainId, callback) => {
      fromContract.methods.sentCount(toChainId, account).call().then(maxNonce => {
        callback(toChainId, fromChainId, maxNonce)
      })
    }
    // 查询所有质押的数据，遍历 源链
    const getPledgeData = (toChainId, fromChainId, maxNonce) => {
      let nonce = 0
      let data = []
      do {
        (function (nonce){
          fromContract.methods.sent(toChainId, account, nonce).call({
            from: account,
          }).then(pledgeAmount => {
            toContract.methods.received(fromChainId, account, nonce).call({
              from: account,
            }).then( extractAmount => {
              data.push({
                nonce,
                pledgeAmount: web3BSC.utils.fromWei(pledgeAmount, 'ether'),
                extractAmount: web3BSC.utils.fromWei(extractAmount, 'ether'),
                fromChainId,
                toChainId,
                account
              })
              if (data.length === ~~maxNonce + 1) {
                historyData.push(...data)
                console.log(historyData)
                setHistoryData(historyData)
              }
            })
          })
        })(nonce)
      } while (++nonce <= maxNonce)
    }
    setHistoryData([])
    setTimeout(()=>{
      getMaxNonce(ChainId.BSC, ChainId.HECO, getPledgeData)
      // getMaxNonce(ChainId.HECO, ChainId.BSC, getPledgeData)
    })
  }
  useEffect(() => {
    if (active){
      getCrossChainData()
    }
  }, [active])
  return (
    <div className='bridge_list'>
      <div className='bridge_list_tab'>
        <FormattedMessage id='bridge5' />
        </div>
      <table className='bridge_list_table_pc'>
        <thead>
          <tr>
            <td><FormattedMessage id='bridge6' /></td>
            <td><FormattedMessage id='bridge7' /></td>
            <td><FormattedMessage id='bridge8' /></td>
            <td><FormattedMessage id='bridge2' /></td>
            <td><FormattedMessage id='bridge9' /></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {
            historyData.map((item, index) => {
              return (
                <tr key={index}>
                  <td className='tbody_title'>
                    <img className='icon' src={require('../../assets/icon/WAR@2x.png')} /> WAR
                  </td>
                  <td>
                    <img src={require('../../assets/icon/' + CurrencyIcon[item.fromChainId].icon + '@2x.png')} /> {CurrencyIcon[item.fromChainId].title}
                  </td>
                  <td>
                    <img src={require('../../assets/icon/' + CurrencyIcon[item.toChainId].icon + '@2x.png')} /> {CurrencyIcon[item.toChainId].title}
                  </td>
                  <td>{formatAddress(item.account)}</td>
                  <td>{item.pledgeAmount}</td>
                  <td className='withdraw_status'>
                    {
                      item.extractAmount === item.pledgeAmount ? <img src={Right} /> :
                          <p onClick={() => {
                            onExtractItem(item)
                          }}><FormattedMessage id='bridge10' /></p>
                    }
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <div className='bridge_list_table_h5'>
       {
         historyData.map((item, index) => {
           return (
             <div className='bridge_list_data' key={index}>
               <div className='bridge_list_data_title'>
                 <h2><img className='icon' src={require('../../assets/icon/WAR@2x.png')} /> WAR</h2>
                 {
                   item.status == 2 && <img src={Right} />
                 }
               </div>
               <div className='bridge_list_data_title'>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge7' /></p>
                   <p><img className='success_status' src={require('../../assets/icon/' + CurrencyIcon[item.fromChainId].icon + '@2x.png')} /> {CurrencyIcon[item.fromChainId].title}</p>
                 </div>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge8' /></p>
                   <p style={{ textAlign: 'right' }}><img className='success_status' src={require('../../assets/icon/' + CurrencyIcon[item.toChainId].icon + '@2x.png')} /> {CurrencyIcon[item.toChainId].title}</p>
                 </div>
               </div>
               <div className='bridge_list_data_title'>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge2' /></p>
                   <p>{formatAddress(item.account)}</p>
                 </div>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge9' /></p>
                   <p style={{ textAlign: 'right' }}>{item.pledgeAmount}</p>
                 </div>
               </div>
               {
                 item.extractAmount !== item.pledgeAmount && (
                   <div className='form-app__submit form-app__submit--row' style={{ marginBottom: '20px' }}>
                     <Button
                       className={'btn'}
                       type='button'
                       onClick={() => {
                         onExtractItem(item)
                       }}
                     >
                       <FormattedMessage id='bridge10' />
                    </Button>
                   </div>
                 )
               }
             </div>
           )
         })
       }
      </div>
    </div>
  )
}

export default injectIntl(BridgeList)