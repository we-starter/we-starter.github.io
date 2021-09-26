import React, {useContext, useEffect, useMemo, useState, forwardRef} from 'react'
import cs from 'classnames'
import { Button, message, Modal, Select } from 'antd'
import {getContract, getWeb3, useActiveWeb3React} from '../../web3'
import { mainContext } from '../../reducer'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatAmount, fromWei, numToWei } from '../../utils/format'
import Web3 from 'web3'
import {
    HANDLE_WALLET_MODAL, HANDLE_WITHDRAW_MODAL
} from '../../const'
import WAR from '../../assets/icon/WAR@2x.png'
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import MATIC from '../../assets/icon/MATIC@2x.png'
import SwapLine from '../../assets/icon/swap-line@2x.png'
import {useBalance} from "../../pages/Hooks"
import {
  ChainId,
  WAR_ADDRESS,
  CHAIN_SWAP_ADDRESS,
  RPC_URLS,
  CHAIN_SWAP_NODE_REQ_URL,
  BURN_SWAP_ADDRESS, MDEX_ROUTER_ADDRESS, BURN_SWAP_S_ADDRESS, GAS_FEE
} from "../../web3/address"
import ERC20 from '../../web3/abi/ERC20.json'
import {changeNetwork} from "../../connectors"
import qs from 'qs'
import axios from "axios"
import SwitchWithdrawPopup from '../../components/migrate/switchWithdrawPopup'
import MigrateList from "./migrateList";
import { useAllowance } from '../../pages/Hooks'

import {bridgeCardConfig} from "./config";
const { Option } = Select
let web3 = new Web3(window.ethereum);

export const BRIDGE_TYPE_NORMAL = 1
export const BRIDGE_TYPE_BURN = 2

const fromChainSelectData = [
    {
        icon: HECO,
        value: 'Heco',
        chainId: ChainId.HECO
    },
    {
        icon: BSC,
        value: 'BSC',
        chainId: ChainId.BSC
    }
]
const toChainSelectData = [
    {
        icon: HECO,
        value: 'Heco',
        chainId: ChainId.HECO
    },
    {
        icon: BSC,
        value: 'BSC',
        chainId: ChainId.BSC
    },
    {
        icon: MATIC,
        value: 'MATIC',
        chainId: ChainId.MATIC
    }
]
// const debounceChangeNetwork = debounce((active, chainId)=>{
//     if (!active || (chainId !== ChainId.HECO && chainId !== ChainId.BSC)){
//         changeNetwork(ChainId.HECO).then()
//     }
// }, 500)

