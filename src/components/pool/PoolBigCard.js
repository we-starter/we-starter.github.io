import React from "react";
import { Link } from "react-router-dom";
import Grow from "@material-ui/core/Grow";

export const PoolBigCard = ({
    label,
    cover,
    pair,
    link,
    staked,
    points,
    redeemed,
    left
}) => {
    return (
        <Grow in={true} timeout={1500}>
            <div className="card-pool__item card-pool__item--big">
                <a href="/" className="card-pool__img">
                    <picture>
                        <img
                            src={cover}
                            alt="`$`"
                            loading="lazy"
                            width="264"
                            height="330"
                        />
                    </picture>
                </a>
                <div className="card-pool__content">
                    <h2 className="card-pool__title h3">{label}</h2>
                    <Link to={link} className="card-pool__stake">
                        Stake
                        <b>{pair}</b>
                        <svg width="20" height="21" viewBox="0 0 20 21">
                            <path
                                d="M13.48 9.67L9 5.2l1.18-1.18 6.48 6.48-6.48 6.48L9 15.8l4.47-4.47H3.33V9.67h10.15z"
                                strokeWidth=".8"
                            />
                        </svg>
                    </Link>
                    <p className="card-pool__earn">
                        Earn Reward points <br /> to redeem NFTs
                    </p>
                    <div>
                        <dl className="card-pool__dl">
                            <div className="card-pool__dl-row">
                                <dt className="card-pool__dl-dt">Staked</dt>
                                <dd className="card-pool__dl-dd">
                                    <b className="card-pool__dl-black">{staked}</b>
                                </dd>
                            </div>
                            <div className="card-pool__dl-row">
                                <dt className="card-pool__dl-dt">Reward Points</dt>
                                <dd className="card-pool__dl-dd">
                                    <b className="card-pool__dl-black">{points}</b>
                                </dd>
                            </div>
                            <div className="card-pool__dl-row">
                                <dt className="card-pool__dl-dt">NFTs redeemed</dt>
                                <dd className="card-pool__dl-dd">
                                    <b className="card-pool__dl-green">{redeemed}</b>
                                </dd>
                            </div>
                            <div className="card-pool__dl-row">
                                <dt className="card-pool__dl-dt">NFTs left</dt>
                                <dd className="card-pool__dl-dd">
                                    <b className="card-pool__dl-yellow">{left}</b>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </Grow>
    );
};
