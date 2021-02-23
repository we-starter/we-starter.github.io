import React, { useState } from 'react';
import { getPercent } from '../../utils/time';
import { formatAmount } from '../../utils/format';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { FormattedMessage } from 'react-intl';
const { fromWei } = Web3.utils;
export const ClaimRewardModal = ({
    onCancel,
    onConfirm,
    rewards,
    stakedTime,
}) => {
    const [checked, setChecked] = useState(true);

    return (
        <div className='modal'>
            <div className='modal__box'>
                <form className='form-app' action='/'>
                    <div className='form-app__inner claim-reward'>
                        <h1 className='claim-reward__title h3'>
                            <FormattedMessage id='modalsText7' />
                        </h1>
                        <hr />
                        <dl className='claim-reward__dl'>
                            <div className='claim-reward__dl-row'>
                                <dt className='claim-reward__dl-dt'>
                                    <FormattedMessage id='modalsText8' />
                                </dt>
                                <dd className='claim-reward__dl-dd'>
                                    {rewards && formatAmount(rewards)} GLF
                                </dd>
                            </div>
                            <div className='claim-reward__dl-row'>
                                <dt className='claim-reward__dl-dt'>
                                    <FormattedMessage id='modalsText9' />
                                </dt>
                                <dd className='claim-reward__dl-dd'>
                                    {stakedTime && stakedTime}
                                    <FormattedMessage id='modalsText10' />
                                </dd>
                            </div>
                        </dl>
                        <p className='form-app__note'>
                            <FormattedMessage
                                id='modalsText11'
                                data1={
                                    rewards &&
                                    fromWei(
                                        new BigNumber(
                                            rewards *
                                                ((100 -
                                                    getPercent(stakedTime)) /
                                                    100)
                                        )
                                            .toFixed(0)
                                            .toString()
                                    )
                                }
                                data2={getPercent(stakedTime)}
                            />
                        </p>
                        <div className='claim-reward__columns'>
                            <p className='claim-reward__columns-caption'>
                                <FormattedMessage id='modalsText12' />
                            </p>
                            <dl className='claim-reward__columns-col'>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        0-24
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        50%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        24-48
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        40%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        48-72
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        30%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        72-96
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        20%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        96-120
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        15%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        120-144
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        10%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        144-168
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        8%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        168-192
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        6%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        192-216
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        4%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        216-240
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        2%
                                    </dd>
                                </div>
                                <div className='claim-reward__columns-row'>
                                    <dt className='claim-reward__columns-dt'>
                                        240-∞
                                        <FormattedMessage id='modalsText10' />:
                                    </dt>
                                    <dd className='claim-reward__columns-dd'>
                                        0%
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <label className='checkbox'>
                            <input
                                checked={checked}
                                onChange={() => {
                                    setChecked(!checked);
                                }}
                                type='checkbox'
                                className='checkbox__input visuallyhidden'
                                required='required'
                            />
                            <span className='checkbox__label'>
                                <FormattedMessage id='modalsText13' />
                            </span>
                        </label>
                        <div className='form-app__submit form-app__submit--row'>
                            <button
                                className='btn btn--outline btn--medium'
                                type='button'
                                onClick={onCancel}>
                                <FormattedMessage id='modalsText14' />
                            </button>
                            <button
                                disabled={!checked}
                                style={{
                                    background: checked
                                        ? ''
                                        : 'rgba(196, 196, 196, 0.2)',
                                }}
                                type='button'
                                className='btn btn--medium'
                                onClick={onConfirm}>
                                <FormattedMessage id='modalsText15' />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
