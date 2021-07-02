import React, {useContext, useEffect, useState} from 'react'
import {injectIntl} from 'react-intl'
import {FormattedMessage} from 'react-intl'
import {mainContext} from '../../reducer'
import {addToken, getContract, useActiveWeb3React} from '../../web3'
import {ChainId, WAR_ADDRESS} from '../../web3/address'
import {Button, message, Modal} from 'antd'
import {formatAmount} from '../../utils/format'
import {
    HANDLE_WALLET_MODAL,
    HANDLE_WITHDRAW_MODAL
} from '../../const'
import cs from 'classnames'
import {changeNetwork} from "../../connectors";
import {bridgeCardConfig} from "./config";

const SwitchWithdrawPopup = ({visible, onClose, onExtract, transferData}) => {
    const {account, active, library, chainId} = useActiveWeb3React()
    const {dispatch, state} = useContext(mainContext)
    const [loading, setLoading] = useState(false)
    const pledgeStatus = transferData.toChainId === chainId
    const WarTokenAddress =
        WAR_ADDRESS[chainId] || '0x910651F81a605a6Ef35d05527d24A72fecef8bF0'


    const config = bridgeCardConfig(transferData.fromChainId, transferData.toChainId)
    const onAddToken = async () => {
        await addToken(config.chainswapContract.address, config.addAsset.name, config.addAsset.icon)
    }

    const onConfirm = () => {
        if (transferData.toChainId !== chainId) {
            changeNetwork(transferData.toChainId).then()
            return
        }
        setLoading(true)
        onExtract(()=>{
            setLoading(false)
        })
    }
    return (
        <Modal
            centered
            visible={visible}
            footer={null}
            mask={false}
            className='modal-show'
            maskTransitionName=''
            transitionName=''
        >
            <div className='wrapper' style={{zIndex: 10000}}>
                <div className='modal'>
                    <div className='modal__box'>
                        <form className='form-app farm_popup' action='/'>
                            <div className='form-app__inner deposit'>
                                <a className='farm_popup_close_btn withdraw_close' onClick={onClose}></a>
                                <p className='withdraw_title'>
                                    <FormattedMessage id='waitingText1'/>
                                </p>
                                <div className='form-app__submit form-app__submit--row'>
                                    <Button
                                        type='button'
                                        className={cs('btn btn--medium', pledgeStatus && 'compound_claim')}
                                        onClick={onConfirm}
                                        loading={loading}
                                    >
                                        {!pledgeStatus ? (
                                            <>
                                                <FormattedMessage id={'poolTextS' + transferData.toChainId} />
                                                &nbsp;&&nbsp;
                                                <FormattedMessage id='bridge10' />
                                            </>
                                        ) : loading ? <FormattedMessage id='waitingText'/> : <FormattedMessage id='withdraw'/>}
                                    </Button>
                                </div>
                                {
                                    pledgeStatus && <a className='add_address_metaMask' onClick={onAddToken}>
                                        <FormattedMessage id='add' /> {config.addAsset.assetsText} <FormattedMessage id='to' /> MetaMask<span className='metaMask_logo'></span>
                                    </a>
                                }
                                <div className='withdraw_tip'>
                                    Powered by BlackHole & ChainSwap
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default injectIntl(SwitchWithdrawPopup)