const BridgeCard = (props) => {
    const { intl } = props
    const { account, active, library, chainId } = useActiveWeb3React()

    const { balance } = useBalance(WAR_ADDRESS(chainId), chainId)
    const [pool, setPool] = useState([])
    const [amount, setAmount] = useState('')
    const [approve, setApprove] = useState(true)
    const [loadFlag, setLoadFlag] = useState(false)
    const [loading, setLoading] = useState(false)
    const [approveLoading, setApproveLoading] = useState(false)

    const { dispatch, state } = useContext(mainContext)

    const [transferData, setTransferData] = useState({
        account,
        extractAmount: "0",
        fromChainId: 128,
        nonce: 0,
        pledgeAmount: "0.00001",
        toChainId: 56,
        assets: 'WAR'
    })//质押的数据，用于提取

    const [getList, setGetList] = useState(0)

    const [fromChainId, setFromChainId] = useState(ChainId.HECO)
    const [toChainId, setToChainId] = useState(ChainId.MATIC)

    const [visibleSwitchWithdrawPopup, setVisibleSwitchWithdrawPopup] = useState(false)

    // 是否已经授权
    const BURNAllowance = useAllowance(WAR_ADDRESS(chainId), BURN_SWAP_ADDRESS, account)

    const config = bridgeCardConfig(fromChainId, toChainId)

    // useEffect(()=>{
    //     debounceChangeNetwork(active, chainId)
    // }, [active, chainId])

    const onChange = (e) => {
        const value = e.target.value
        const maxAmount = formatAmount(balance)
        let resultAmount = Number(value) > Number(maxAmount) ? maxAmount : value
        const point = resultAmount.toString().split(".")
        if (point[1] && point[1].length > 6) {
            resultAmount = Number(resultAmount).toFixed(6)
        }
        setAmount(resultAmount)
    }

    const onMax = () => {
        setAmount(formatAmount(balance))
    }
    /**
     * 授权
     */
    const onApprove = () => {
        setApproveLoading(true)
        let myContract = new web3.eth.Contract(ERC20.abi, WAR_ADDRESS(chainId));
        myContract.methods
            .approve(
                BURN_SWAP_ADDRESS,
                web3.utils.toTwosComplement(-1)
            )
            .send({
                from: account,
              ...GAS_FEE(chainId)
            })
            .on('receipt', (_, receipt) => {
                setApproveLoading(false)
                console.log('approve success')
            })
            .on('error', (err, receipt) => {
                setApproveLoading(false)
                console.log('approve error', err)
            })
    }

    /**
     * config
     */
    const onConfig = () => {
        if (!amount || amount == 0) {
            return
        }
        setLoading(true)
        let myContract = new web3.eth.Contract(config.stackContract.abi, config.stackContract.address);
        const params = config.type === BRIDGE_TYPE_BURN ? [web3.utils.toWei(amount, 'ether'), toChainId, account] : [toChainId, account, web3.utils.toWei(amount, 'ether')]
        console.log(params)
        myContract.methods[config.stackContract.method](...params).send({
            from: account,
            value: web3.utils.toWei('0.005', 'ether'),
          ...GAS_FEE(chainId)
        }).then(() => {
            // save transfer data
            setTransferData({
                fromChainId: chainId,
                account,
                toChainId,
                pledgeAmount: amount
            })
            setLoading(false)
            setVisibleSwitchWithdrawPopup(true)
            console.log('success')
            setGetList(getList+1)
        }).catch(error => {
            setLoading(false)
            console.log('fail', error)
        })
    }

    useEffect(() => {
        if ((chainId === ChainId.HECO || chainId === ChainId.BSC) && !visibleSwitchWithdrawPopup) {
            if (chainId === toChainId) {
                const toChainItem = toChainSelectData.find(i => i.chainId !== chainId)
                setToChainId(toChainItem.chainId)
            } else {
                setFromChainId(chainId)
            }
        }
    }, [chainId])

    /**
     * 获取签名数据
     */
    const getSignData = (callback) => {
        const config = bridgeCardConfig(transferData.fromChainId, transferData.toChainId)
        let signData = {
            contractAddress: config.chainswapContract.address,
            toContract: config.chainswapContract.address,
            mainContract: config.chainswapContract.address,
            fromChainId: transferData.fromChainId,
            fromContract: config.chainswapContract.address,
            to: transferData.account,
            toChainId: transferData.toChainId,
        }
        // 如果是item调用，无需获取nonce
        if (transferData.isItem){
            signData.nonce = transferData.nonce
            callback(signData)
            return
        }

        let web3 = new Web3(new Web3.providers.HttpProvider(RPC_URLS(fromChainId)))
        let myContract = new web3.eth.Contract(config.chainswapContract.abi, config.chainswapContract.address);
        myContract.methods.sentCount(transferData.toChainId, account).call(
            {
                from: account
            }
        ).then(res =>{
            console.log(res)
            signData.nonce = Math.max(0, res - 1)
            transferData.nonce = signData.nonce
            setTransferData(transferData)
            callback(signData)
        }).catch((error) => {
            message.error('sign error')
            console.log('error', error)
            setLoading(false)
        })
    }

    /**
     * 获取签名结果
     */
    const getSignResultData = (callback) => {
        setLoading(true)
        let t = true
        getSignData((signData) => {
            console.log(signData)
            let params = qs.stringify(signData, { encodeValuesOnly: true })
            let signResultData = []
            CHAIN_SWAP_NODE_REQ_URL.map(item => {
                axios.get(item + '?' + params).then(res => {
                    console.log('res', res)
                    if (signResultData.length === 3 && t) {
                        t = false
                        setLoading(false)
                        callback(signResultData)
                    } else {
                        let {signatory,signV, signR, signS} = res.data.data
                        signResultData.push([signatory, signV, signR, signS])
                    }
                })
            })
        })
    }

    /**
     * 提取
     */
    const onExtract = (callback) => {
        let web3 = new Web3(window.ethereum);
        const config = bridgeCardConfig(transferData.fromChainId, transferData.toChainId)
        let myContract = new web3.eth.Contract(config.chainswapContract.abi, config.chainswapContract.address);
        getSignResultData((signResultData) => {
            console.log(signResultData)
            myContract.methods.receive(transferData.fromChainId, transferData.account, transferData.nonce, web3.utils.toWei(transferData.pledgeAmount, 'ether'), signResultData).send({
                from: account,
                value: web3.utils.toWei('0.005', 'ether'),
              ...GAS_FEE(chainId)
            }).then(() => {
                console.log('success')
                // 成功后弹框提示
                dispatch({
                    type: HANDLE_WITHDRAW_MODAL,
                    withdrawModal: true,
                })
                setVisibleSwitchWithdrawPopup(false)
                setGetList(getList + 1)
                callback && callback()
            }).catch(error => {
                message.error('extract fail')
                console.log('fail', error)
                callback && callback()
            })
        })
    }

    /**
     * 列表数据点击提取
     * @param item
     */
    const onExtractItem = (item) => {
        console.log(item)
        item.isItem = true
        setTransferData(item)
        setVisibleSwitchWithdrawPopup(true)
    }
    return (
      <React.Fragment>
        <div className='bridge_card'>
          <div className='bridge_card_title'>
            <FormattedMessage id='bridge1' />{config.toChainName} {config.toFullName && `(${config.toFullName})`}
          </div>
          <div className='deposit__inputbox form-app__inputbox'>
            <div className='form-app__inputbox-control'>
              <div className='form-app__inputbox-input'>
                <input
                  style={{ background: '#fff' }}
                  value={amount}
                  type='number'
                  onChange={onChange}
                  className='input'
                  placeholder={intl.formatMessage({
                    id: 'amount',
                  })}
                />
              </div>

              <div className='form-app__inputbox-up' onClick={onMax}>
                <div className='form-app__inputbox-up-pref'>
                  <FormattedMessage id='poolText19' />
                </div>
              </div>
              {/* 选择币种 */}
              <a className='set_slippage'>
                <img src={WAR} />
                WAR
              </a>
            </div>
          </div>
          <div className='bridge_card_from_to'>
            <div className='bridge_card_from'>
              <p className='bridge_card_from_text'>
                <FormattedMessage id='bridge7' />
              </p>
                <ChainSelect chainSelectData={fromChainSelectData} chainId={fromChainId} setChainId={(val) => {
                    if (val === toChainId) {
                        const toChainItem = toChainSelectData.find(i => i.chainId !== val)
                        setToChainId(toChainItem.chainId)
                    }
                    setFromChainId(val)
                }} type='from' loading={loading}/>
            </div>
            <img
              className='bridge_card_transform'
              src={SwapLine}/>
            <div className='bridge_card_from'>
              <p className='bridge_card_from_text'>
                <FormattedMessage id='bridge8' />
              </p>
              {/* <p className='bridge_card_from_chain'>
                <ChainBtn chainId={toChainId} />
              </p> */}
              <ChainSelect chainSelectData={toChainSelectData} chainId={toChainId} hiddenId={fromChainId} setChainId={(val)=>{
                  if (val === fromChainId) {
                      const fromChainItem = fromChainSelectData.find(i=>i.chainId !== val)
                      setFromChainId(fromChainItem.chainId)
                  }
                  setToChainId(val)
              }} loading={loading}/>
            </div>
          </div>
          <p className='bridge_card_input_title'>
            <FormattedMessage id='bridge2' />
          </p>
          <div className='deposit__inputbox form-app__inputbox'>
            <div className='form-app__inputbox-control'>
              <div className='form-app__inputbox-input'>
                <input
                  style={{ background: '#fff' }}
                  disabled
                  value={account || ''}
                  className='input disable_input'
                  placeholder={account}
                />
              </div>

              {/* 地址跳转 */}
              {/*<a className='set_slippage copy_address' href='https://hecoinfo.com/address/0x23fcb0e1ddbc821bd26d5429ba13b7d5c96c0de0' target='_blank'>*/}
              {/*  <svg*/}
              {/*    t='1619095072712'*/}
              {/*    className='icon'*/}
              {/*    viewBox='0 0 1024 1024'*/}
              {/*    version='1.1'*/}
              {/*    xmlns='http://www.w3.org/2000/svg'*/}
              {/*    p-id='1281'*/}
              {/*    width='20'*/}
              {/*    height='20'*/}
              {/*  >*/}
              {/*    <path*/}
              {/*      d='M424.96 128v87.04H215.04v599.04h599.04v-215.04h87.04v256c0 25.6-20.48 40.96-40.96 40.96H168.96c-25.6 0-40.96-20.48-40.96-40.96V168.96c0-25.6 20.48-40.96 40.96-40.96h256z m327.68 87.04h-194.56V128h343.04v343.04h-87.04V271.36L512 573.44 450.56 512l302.08-296.96z'*/}
              {/*      p-id='1282'*/}
              {/*    ></path>*/}
              {/*  </svg>*/}
              {/*</a>*/}
            </div>
          </div>

            {
                fromChainId !== chainId ? (
                    <Button
                        className={'btn'}
                        type='button'
                        onClick={()=>{
                            changeNetwork(fromChainId).then()
                        }}
                    >
                        <FormattedMessage id={`poolTextS${config.fromChainId}`} />
                    </Button>
                ) : config.isNeedApprove && BURNAllowance < Number(amount) ? (
                    <Button
                        className={'btn'}
                        type='button'
                        onClick={onApprove}
                        loading={approveLoading}
                    >
                        <FormattedMessage id='farm20'/>
                    </Button>
                ) : (
                    <Button
                        className={'btn'}
                        type='button'
                        onClick={onConfig}
                        loading={loading}
                    >
                        <FormattedMessage id={loading ? 'waitingText' : 'modalsText15'} />
                    </Button>
                )
            }
          <div className='lbp_tip'>
            <p>
                {config.type === BRIDGE_TYPE_BURN && (<><FormattedMessage id='bridge300' />WAR({config.fromChainName})<FormattedMessage id='bridge301' /></>)}
            </p>
            <p>
              <FormattedMessage id='bridge4' />
            </p>
          </div>
        </div>
        <MigrateList onExtractItem={onExtractItem} getList={getList}/>
        <SwitchWithdrawPopup
          visible={visibleSwitchWithdrawPopup}
          onClose={() => setVisibleSwitchWithdrawPopup(false)}
          onExtract={onExtract}
          transferData={transferData}
        />
      </React.Fragment>
    )
}

const ChainSelect = ({ chainSelectData, chainId, hiddenId, setChainId, loading}) => {
  return (
        <Select value={chainId} onChange={setChainId} disabled={loading}>
            {
                chainSelectData.map((item) => (
                    hiddenId !== item.chainId &&
                    <Option value={item.chainId} key={item.chainId} disabled={item.chainId === chainId} className='bridge_card_from_chain_option'>
                        <p className='bridge_card_from_chain bridge_card_from_chain_select'>
                            <img src={item.icon} />
                            {item.value}
                        </p>
                    </Option>
                ))
            }

        </Select>
  )
}
export default injectIntl(BridgeCard)
