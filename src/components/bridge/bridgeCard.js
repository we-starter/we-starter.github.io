import React, {useContext, useEffect, useMemo, useState, forwardRef} from 'react'
import cs from 'classnames'
import { Button, message, Modal } from 'antd'
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
import SwapLine from '../../assets/icon/swap-line@2x.png'
import {useBalance} from "../../pages/Hooks"
import {ChainId, WAR_ADDRESS, CHAIN_SWAP_ADDRESS, RPC_URLS, CHAIN_SWAP_NODE_REQ_URL} from "../../web3/address"
import ChainSwapAbi from '../../web3/abi/ChainSwap.json'
import {changeNetwork} from "../../connectors"
import qs from 'qs'
import axios from "axios"
import SwitchWithdrawPopup from '../../components/bridge/switchWithdrawPopup'
import BridgeList from "./bridgeList";

const BridgeCard = (props) => {
    const { intl } = props
    const { account, active, library, chainId } = useActiveWeb3React()

    const { balance } = useBalance(WAR_ADDRESS(chainId))
    const [pool, setPool] = useState([])
    const [amount, setAmount] = useState('')
    const [approve, setApprove] = useState(true)
    const [loadFlag, setLoadFlag] = useState(false)
    const [loading, setLoading] = useState(false)

  const { dispatch, state } = useContext(mainContext)

    const [pledgeHistory, setPledgeHistory] = useState([])
    const [transferData, setTransferData] = useState({
        account,
        extractAmount: "0",
        fromChainId: 128,
        nonce: 2,
        pledgeAmount: "0.00001",
        toChainId: 56,
        assets: 'WAR'
    })//质押的数据，用于提取

    const toChainId = chainId === ChainId.HECO ? ChainId.BSC : ChainId.HECO

    const [visibleSwitchWithdrawPopup, setVisibleSwitchWithdrawPopup] = useState(false)

    useEffect(() => {
        if (!active) {
            if (chainId !== ChainId.HECO && chainId !== ChainId.BSC) {
                changeNetwork(ChainId.HECO).then()
            }
        }
    }, [chainId])

    const onChange = (e) => {
        const value = e.target.value
        const maxAmount = formatAmount(balance)
        setAmount(Number(value) > Number(maxAmount) ? maxAmount : value)
    }

    const onMax = () => {
        setAmount(formatAmount(balance))
    }

    /**
     * 质押
     */
    const onPledge = () => {
        if (!amount) {
            return
        }
        setLoading(true)
        let web3 = new Web3(window.ethereum);
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
        }).catch(error => {
            setLoading(false)
            console.log('fail', error)
        })
    }

    /**
     * 获取签名数据
     */
    const getSignData = (callback) => {
        let signData = {
            contractAddress: CHAIN_SWAP_ADDRESS(transferData.toChainId),
            toContract: CHAIN_SWAP_ADDRESS(transferData.toChainId),
            mainContract: CHAIN_SWAP_ADDRESS(transferData.toChainId),
            fromChainId: transferData.fromChainId,
            fromContract: CHAIN_SWAP_ADDRESS(transferData.fromChainId),
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
        let myContract = new web3.eth.Contract(ChainSwapAbi, CHAIN_SWAP_ADDRESS(transferData.toChainId));
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
                    console.log(loading)
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
        let myContract = new web3.eth.Contract(ChainSwapAbi, CHAIN_SWAP_ADDRESS(transferData.toChainId));
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
                        <p className='bridge_card_from_text'><FormattedMessage id='bridge7' /></p>
                        <p className='bridge_card_from_chain'>
                            <ChainBtn chainId={chainId}/>
                        </p>
                    </div>
                    <img className='bridge_card_transform' src={SwapLine} onClick={()=>{changeNetwork(toChainId).then()}}/>
                    <div className='bridge_card_from'>
                        <p className='bridge_card_from_text'><FormattedMessage id='bridge8' /></p>
                        <p className='bridge_card_from_chain'>
                            <ChainBtn chainId={toChainId}/>
                        </p>
                    </div>
                </div>
                <p className='bridge_card_input_title'><FormattedMessage id='bridge2' /></p>
                <div className='deposit__inputbox form-app__inputbox'>
                    <div className='form-app__inputbox-control'>
                        <div className='form-app__inputbox-input'>
                            <input
                                style={{ background: '#fff' }}
                                disabled
                                value={account||''}
                                className='input'
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

                {/*{approve && (*/}
                {/*  <Button*/}
                {/*    className={'btn'}*/}
                {/*    type='button'*/}
                {/*    onClick={onApprove}*/}
                {/*  >*/}
                {/*    <FormattedMessage id='farm20' />*/}
                {/*  </Button>*/}
                {/*)}*/}
                <Button
                    className={'btn'}
                    type='button'
                    onClick={onPledge}
                    loading={loading}
                >
                    <FormattedMessage id='modalsText15' />
                </Button>
                <div className='lbp_tip'>
                    <p>
                        <FormattedMessage id='bridge3' />
                    </p>
                    <p>
                        <FormattedMessage id='bridge4' />
                    </p>
                </div>
            </div>
            <BridgeList onExtractItem={onExtractItem}/>
            <SwitchWithdrawPopup
                visible={visibleSwitchWithdrawPopup}
                onClose={()=>setVisibleSwitchWithdrawPopup(false)}
                onExtract={onExtract}
                transferData={transferData}
            />
        </React.Fragment>
    )
}
const ChainBtn = ({chainId}) => {
    return {
        [ChainId.HECO]: (<>
            <img src={HECO} />
            Heco
            </>),
        [ChainId.BSC]: (<>
            <img src={BSC} />
            Binance Smart Chain
        </>)
    }[chainId] || null
}
export default injectIntl(BridgeCard)
