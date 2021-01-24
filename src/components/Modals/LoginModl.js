import React, {useContext, useEffect, useState} from 'react';
import {useWeb3React} from "@web3-react/core";
import {mainContext} from '../../reducer'
import {GALLERY_SELECT_WEB3_CONTEXT, HANDLE_SHOW_CONNECT_MODAL, HANDLE_SHOW_TRANSACTION_MODAL} from "../../const";

import close from "../../assets/icon/close.png";
import loading from '../../assets/icon/loading.png'

export const LoginModal = ({onDismiss}) => {

    return (
            <div className="modal">

                <div className="modal__box">

                    <form className="form-app" action="/">
                        <div className="form-app__inner transction-submitted">

                            <div className="form-app__inner__header">
                                Login and Authorize Your wallet
                            </div>


                            <p className="transction-submitted__tip">
                                This dapp requires access to your wallet,please login and authorize access to your MetaMask accounts to continue
                            </p>

                            <footer>
                                <img src={loading}/>
                                <button className="btn">Dismiss</button>
                            </footer>

                            <img
                                src={close}
                                alt=""
                                className="form-app__close-btn"
                                onClick={onDismiss}
                                aria-label="Close"
                            />
                        </div>
                    </form>
                </div>

        </div>
    )
}
