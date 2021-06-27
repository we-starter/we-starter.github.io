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
import { getMultiCallProvider, processResult } from '../../utils/multicall'
import {Contract} from "ethers-multicall-x";
import {abi as ERC20} from "../../web3/abi/ERC20.json";

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
// const fromContract = new Contract(WAR_ADDRESS(ChainId.HECO), ChainSwapAbi)
var web3BSC = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.BSC)));
let toContract = new web3BSC.eth.Contract(ChainSwapAbi, WAR_ADDRESS(ChainId.BSC));
// const toContract = new Contract(WAR_ADDRESS(ChainId.BSC), ChainSwapAbi)

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
  const createContract = cId => new Contract(WAR_ADDRESS(cId), ChainSwapAbi)
  /**
   * 获取跨链数据
   */
  const getCrossChainData = () => {
    // 查询 源链 ChainSwap合约中 sentCount(toChainId, to) ，得到 maxNonce
    const multicallProvider = getMultiCallProvider(library, chainId)
    // 查询所有质押的数据，遍历 源链
    const getPledgeData = (toChainId, fromChainId, maxNonce) => {
      const fromPledgeAmountConcat = createContract(fromChainId)
      const toPledgeAmountConcat = createContract(toChainId)
      const extractAmountAll = []
      let pledgeAmountAll = []
      for (let nonce = 0; nonce <= maxNonce; nonce++) {
        pledgeAmountAll.push(fromPledgeAmountConcat.sent(toChainId, account, nonce))
        extractAmountAll.push(toPledgeAmountConcat.received(fromChainId, account, nonce))
      }
      return Promise.all([multicallProvider.all(pledgeAmountAll),multicallProvider.all(extractAmountAll)]).then(res => {
        let pledgeAmountData = processResult(res[0])
        let extractAmountData = processResult(res[1])
        return pledgeAmountData.reduce((l, item, index)=>{
          l.push({
            nonce: index,
            pledgeAmount: web3BSC.utils.fromWei(pledgeAmountData[index], 'ether'),
            extractAmount: web3BSC.utils.fromWei(extractAmountData[index], 'ether'),
            fromChainId,
            toChainId,
            account
          })
          return l
        }, [])
      })
    }
    setHistoryData([])
    // 每一个跨链方向[from,to]
    const directions = [[ChainId.BSC, ChainId.HECO], [ChainId.HECO, ChainId.BSC]]
    // 获取maxNonce
    const sentCountArr = directions.reduce((l, i)=>{
      l.push(fromContract.methods.sentCount(i[0], account).call())
      return l
    }, [])

    Promise.all(sentCountArr).then(maxNonceArr => {
      // 获取签名后数据
      const getPledgeDataArr = directions.reduce((l, item, idx)=>{
        l.push(getPledgeData(...item, maxNonceArr[idx]))
        return l
      }, [])
      Promise.all(getPledgeDataArr).then(result => {
        setHistoryData(result.flat(1))
      })
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