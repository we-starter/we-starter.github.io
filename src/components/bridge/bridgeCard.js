import React, {useContext, useEffect, useMemo, useState, forwardRef} from 'react'
import cs from 'classnames'
import { Button, message, Modal, Select } from 'antd'
import { getContract, useActiveWeb3React } from '../../web3'
import { mainContext } from '../../reducer'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatAmount, fromWei, numToWei } from '../../utils/format'
import Web3 from 'web3'
import {
    HANDLE_WALLET_MODAL, HANDLE_WITHDRAW_MODAL
} from '../../const'
import { getRandomIntInclusive } from '../../utils/index'
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
    BURN_SWAP_ADDRESS, MDEX_ROUTER_ADDRESS, BURN_SWAP_S_ADDRESS
} from "../../web3/address"
import ChainSwapAbi from '../../web3/abi/ChainSwap.json'
import BurnSwapAbi from '../../web3/abi/BurnSwap.json'
import ERC20 from '../../web3/abi/ERC20.json'
import {changeNetwork} from "../../connectors"
import qs from 'qs'
import axios from "axios"
import SwitchWithdrawPopup from '../../components/bridge/switchWithdrawPopup'
import BridgeList from "./bridgeList";
import { useAllowance } from '../../pages/Hooks'
import {JsonRpcProvider} from "@ethersproject/providers";
import {debounce} from "lodash/function";
const { Option } = Select
let web3 = new Web3(window.ethereum);

// 配置
const bridgeCardConfig = (cId) => {
    return {
        [ChainId.HECO]: {
            war_burn_address: WAR_ADDRESS(cId),
            war_burn_abi: ChainSwapAbi,
            abi: ChainSwapAbi,
            chainswap_address: CHAIN_SWAP_ADDRESS(cId),
            token_address: WAR_ADDRESS(cId)
        },
        [ChainId.BSC]: {
            war_burn_address: WAR_ADDRESS(cId),
            war_burn_abi: ChainSwapAbi,
            abi: ChainSwapAbi,
            chainswap_address: CHAIN_SWAP_ADDRESS(cId),
            token_address: WAR_ADDRESS(cId)
        },
        [ChainId.MATIC]: {
            war_burn_address: BURN_SWAP_S_ADDRESS,
            war_burn_abi: ChainSwapAbi,
            is_burn: true,
            chainswap_address: BURN_SWAP_S_ADDRESS,
            token_address: BURN_SWAP_ADDRESS,
            abi: BurnSwapAbi,
        }
    }[cId]

}

const debounceChangeNetwork = debounce((active, chainId)=>{
    if (!active || (chainId !== ChainId.HECO && chainId !== ChainId.BSC)){
        changeNetwork(ChainId.HECO).then()
    }
}, 500)

