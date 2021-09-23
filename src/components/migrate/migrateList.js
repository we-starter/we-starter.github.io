import React, {useContext, useEffect, useState} from 'react'
import cs from 'classnames'
import {useActiveWeb3React} from '../../web3'
import {FormattedMessage, injectIntl} from 'react-intl'
import BigNumber from 'bignumber.js'
import {Button, Skeleton} from 'antd'
import {mainContext} from '../../reducer'
// 处理格式 千位符
import {formatNumber} from 'accounting'
import {formatAmount, formatAddress} from '../../utils/format'
import Right from '../../assets/icon/right@2x.png'
import Web3 from "web3";
import {BURN_SWAP_ADDRESS, BURN_SWAP_S_ADDRESS, ChainId, RPC_URLS} from "../../web3/address";
import {getOnlyMultiCallProvider, processResult} from '../../utils/multicall'
import {Contract} from "ethers-multicall-x";
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import MATIC from '../../assets/icon/MATIC@2x.png'
import {bridgeCardConfig} from "./config";
import axios from "axios";

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
  const {account, active, library, chainId} = useActiveWeb3React()
  const {dispatch, state} = useContext(mainContext)
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
  const getEvenUrl = (chainId_) => {
    const CHAIN_SWAP_ADDRESS = '0x910651f81a605a6ef35d05527d24a72fecef8bf0'
    const topic1 = web3BSC.eth.abi.encodeParameter('uint256', account)
    switch (chainId_) {
      case ChainId.BSC:
        // https://bscscan.com/tx/0x993889a4833e27e767f156e120f496ca023245d5370e8257416b482fbad438a2#eventlog
        return `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=10702533&toBlock=latest&address=${CHAIN_SWAP_ADDRESS}&topic0=0x6b616089d04950dc06c45c6dd787d657980543f89651aec47924752c7d16c888&topic0_1_opr=and&topic1=${topic1}&apikey=PHC8QD3RVPBN49NIUJ6AEIKVC9DRGKQ3M5`
      case ChainId.HECO:
        // https://hecoinfo.com/tx/0xd2fcb51513c9e3373efb077af05d076a6db40fe4f49c23cfa6ae9725145e8e9a#eventlog
        return `https://api.hecoinfo.com/api?module=logs&action=getLogs&fromBlock=8037023&toBlock=latest&address=${CHAIN_SWAP_ADDRESS}&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1=${topic1}&apikey=ZKCTB8MP4Z2UZNJW3GK18S5RD4P5FTECGW`
    }
  }
  /**
   * 获取跨链数据
   */
  const getCrossChainData = () => {
    // 查询from与to的区块链浏览器api，得到事件日志
    if (account) {
      axios.get(getEvenUrl(ChainId.BSC)).then(res => {
        console.log('res',ChainId.BSC, res)
      })
      axios.get(getEvenUrl(ChainId.HECO)).then(res => {
        console.log('res',ChainId.HECO, res)
      })
    }


  }
  useEffect(() => {
    if (account) {
      getCrossChainData()
    }
  }, [getList])
  useEffect(() => {
    if (account && historyData.length === 0) {
      getCrossChainData()
    }
  }, [account])
  return (
    <div className='bridge_list'>
      <div className='bridge_list_tab'>
        <FormattedMessage id='bridge5'/>
      </div>
      <table className='bridge_list_table_pc'>
        <thead>
        <tr>
          <td><FormattedMessage id='bridge6'/></td>
          <td><FormattedMessage id='bridge7'/></td>
          <td><FormattedMessage id='bridge8'/></td>
          <td><FormattedMessage id='bridge2'/></td>
          <td><FormattedMessage id='bridge9'/></td>
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
                      <img className='icon' src={itemConfig.assets.fromAssetsIcon}/> {itemConfig.assets.fromAssets}
                    </span>
                  {
                    itemConfig.assets.fromAssets !== itemConfig.assets.toAssets &&
                    <>
                      <span className='assets_arrow'/>
                      <span>
                          <img className='icon' src={itemConfig.assets.toAssetsIcon}/> {itemConfig.assets.toAssets}
                        </span>
                    </>
                  }
                </td>
                <td>
                  <img src={CurrencyIcon[item.fromChainId].icon}/> {CurrencyIcon[item.fromChainId].title}
                </td>
                <td>
                  <img src={CurrencyIcon[item.toChainId].icon}/> {CurrencyIcon[item.toChainId].title}
                </td>
                <td>{formatAddress(item.account)}</td>
                <td>{item.pledgeAmount}</td>
                <td className='withdraw_status'>
                  {
                    item.extractAmount === item.pledgeAmount ? <img src={Right}/> :
                      <p onClick={() => {
                        onExtractItem(item)
                      }}><FormattedMessage id='bridge10'/></p>
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
                      <img className='icon' src={itemConfig.assets.fromAssetsIcon}/> {itemConfig.assets.fromAssets}
                    </span>
                    {
                      itemConfig.assets.fromAssets !== itemConfig.assets.toAssets &&
                      <>
                        <span className='assets_arrow'/>
                        <span>
                          <img className='icon' src={itemConfig.assets.toAssetsIcon}/> {itemConfig.assets.toAssets}
                        </span>
                      </>
                    }
                  </div>

                </div>
                <div className='bridge_list_data_title'>
                  <div className='bridge_list_data_value'>
                    <p><FormattedMessage id='bridge7'/></p>
                    <p><img className='success_status'
                            src={CurrencyIcon[item.fromChainId].icon}/> {CurrencyIcon[item.fromChainId].title}</p>
                  </div>
                  <div className='bridge_list_data_value'>
                    <p><FormattedMessage id='bridge8'/></p>
                    <p style={{textAlign: 'right'}}><img className='success_status'
                                                         src={CurrencyIcon[item.toChainId].icon}/> {CurrencyIcon[item.toChainId].title}
                    </p>
                  </div>
                </div>
                <div className='bridge_list_data_title'>
                  <div className='bridge_list_data_value'>
                    <p><FormattedMessage id='bridge2'/></p>
                    <p>{formatAddress(item.account)}</p>
                  </div>
                  <div className='bridge_list_data_value'>
                    <p><FormattedMessage id='bridge9'/></p>
                    <p style={{textAlign: 'right'}}>{item.pledgeAmount}</p>
                  </div>
                </div>
                {
                  item.extractAmount !== item.pledgeAmount && (
                    <div className='form-app__submit form-app__submit--row' style={{marginBottom: '20px'}}>
                      <Button
                        className={'btn'}
                        type='button'
                        onClick={() => {
                          onExtractItem(item)
                        }}
                      >
                        <FormattedMessage id='bridge10'/>
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
        historyData.length === 0 && loading && <Skeleton active/>
      }
    </div>
  )
}

export default injectIntl(MigrateList)