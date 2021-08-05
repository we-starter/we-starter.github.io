import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import {HANDLE_SHOW_FAILED_TRANSACTION_MODAL, NOT_ACCESS_MODAL} from '../../const';
import { mainContext } from '../../reducer';
import { CrossModalIcon } from '../../icons';

export const NotAccessModal = () => {
    const { dispatch } = useContext(mainContext);

    return (
        <div className='modal'>
            <div className='modal__box'>
                <div className='form-app'>
                    <div className='form-app__inner transction-submitted'>
                        <div className='emoji  emoji--sad'>
                            <div className='emoji__face'>
                                <div className='emoji__eyebrows' />
                                <div className='emoji__eyes' />
                                <div className='emoji__mouth' />
                            </div>
                        </div>

                        <h3 className='form-app__title h3'>
                            <FormattedMessage id='cannotProject' />
                        </h3>

                        <button
                            type='button'
                            className='transction-submitted__btn btn'
                            onClick={() => {
                                dispatch({
                                    type: NOT_ACCESS_MODAL,
                                    notAccessModal: false,
                                });
                            }}>
                            <FormattedMessage id='modalsText20' />
                        </button>

                        <button
                            type='button'
                            className='form-app__close-btn button'
                            onClick={() => {
                                dispatch({
                                    type: NOT_ACCESS_MODAL,
                                    notAccessModal: false,
                                });
                            }}
                            aria-label='Close'>
                            <CrossModalIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
