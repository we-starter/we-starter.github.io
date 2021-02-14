import React, {useContext, useState} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {mainContext} from '../../reducer'
import {GALLERY_SELECT_WEB3_CONTEXT, HANDLE_WALLET_MODAL} from '../../const'
import {message} from 'antd'

export const PoolsBanner = (props) => {
    const {address, pool} = props
    const {dispatch, state} = useContext(mainContext)
    return (
        <div className='pools_banner'>
            <div className='pools_banner_img'></div>
            <h3 className='pools_banner_text'>We Starter Public</h3>
            <p className='pools_banner_dec'>
                {address}
                <CopyToClipboard text={address} onCopy={() => {
                    message.success('copy success');
                }}>
                    <a></a>
                </CopyToClipboard>
            </p>
            <div>
                <a
                    className='pools_banner_btn pools_banner_btn_active'
                    onClick={() => {
                        dispatch({
                            type: HANDLE_WALLET_MODAL,
                            walletModal: 'join',
                            pool,
                        })
                        window &&
                        window.localStorage.setItem(GALLERY_SELECT_WEB3_CONTEXT, null)
                    }}
                >
                    Join Pool
                </a>
                <a className='pools_banner_btn' href={`https://scan.hecochain.com/address/${address}`} target="_blank">View HECO</a>
            </div>
        </div>
    )
}
