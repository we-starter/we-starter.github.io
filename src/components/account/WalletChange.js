import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { mainContext } from '../../reducer';
import { InjectedConnector } from '@web3-react/injected-connector';
import {
    GALLERY_SELECT_WEB3_CONTEXT,
    HANDLE_SHOW_CONNECT_MODAL,
    HANDLE_SHOW_TRANSACTION_MODAL,
} from '../../const';
import { formatAddress } from '../../utils/format';
import metamask from '../../assets/icon/metamask.png';
import dot from '../../assets/icon/dot.png';

import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import close from '../../assets/icon/close.png';
import back from '../../assets/icon/back.png';

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 31337],
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

const ledger = new LedgerConnector({
    chainId: 1,
    url: RPC_URLS[1],
    pollingInterval: POLLING_INTERVAL,
});

const wallets = {
    MetaMask: injected,
    WalletConnect: walletChange,
    Ledger: ledger,
    //TrustWallet: injected,
    //Squarelink: squarelink,
    //Torus: torus,
    //Aut
};

export const WalletChange = ({ onClose, onCancel }) => {
    const { dispatch, state } = useContext(mainContext);
    const [connectedName, setConnectedName] = useState();

    const context = useWeb3React();

    console.log('context', context);

    const [activatingConnector, setActivatingConnector] = useState();
    const [currentConnector, setCurrentConnector] = useState();

    const {
        connector,
        library,
        account,
        activate,
        deactivate,
        active,
        error,
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

    useEffect(() => {
        console.log(account, account, context, library);
        if (account && active && library) {
            console.log('tag---->');
            //dispatch({type: HANDLE_SHOW_CONNECT_MODAL, showConnectModal: false});
        }
    }, [account]);

    function onConnect(currentConnector, name) {
        console.log('onConnect:');
        setActivatingConnector(currentConnector);
        setConnectedName(name);
        window &&
            window.localStorage.setItem(GALLERY_SELECT_WEB3_CONTEXT, name);
        console.log('activate');
        activate(wallets[name]);
    }

    return (
        <div className='modal'>
            <div className='modal__box'>
                <form className='form-app' action='/'>
                    <div className='form-app__inner transction-submitted'>
                        <div
                            className='form-app__inner__frame'
                            style={{ marginTop: 50 }}>
                            <img
                                src={dot}
                                className='form-app__inner__frame__dot'
                            />
                            <p>{account && formatAddress(account)}</p>
                            <img
                                className='form-app__inner__frame__right-icon'
                                src={metamask}
                            />
                        </div>
                        <img
                            src={close}
                            alt=''
                            className='form-app__close-btn'
                            onClick={onClose}
                            aria-label='Close'
                        />

                        <img
                            src={back}
                            alt=''
                            className='form-app__back-btn'
                            onClick={onCancel}
                            aria-label='Close'
                        />
                    </div>
                </form>

                {/*<div className="modal__item modal__item--recieve">*/}

                {/*    <form className="form-recieve" action="/" novalidate="novalidate">*/}

                {/*        <h3 className="form-recieve__title">*/}
                {/*            Please select a wallet*/}
                {/*        </h3>*/}

                {/*        <label className="form-recieve__input" click="selectWallet('metamask', $event)">*/}

                {/*            <input*/}
                {/*                type="radio"*/}
                {/*                name="modal-form-recieve"*/}
                {/*                className="visuallyhidden"*/}
                {/*                value="MetaMask"*/}
                {/*                value="WalletConnect" checked={connectedName === 'MetaMask'}/>*/}

                {/*            <span className="form-recieve__image">*/}
                {/*            <img src={MetaMask}*/}
                {/*                 srcSet={`${MetaMask2} 2x`} alt=""/>*/}
                {/*        </span>*/}

                {/*            {connectedName === 'MetaMask' ? (*/}
                {/*                <p className="form-recieve__label">*/}
                {/*                    {account && formatAddress(account)}*/}
                {/*                </p>*/}
                {/*            ) : (*/}
                {/*                <span className="form-recieve__label" onClick={() => {*/}
                {/*                    onConnect(currentConnector, 'MetaMask')*/}
                {/*                }}>MetaMask</span>*/}
                {/*            )}*/}

                {/*        </label>*/}

                {/*        <hr />*/}

                {/*        <label className="form-recieve__input" onClick={()=>{*/}
                {/*            onConnect(currentConnector, 'WalletConnect')*/}
                {/*        }}>*/}

                {/*            <input type="radio" name="modal-form-recieve" className="visuallyhidden"*/}
                {/*                   value="WalletConnect" checked={connectedName === 'WalletConnect'}/>*/}

                {/*            <span className="form-recieve__image">*/}

                {/*                <img src={walletConnectIcon} alt=""/>*/}

                {/*            </span>*/}

                {/*            {connectedName === 'WalletConnect' ? (*/}
                {/*                <p className="form-recieve__label">*/}
                {/*                    {account && formatAddress(account)}*/}
                {/*                </p>*/}
                {/*            ) : (*/}
                {/*                <span className="form-recieve__label" onClick={() => {*/}
                {/*                    console.log('connect to wallet')*/}
                {/*                    onConnect(currentConnector, 'WalletConnect')*/}
                {/*                }}>WalletConnect</span>*/}
                {/*            )}*/}

                {/*        </label>*/}

                {/*        <hr />*/}

                {/*        <label className="form-recieve__input" onClick={()=>{*/}
                {/*            onConnect(currentConnector, 'Ledger')*/}
                {/*        }}>*/}

                {/*            <input type="radio" name="modal-form-recieve" className="visuallyhidden" value="Ledger"*/}
                {/*                   checked={connectedName === 'Ledger'}/>*/}

                {/*            <span className="form-recieve__image">*/}
                {/*                    <img src={ledger_icon} alt=""/>*/}
                {/*                </span>*/}

                {/*            {connectedName === 'Ledger' ? (*/}
                {/*                <p className="form-recieve__label">*/}
                {/*                    {account && formatAddress(account)}*/}
                {/*                </p>*/}
                {/*            ) : (*/}
                {/*                <span className="form-recieve__label" onClick={() => {*/}
                {/*                    onConnect(currentConnector, 'Ledger')*/}
                {/*                }}>Ledger</span>*/}
                {/*            )}*/}

                {/*        </label>*/}

                {/*    </form>*/}

                {/*</div>*/}

                {/*<button type="button" className="modal__close modal__close-btn button" aria-label="Close modal"*/}
                {/*        onClick={() => {*/}
                {/*            dispatch({type: HANDLE_SHOW_CONNECT_MODAL, showConnectModal: false});*/}
                {/*        }}>*/}
                {/*    <CrossModalIcon />*/}
                {/*</button>*/}
            </div>
        </div>
    );
};
