import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { mainContext } from '../../reducer';
import {
    GALLERY_SELECT_WEB3_CONTEXT,
    HANDLE_SHOW_CONNECT_MODAL,
    HANDLE_SHOW_TRANSACTION_MODAL,
} from '../../const';
import { FormattedMessage } from 'react-intl';

import close from '../../assets/icon/close.png';
import loading from '../../assets/icon/loading.png';

export const LoginModal = ({ onDismiss }) => {
    return (
        <div className='modal'>
            <div className='modal__box'>
                <form className='form-app' action='/'>
                    <div className='form-app__inner transction-submitted'>
                        <div className='form-app__inner__header'>
                            <FormattedMessage id='modalsText21' />
                        </div>

                        <p className='transction-submitted__tip'>
                            <FormattedMessage id='modalsText22' />
                        </p>

                        <footer>
                            <img src={loading} />
                            <button className='btn'>
                                <FormattedMessage id='modalsText23' />
                            </button>
                        </footer>

                        <img
                            src={close}
                            alt=''
                            className='form-app__close-btn'
                            onClick={onDismiss}
                            aria-label='Close'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
