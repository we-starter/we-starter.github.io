import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom';
import Grow from '@material-ui/core/Grow';
import {
    useLeftTime,
     usePoolCard,
} from "./Hooks";
import {formatAmount} from "../../utils/format";
import {REQUESTING_DATA} from "../../const";
import BigNumber from "bignumber.js";
import Web3 from 'web3'

const {toWei} = Web3.utils

export const PoolCard = ({pool, price, loadTotal, glfPrice}) => {
    const {total, time, totalRewards} = usePoolCard(pool.type)

    console.log('apy', pool.type,total, price, totalRewards, glfPrice)

    const {leftTime, setTime} = useLeftTime()
    const [show, setShow] = useState(false)

    useEffect(()=>{
        setShow(true)
    },[])

    useEffect(()=>{
        if(total){
            loadTotal({total, token: pool.type})
        }
    },[total])

    useEffect(()=>{
        setTime(time)
    },[time])

    return (
        <Grow in={show} timeout={1500}>
            <div>
                <div className="card-pool__item">
                    <a href="/" className="card-pool__img">
                        <picture>
                            <img src={pool.cover} alt="`$`" loading="lazy" width="264" height="170"/>
                        </picture>
                    </a>
                    <h2 className="card-pool__title h3">{pool.label}</h2>
                    <Link to={pool.link} className="card-pool__stake">Stake
                        <b>{pool.pair}</b>
                        <svg width="20" height="21" viewBox="0 0 20 21">
                            <path d="M13.48 9.67L9 5.2l1.18-1.18 6.48 6.48-6.48 6.48L9 15.8l4.47-4.47H3.33V9.67h10.15z"
                                  strokeWidth=".8"/>
                        </svg>
                    </Link>
                    <p className="card-pool__earn">
                        Earn GLF
                    </p>
                    <div>
                        <dl className="card-pool__dl">
                            <div className="card-pool__dl-row">
                                <dt className="card-pool__dl-dt">
                                    Staked
                                </dt>
                                <dd className="card-pool__dl-dd">
                                    <b className="card-pool__dl-black">{total? formatAmount(total) : REQUESTING_DATA}</b>
                                </dd>
                            </div>
                            <div className="card-pool__dl-row">
                                <dt className="card-pool__dl-dt">
                                    Pool total
                                </dt>
                                <dd className="card-pool__dl-dd">
                                    <b className="card-pool__dl-blue"> $ {(total && price && pool.type !== 'ETH' && pool.type !== 'USDT')? new BigNumber(formatAmount(total)).multipliedBy(price).toString() :REQUESTING_DATA}</b>
                                </dd>
                            </div>
                            <div className="card-pool__dl-row">
                                <dt className="card-pool__dl-dt">
                                    APY
                                </dt>
                                <dd className="card-pool__dl-dd">
                                    <b className="card-pool__dl-green">{pool.totalRewards === -1 ? '>5000%' :(glfPrice && totalRewards && price && total)?
                                        `${(new BigNumber(glfPrice).multipliedBy(toWei(pool.totalRewards)).multipliedBy(365).dividedBy(14)).dividedBy((new BigNumber(price).multipliedBy(total))).multipliedBy(100).toFixed(6).toString()} %`
                                        :REQUESTING_DATA}</b>
                                </dd>
                            </div>
                            <div className="card-pool__dl-row">
                                <dt className="card-pool__dl-dt">
                                    Time left
                                </dt>
                                <dd className="card-pool__dl-dd">
                                    <b className="card-pool__dl-black">{leftTime? `${leftTime.days}d ${leftTime.hours}h ${leftTime.minutes}m`: REQUESTING_DATA}</b>
                                </dd>
                            </div>
                        </dl>
                    </div>

                </div>
            </div>
        </Grow>
    )
}