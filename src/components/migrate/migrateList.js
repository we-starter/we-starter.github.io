import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { Button, Skeleton } from 'antd'
import { mainContext } from '../../reducer'
// 处理格式 千位符
import { formatNumber } from 'accounting'
import { formatAmount, formatAddress } from '../../utils/format'
import Right from '../../assets/icon/right@2x.png'
import Web3 from "web3";
import {BURN_SWAP_ADDRESS, BURN_SWAP_S_ADDRESS, ChainId, RPC_URLS} from "../../web3/address";
import { getOnlyMultiCallProvider, processResult } from '../../utils/multicall'
import {Contract} from "ethers-multicall-x";
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import MATIC from '../../assets/icon/MATIC@2x.png'
import {bridgeCardConfig} from "./config";

const CurrencyIcon = {
    [ChainId.HECO]: {
      icon: HECO,
      title: 'Heco'
    },
    [ChainId.BSC]: {
      icon: BSC,
      title: 'BSC'
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

const MigrateList = ({onExtractItem, getList}) => {
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
    const config = bridgeCardConfig(fromChainId, toChainId)
    return new Contract(config.chainswapContract.address, config.chainswapContract.abi)
  }
  /**
   * 获取跨链数据
   */
  const getCrossChainData = () => {
    // 查询 源链 ChainSwap合约中 sentCount(toChainId, to) ，得到 maxNonce
    // 查询所有质押的数据，遍历 源链
    const getPledgeData = (fromChainId, toChainId, maxNonce) => {
      const fromMulticallProvider = getOnlyMultiCallProvider(fromChainId)
      const toMulticallProvider = getOnlyMultiCallProvider(toChainId)
      const pledgeAmountConcat = createContract(fromChainId, toChainId)
      const extractAmountAll = []
      let pledgeAmountAll = []
      for (let nonce = 0; nonce < maxNonce; nonce++) {
        pledgeAmountAll.push(pledgeAmountConcat.sent(toChainId, account, nonce))
        extractAmountAll.push(pledgeAmountConcat.received(fromChainId, account, nonce))
      }
      return Promise.all([fromMulticallProvider.all(pledgeAmountAll),toMulticallProvider.all(extractAmountAll)]).then(res => {
        let pledgeAmountData = processResult(res[0])
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
    },{
      from: ChainId.BSC,
      to: ChainId.MATIC
    }]
    // const directions = [
    //     {
    //     from: ChainId.HECO,
    //     to: ChainId.BSC
    //   }]
    // 获取maxNonce
    const sentCountArr = directions.reduce((l, i)=>{
      const config = bridgeCardConfig(i.from, i.to)
      const web3_ = new Web3(new Web3.providers.HttpProvider(RPC_URLS(i.from)))
      let tContract  = new web3_.eth.Contract(config.chainswapContract.abi,config.chainswapContract.address);
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
        const arr = result.flat(1).sort(i=>i.extractAmount - i.pledgeAmount)
        console.log(arr)
        setHistoryData(arr)
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
              const itemConfig = bridgeCardConfig(item.fromChainId, item.toChainId)
              return (
                <tr key={index}>
                  <td className='tbody_title'>
                    <span>
                      <img className='icon' src={itemConfig.assets.fromAssetsIcon} /> {itemConfig.assets.fromAssets}
                    </span>
                    {
                      itemConfig.assets.fromAssets !== itemConfig.assets.toAssets &&
                      <>
                        <span className='assets_arrow'/>
                        <span>
                          <img className='icon' src={itemConfig.assets.toAssetsIcon} /> {itemConfig.assets.toAssets}
                        </span>
                      </>
                    }
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
           const itemConfig = bridgeCardConfig(item.fromChainId, item.toChainId)
           return (
             <div className='bridge_list_data' key={index}>
               <div className='bridge_list_data_title'>
                 <div className='from_to_assets'>
                   <span>
                      <img className='icon' src={itemConfig.assets.fromAssetsIcon} /> {itemConfig.assets.fromAssets}
                    </span>
                   {
                     itemConfig.assets.fromAssets !== itemConfig.assets.toAssets &&
                     <>
                       <span className='assets_arrow'/>
                        <span>
                          <img className='icon' src={itemConfig.assets.toAssetsIcon} /> {itemConfig.assets.toAssets}
                        </span>
                     </>
                   }
                 </div>

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

export default injectIntl(MigrateList)