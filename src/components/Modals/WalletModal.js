import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    GALLERY_SELECT_WEB3_CONTEXT,
    HANDLE_SHOW_TRANSACTION_MODAL,
    HANDLE_WALLET_MODAL,
} from '../../const';
import { mainContext } from '../../reducer';
import close from '../../assets/icon/close.png';
import { useActiveWeb3React } from '../../web3';
import { formatAddress } from '../../utils/format';
import copy from '../../assets/icon/copy.png';
import switchIcon from '../../assets/icon/switch.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useWeb3React } from '@web3-react/core';

export const WalletModal = ({ onChange, onClose }) => {
    const context = useWeb3React();
    const { dispatch, state } = useContext(mainContext);

    const {
        connector,
        library,
        account,
        activate,
        deactivate,
        active,
        error,
    } = context;

    return (
        <div className='modal'>
            <div className='modal__box'>
                <form className='form-app' action='/'>
                    <div className='form-app__inner transction-submitted'>
                        <div
                            className='form-app__inner__header'
                            style={{ maxWidth: 'inherit' }}>
                            ACCOUNT
                        </div>
                        <p className='form-app__inner__address'>
                            {account && formatAddress(account)}
                        </p>

                        <CopyToClipboard
                            text={account}
                            onCopy={() => {
                                // alert('copy success!')
                            }}>
                            <div
                                className='form-app__inner__frame'
                                style={{ marginBottom: 24 }}>
                                <img src={copy} alt='' />
                                <p> Copy Address</p>
                            </div>
                        </CopyToClipboard>

                        <div
                            className='form-app__inner__frame'
                            onClick={onChange}>
                            <img src={switchIcon} alt='' />
                            <p>Switch Wallet</p>
                        </div>

                        <button
                            style={{ marginTop: 30, width: '100%' }}
                            type='button'
                            className='transction-submitted__btn btn'
                            onClick={() => {
                                deactivate();
                                dispatch({
                                    type: HANDLE_WALLET_MODAL,
                                    walletModal: null,
                                });
                                window &&
                                    window.localStorage.setItem(
                                        GALLERY_SELECT_WEB3_CONTEXT,
                                        null
                                    );
                            }}>
                            Disconnect Wallet
                        </button>
                        <img
                            src={close}
                            alt=''
                            className='form-app__close-btn'
                            onClick={onClose}
                            aria-label='Close'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