const BridgeCard = (props) => {
    const { intl } = props
    const { account, active, library, chainId } = useActiveWeb3React()

    const { balance } = useBalance(WAR_ADDRESS(chainId))
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
        nonce: 2,
        pledgeAmount: "0.00001",
        toChainId: 56,
        assets: 'WAR'
    })//质押的数据，用于提取

    const [getList, setGetList] = useState(0)
    const [toChainId, setToChainId] = useState(null)

    const [visibleSwitchWithdrawPopup, setVisibleSwitchWithdrawPopup] = useState(false)

    const chainSelectData = [
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
            value: 'Polygon',
            chainId: ChainId.MATIC
        }
    ]
    const [fromChainSelectData, setFromChainSelectData] = useState([])
    const [toChainSelectData, setToChainSelectData] = useState([])

    // 是否已经授权
    const BURNAllowance = useAllowance(WAR_ADDRESS(chainId), BURN_SWAP_ADDRESS, account)

    // 通过ChainId过滤select
    useEffect(() => {
        // from filter thisChainId and MATIC
        setFromChainSelectData(chainSelectData.filter(i => i.chainId !== chainId && i.chainId !== ChainId.MATIC))
        // from filter fromChainId
        const newToChainSelectData = chainSelectData.filter(i => i.chainId !== chainId)
        setToChainSelectData(newToChainSelectData)
        if (toChainId === chainId || !toChainId) {
            setToChainId(newToChainSelectData[0].chainId)
        }
    }, [chainId])

    // useEffect(()=>{
    //     debounceChangeNetwork(active, chainId)
    // }, [active, chainId])

    const onChange = (e) => {
        const value = e.target.value
        const maxAmount = formatAmount(balance)
        setAmount(Number(value) > Number(maxAmount) ? maxAmount : value)
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
     * 质押
     */
    const onPledge = () => {
        if (!amount || amount == 0) {
            return
        }
        setLoading(true)
        let myContract = new web3.eth.Contract(ChainSwapAbi, CHAIN_SWAP_ADDRESS(chainId));
        myContract.methods.send(toChainId, account, web3.utils.toWei(amount, 'ether')).send({
            from: account,
            value: web3.utils.toWei('0.005', 'ether')
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

    /**
     * 燃烧
     */
    const onBurn = () => {
        if (!amount || amount == 0) {
            return
        }
        setLoading(true)
        let myContract = new web3.eth.Contract(BurnSwapAbi, BURN_SWAP_ADDRESS);
        myContract.methods.swapAndSend(web3.utils.toWei(amount, 'ether'), toChainId, account).send({
            from: account,
            value: web3.utils.toWei('0.005', 'ether')
        }).then(() => {

            setLoading(false)
            // setVisibleSwitchWithdrawPopup(true)
            console.log('success')
            setGetList(getList+1)
        }).catch(error => {
            setLoading(false)
            console.log('fail', error)
        })
    }

    /**
     * 获取签名数据
     */
    const getSignData = (callback) => {
        const fromConfig = bridgeCardConfig(transferData.fromChainId)
        const toConfig = bridgeCardConfig(transferData.toChainId)
        let signData = {
            contractAddress: toConfig.war_burn_address, //CHAIN_SWAP_ADDRESS(transferData.toChainId),
            toContract: toConfig.war_burn_address, //CHAIN_SWAP_ADDRESS(transferData.toChainId),
            mainContract: toConfig.war_burn_address, //CHAIN_SWAP_ADDRESS(transferData.toChainId),
            fromChainId: transferData.fromChainId,
            fromContract: fromConfig.war_burn_address, //CHAIN_SWAP_ADDRESS(transferData.fromChainId),
            to: transferData.account,
            toChainId: transferData.toChainId,
        }
        // 如果是item调用，无需获取nonce
        if (transferData.isItem){
            signData.nonce = transferData.nonce
            callback(signData)
            return
        }
        let web3 = new Web3(window.ethereum);
        let myContract = new web3.eth.Contract(toConfig.war_burn_abi, toConfig.war_burn_address);
        myContract.methods.sentCount(transferData.toChainId, account).call().then(res =>{
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
        const fromConfig = bridgeCardConfig(transferData.fromChainId)
        const toConfig = bridgeCardConfig(transferData.toChainId)
        let myContract = new web3.eth.Contract(toConfig.war_burn_abi, toConfig.war_burn_address);
        getSignResultData((signResultData) => {
            myContract.methods.receive(transferData.toChainId, transferData.account, transferData.nonce, web3.utils.toWei(transferData.pledgeAmount, 'ether'), signResultData).send({
                from: account,
                value: web3.utils.toWei('0.005', 'ether')
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
            <FormattedMessage id='bridge1' />
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
                    id: 'money',
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
                <ChainSelect chainSelectData={fromChainSelectData} chainId={chainId} type='from'/>
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
              <ChainSelect chainSelectData={toChainSelectData} chainId={toChainId} type='to' setToChainId={setToChainId}/>
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
              <a className='set_slippage copy_address'>
                <svg
                  t='1619095072712'
                  className='icon'
                  viewBox='0 0 1024 1024'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                  p-id='1281'
                  width='20'
                  height='20'
                >
                  <path
                    d='M424.96 128v87.04H215.04v599.04h599.04v-215.04h87.04v256c0 25.6-20.48 40.96-40.96 40.96H168.96c-25.6 0-40.96-20.48-40.96-40.96V168.96c0-25.6 20.48-40.96 40.96-40.96h256z m327.68 87.04h-194.56V128h343.04v343.04h-87.04V271.36L512 573.44 450.56 512l302.08-296.96z'
                    p-id='1282'
                  ></path>
                </svg>
              </a>
            </div>
          </div>

            {toChainId === ChainId.MATIC && BURNAllowance < Number(amount) ? (
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
                    onClick={toChainId === ChainId.MATIC ? onBurn : onPledge}
                    loading={loading}
                >
                    <FormattedMessage id='modalsText15' />
                </Button>
            )
            }
          <div className='lbp_tip'>
            <p>
              <FormattedMessage id='bridge3' />
            </p>
            <p>
              <FormattedMessage id='bridge4' />
            </p>
          </div>
        </div>
        <BridgeList onExtractItem={onExtractItem} getList={getList} bridgeCardConfig={bridgeCardConfig}/>
        <SwitchWithdrawPopup
          visible={visibleSwitchWithdrawPopup}
          onClose={() => setVisibleSwitchWithdrawPopup(false)}
          onExtract={onExtract}
          transferData={transferData}
        />
      </React.Fragment>
    )
}
 const handleChange = (value, type, setToChainId) => {
    if (type === 'from') {
        changeNetwork(value).then()
    } else {
        setToChainId(value)
    }
 }

const ChainSelect = ({ chainSelectData, chainId, type, setToChainId }) => {
  return (
        <Select value={chainId} onChange={(val)=>handleChange(val, type, setToChainId)}>
            {
                chainSelectData.map((item) => (
                    <Option value={item.chainId} key={item.chainId}>
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
