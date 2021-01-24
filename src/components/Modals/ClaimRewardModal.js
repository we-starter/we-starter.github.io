import React, {useState} from "react";
import {getPercent} from "../../utils/time";
import {formatAmount} from "../../utils/format";
import BigNumber from "bignumber.js";
import Web3 from 'web3'
const {fromWei} = Web3.utils
export const ClaimRewardModal = ({onCancel, onConfirm, rewards, stakedTime}) => {

    const [checked, setChecked] = useState(true)

    return (
        <div className="modal">
            <div className="modal__box">
                <form className="form-app" action="/">
                    <div className="form-app__inner claim-reward">
                        <h1 className="claim-reward__title h3">Claim Reward</h1>
                        <hr />
                        <dl className="claim-reward__dl">
                            <div className="claim-reward__dl-row">
                                <dt className="claim-reward__dl-dt">
                                    Your reward pool:
                                </dt>
                                <dd className="claim-reward__dl-dd">{rewards && formatAmount(rewards)} GLF</dd>
                            </div>
                            <div className="claim-reward__dl-row">
                                <dt className="claim-reward__dl-dt">
                                    Current staking time:
                                </dt>
                                <dd className="claim-reward__dl-dd">{stakedTime && stakedTime} hours</dd>
                            </div>
                        </dl>
                        <p className="form-app__note">
                            {`You will get ${rewards && fromWei(new BigNumber(rewards*((100-getPercent(stakedTime))/100)).toFixed(0).toString())} GLF (${getPercent(stakedTime)} % of your GLF will be burned) if you will claim
                            your reward now`}
                        </p>
                        <div className="claim-reward__columns">
                            <p className="claim-reward__columns-caption">
                                If you claim GLF from the rewards pool before a
                                10-day staking period is over, part of your reward
                                will be subject to burn. The burn rate is as follows:
                            </p>
                            <dl className="claim-reward__columns-col">
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        0-24 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">50%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        24-48 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">40%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        48-72 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">30%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        72-96 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">20%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        96-120 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">15%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        120-144 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">10%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        144-168 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">8%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        168-192 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">6%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        192-216 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">4%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        216-240 hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">2%</dd>
                                </div>
                                <div className="claim-reward__columns-row">
                                    <dt className="claim-reward__columns-dt">
                                        240-∞ hours:
                                    </dt>
                                    <dd className="claim-reward__columns-dd">0%</dd>
                                </div>
                            </dl>
                        </div>
                        <label className="checkbox">
                            <input
                                checked={checked}
                                onChange={()=>{
                                    setChecked(!checked)
                                }}
                                type="checkbox"
                                className="checkbox__input visuallyhidden"
                                required="required"
                            />
                            <span className="checkbox__label">
                                I understand, claim my reward anyway
                            </span>
                        </label>
                        <div className="form-app__submit form-app__submit--row">
                            <button
                                className="btn btn--outline btn--medium"
                                type="button"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button disabled={!checked} style={{background:checked? '': 'rgba(196, 196, 196, 0.2)'}} type="button" className="btn btn--medium" onClick={onConfirm}>Confirm</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
