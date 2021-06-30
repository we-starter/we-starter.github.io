import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { Button, Skeleton } from 'antd'
import {
  HANDLE_WALLET_MODAL
} from '../../const'
import { mainContext } from '../../reducer'
// 处理格式 千位符
import { formatNumber } from 'accounting'
import { formatAmount, formatAddress } from '../../utils/format'
import Right from '../../assets/icon/right@2x.png'
import Web3 from "web3";
import {BURN_SWAP_ADDRESS, BURN_SWAP_S_ADDRESS, ChainId, RPC_URLS} from "../../web3/address";
import ChainSwapAbi from "../../web3/abi/ChainSwap.json";
import {changeNetwork} from "../../connectors";
import { getOnlyMultiCallProvider, processResult } from '../../utils/multicall'
import {Contract} from "ethers-multicall-x";
import WAR from '../../assets/icon/WAR@2x.png'
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import MATIC from '../../assets/icon/MATIC@2x.png'

const CurrencyIcon = {
    [ChainId.HECO]: {
      icon: HECO,
      title: 'Heco'
    },
    [ChainId.BSC]: {
      icon: BSC,
      title: 'Binance Smart Chain'
    },
  [ChainId.MATIC]: {
    icon: MATIC,
    title: 'MATIC'
  }
  }

var web3HECO = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.HECO)))
var web3BSC = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.BSC)))

/*const pair = [
  128: {
    is_burn: true,
    stake_address: WAR_ADDRESS(128),
      stake: "swapAndBurn",
    abi: BurnSwapAbi,
    chainswap_address: WAR_ADDRESS(128),
    token_address: WAR_ADDRESS(128)
  }
]*/

const BridgeList = ({onExtractItem, getList, bridgeCardConfig}) => {
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(false)
    // {
    //   account: '0x12xxx',
    //   extractAmount: "0",
    //   fromChainId: 128,
    //   nonce: 2,
    //   pledgeAmount: "0.00001",
    //   toChainId: 56
    // }
  const createContract = (fromChainId, toChainId) => {
    const fromConfig = bridgeCardConfig(fromChainId)
    const toConfig = bridgeCardConfig(toChainId)
    const fromPledgeAmountConcat = new Contract(fromConfig.war_burn_address, fromConfig.war_burn_abi)
    const toPledgeAmountConcat = new Contract(toConfig.war_burn_address, toConfig.war_burn_abi)
    // 燃烧的话，from与to都应是燃烧的配置
    return {
      fromPledgeAmountConcat: toConfig.is_burn ? toPledgeAmountConcat : fromPledgeAmountConcat,
      toPledgeAmountConcat
    }
  }
  /**
   * 获取跨链数据
   */
  const getCrossChainData = () => {
    // 查询 源链 ChainSwap合约中 sentCount(toChainId, to) ，得到 maxNonce
    // 查询所有质押的数据，遍历 源链
    const getPledgeData = (fromChainId, toChainId, maxNonce) => {
      const multicallProvider = getOnlyMultiCallProvider(fromChainId)
      const {fromPledgeAmountConcat, toPledgeAmountConcat} = createContract(fromChainId, toChainId)
      const extractAmountAll = []
      let pledgeAmountAll = []
      for (let nonce = 0; nonce < maxNonce; nonce++) {
        pledgeAmountAll.push(toPledgeAmountConcat.sent(toChainId, account, nonce))
        extractAmountAll.push(fromPledgeAmountConcat.received(fromChainId, account, nonce))
      }
      return Promise.all([multicallProvider.all(pledgeAmountAll),multicallProvider.all(extractAmountAll)]).then(res => {
        let pledgeAmountData = processResult(res[0])
        console.log(pledgeAmountData)
        let extractAmountData = processResult(res[1])
        return pledgeAmountData.reduce((l, item, index)=>{
          l.push({
            nonce: index,
            pledgeAmount: web3BSC.utils.fromWei(pledgeAmountData[index], 'ether'),
            extractAmount: web3BSC.utils.fromWei(extractAmountData[index], 'ether'),
            toChainId,
            fromChainId,
            account
          })
          return l
        }, [])
      })
    }
    setHistoryData([])
    setLoading(true)
    // 每一个跨链方向[to, from]
    const directions = [{
      from: ChainId.HECO,
      to: ChainId.BSC
    }, {
      from: ChainId.BSC,
      to: ChainId.HECO
    },{
      from: ChainId.HECO,
      to: ChainId.MATIC
    }]
    // 获取maxNonce
    const sentCountArr = directions.reduce((l, i)=>{
      const tConfig = bridgeCardConfig(i.to)
      let tContract  = new web3HECO.eth.Contract(tConfig.war_burn_abi,tConfig.war_burn_address);
      l.push(tContract.methods.sentCount(i.to, account).call())
      return l
    }, [])

    Promise.all(sentCountArr).then(maxNonceArr => {
      console.log('maxNonceArr', maxNonceArr)
      // 获取签名后数据
      const getPledgeDataArr = directions.reduce((l, item, idx)=>{
        l.push(getPledgeData(item.from, item.to, maxNonceArr[idx]))
        return l
      }, [])
      Promise.all(getPledgeDataArr).then(result => {
        console.log(result.flat(1))
        setHistoryData(result.flat(1))
        setLoading(false)
      })
    })
  }
  useEffect(() => {
    if (account){
      getCrossChainData()
    }
  }, [getList])
  useEffect(() => {
    if (account && historyData.length === 0){
      getCrossChainData()
    }
  }, [account])
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
                    <img className='icon' src={WAR} /> WAR
                  </td>
                  <td>
                    <img src={CurrencyIcon[item.fromChainId].icon} /> {CurrencyIcon[item.fromChainId].title}
                  </td>
                  <td>
                    <img src={CurrencyIcon[item.toChainId].icon} /> {CurrencyIcon[item.toChainId].title}
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
                 <h2><img className='icon' src={WAR} /> WAR</h2>
                 {
                   item.status == 2 && <img src={Right} />
                 }
               </div>
               <div className='bridge_list_data_title'>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge7' /></p>
                   <p><img className='success_status' src={CurrencyIcon[item.fromChainId].icon} /> {CurrencyIcon[item.fromChainId].title}</p>
                 </div>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge8' /></p>
                   <p style={{ textAlign: 'right' }}><img className='success_status' src={CurrencyIcon[item.toChainId].icon} /> {CurrencyIcon[item.toChainId].title}</p>
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
      {
        historyData.length === 0 && loading && <Skeleton active />
      }
    </div>
  )
}

export default injectIntl(BridgeList)