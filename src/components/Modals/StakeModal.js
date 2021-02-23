import React from 'react';
import { FormattedMessage } from 'react-intl';

import { GLFIcon } from '../../icons';
import { formatAmount } from '../../utils/format';
import Web3 from 'web3';

export const StakeModal = ({
    info,
    amount,
    onConfirm,
    onCancel,
    onChange,
    balance,
    tokenName,
    symbol,
    onMax,
}) => {
    const { toWei, fromWei } = Web3.utils;

    return (
        <div className='modal'>
            <div className='modal__box' style={{ zIndex: 2 }}>
                <form className='form-app' action='/'>
                    <div className='form-app__inner deposit'>
                        <h1
                            className='form-app__title'
                            style={{ marginTop: 0 }}>
                            <FormattedMessage id='modalsText43' />
                        </h1>
                        <p className='form-app__label'>
                            {formatAmount(balance.toString(), info.decimals)}{' '}
                            {symbol} <FormattedMessage id='modalsText44' />
                        </p>

                        <div className='deposit__inputbox form-app__inputbox'>
                            <div className='form-app__inputbox-control'>
                                <div className='form-app__inputbox-input'>
                                    <input
                                        value={amount}
                                        className='input'
                                        placeholder='0.0000'
                                        onChange={onChange}
                                    />
                                </div>

                                <div
                                    className='form-app__inputbox-up'
                                    onClick={onMax}>
                                    <div className='form-app__inputbox-up-pref'>
                                        <FormattedMessage id='modalsText45' />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='form-app__submit form-app__submit--row'>
                            <button
                                style={{ flex: 0 }}
                                className='btn btn--outline btn--medium default'
                                type='button'
                                onClick={onCancel}>
                                <FormattedMessage id='modalsText46' />
                            </button>

                            <button
                                style={{ flex: 0 }}
                                type='button'
                                className='btn btn--medium '
                                disabled={!amount}
                                onClick={onConfirm}>
                                <FormattedMessage id='modalsText47' />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
