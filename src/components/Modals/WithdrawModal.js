import React, { useContext } from 'react';

import { HANDLE_SHOW_UNSTAKED_TOKENS_MODAL } from '../../const';
import { mainContext } from '../../reducer';
import { CrossModalIcon } from '../../icons';
import { formatAmount } from '../../utils/format';
import close from '../../assets/icon/close.png';
import { FormattedMessage } from 'react-intl';

export const WithdrawModal = ({ onWithdraw, onDismiss, stakingInfo, info }) => {
    return (
        <div className='modal'>
            <div className='modal__box'>
                <form className='form-app' action='/'>
                    <div className='form-app__inner transction-submitted'>
                        <div
                            className='form-app__inner__header'
                            style={{ display: 'block' }}>
                            <FormattedMessage id='modalsText63' />
                        </div>

                        <div className='form-app__title h3'>
                            <p className='value'>
                                {stakingInfo &&
                                    formatAmount(
                                        stakingInfo.staked,
                                        info.decimals
                                    )}
                            </p>
                            <p className='withdraw-title'>
                                <FormattedMessage id='modalsText64' />
                                {info && info.symbol}
                            </p>
                        </div>

                        <div className='form-app__title h3'>
                            <p className='value'>
                                {stakingInfo &&
                                    formatAmount(stakingInfo.earned)}
                            </p>
                            <p className='withdraw-title'>
                                <FormattedMessage id='modalsText65' />
                            </p>
                        </div>
                        <button
                            type='button'
                            className='transction-submitted__btn btn'
                            onClick={onWithdraw}>
                            <FormattedMessage id='modalsText66' />
                        </button>

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
