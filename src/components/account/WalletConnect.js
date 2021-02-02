import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { mainContext } from '../../reducer';
import { InjectedConnector } from '@web3-react/injected-connector';
import {
    GALLERY_SELECT_WEB3_CONTEXT,
    HANDLE_WALLET_MODAL,
} from '../../const';
import metamask from '../../assets/icon/metamask.png';
import walletConnect from '../../assets/icon/walletConnect.png';


import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 128],
});

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    1: 'https://eth-mainnet.alchemyapi.io/v2/k2--UT_xVVXMOvAyoxJYqtKhlmyBbqnX',
    4: 'https://rinkeby.infura.io/v3/8f6d3d5d7a1442a38d9e8050c31c1884',
};

const walletChange = new WalletConnectConnector({
    rpc: { 1: RPC_URLS[1] },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});


export const WalletConnect = ({ onClose, onCancel }) => {
    const { dispatch, state } = useContext(mainContext);
    const [connectedName, setConnectedName] = useState();

    const context = useWeb3React();

    const [activatingConnector, setActivatingConnector] = useState();

    const {
        connector,
        activate,
    } = context;

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector]);

    useEffect(() => {
        const localContent =
            window && window.localStorage.getItem(GALLERY_SELECT_WEB3_CONTEXT);
        console.log('wallet content', localContent);
        if (localContent) {
            setConnectedName(localContent);
        }
    }, []);

    return (
        <div className='modal'>
            <div className='modal__box'>
                <form className='form-app' action='/'>
                    <div className='form-app__inner wallet-connect'>
                        <div className='form-app__inner__wallets'>
                            <div
                                onClick={() => {
                                    activate(injected)
                                        .then(() => {
                                            dispatch({
                                                type: HANDLE_WALLET_MODAL,
                                                walletModal: null,
                                            });
                                            window &&
                                                window.localStorage.setItem(
                                                    GALLERY_SELECT_WEB3_CONTEXT,
                                                    'MetaMask'
                                                );
                                        })
                                        .catch(() => {});
                                }}
                                className='form-app__inner__wallets__item'
                                style={{
                                    borderRight:
                                        '1px rgba(235, 233, 227, 1) solid',
                                }}>
                                <img src={metamask} />
                                <p>Connect to your Metamask Wallet</p>
                            </div>

                            <div
                                onClick={() => {
                                    dispatch({
                                        type: HANDLE_WALLET_MODAL,
                                        walletModal: 'connecting',
                                    });
                                    activate(walletChange)
                                        .then(() => {
                                            dispatch({
                                                type: HANDLE_WALLET_MODAL,
                                                walletModal: null,
                                            });
                                            window &&
                                            window.localStorage.setItem(
                                                GALLERY_SELECT_WEB3_CONTEXT,
                                                'MetaMask'
                                            );
                                        })
                                        .catch(() => {});
                                }}
                                className='form-app__inner__wallets__item'>
                                <img src={walletConnect} />
                                <p>Connect to your WalletConnect</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
