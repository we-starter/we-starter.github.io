import React, {useContext, useEffect, useState} from 'react'
import {injectIntl} from 'react-intl'
import {FormattedMessage} from 'react-intl'
import {mainContext} from '../../reducer'
import {getContract, useActiveWeb3React} from '../../web3'
import {ChainId, WAR_ADDRESS} from '../../web3/address'
import {Button, message, Modal} from 'antd'
import {formatAmount} from '../../utils/format'
import {
    HANDLE_WALLET_MODAL,
    HANDLE_WITHDRAW_MODAL
} from '../../const'
import cs from 'classnames'
import {changeNetwork} from "../../connectors";

const SwitchWithdrawPopup = ({visible, onClose, onExtract, transferData, bridgeCardConfig}) => {
    const {account, active, library, chainId} = useActiveWeb3React()
    const {dispatch, state} = useContext(mainContext)
    const [loading, setLoading] = useState(false)
    const pledgeStatus = transferData.toChainId === chainId
    const WarTokenAddress =
        WAR_ADDRESS[chainId] || '0x910651F81a605a6Ef35d05527d24A72fecef8bF0'

    const addToken = async () => {
        try {
            let addTokenClick = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: WarTokenAddress,
                        symbol: 'WAR',
                        decimals: 18,
                        image: '',
                    },
                },
            })
            if (addTokenClick) {
                message.success('add success')
            }
        } catch (err) {
            console.log(err, 'addToken')
        }
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
                                <p className='withdraw_title'>This process may take some time</p>
                                <div className='form-app__submit form-app__submit--row'>
                                    <Button
                                        type='button'
                                        className={cs('btn btn--medium', pledgeStatus && 'compound_claim')}
                                        onClick={onConfirm}
                                        loading={loading}
                                    >
                                        {!pledgeStatus ? 'Switch to '+ bridgeCardConfig(transferData.toChainId).name : loading ? 'This process may take some time ...' : 'Withdraw'}
                                    </Button>
                                </div>
                                <a className='add_address_metaMask' onClick={addToken}>
                                    Add WAR to MetaMask<span className='metaMask_logo'></span>
                                </a>
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
