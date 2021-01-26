import React from 'react';
import { ReactComponent as HUSD } from '../../assets/logo/HUSD.svg';
import { StakingItem } from './StakingItem';
import ant from '../../assets/icon/ant.png';

export const StakingPool1 = () => {
    const stakingInfos = [
        {
            id: 0,
            title: 'EHT POOL',
            symbol: 'EHT',
            address: null,
            stakingAddress: '0xB65853Ddc2366564e2238c70a0676B886c79dD9b',
            logo: <HUSD />,
            multiple: '1X',
        },
        {
            id: 0,
            title: 'DAI POOL',
            symbol: 'DAI',
            address: '0xad6d458402f60fd3bd25163575031acdce07538d',
            stakingAddress: '0xE9bA85Ef193c02a5583599676d93b408E106b60B',
            logo: <HUSD />,
            multiple: '1X',
        },
        {
            id: 0,
            title: 'WAR POOL',
            symbol: 'WAR',
            address: '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C',
            stakingAddress: '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
            logo: <HUSD />,
            multiple: '1X',
        },
    ];

    return (
        <article className='center'>
            <header className='head-page'>
                <h1 className='head-page__title h5'>
                    <img src={ant} /> 一池
                </h1>
            </header>

            <div className='statistics'>
                <div className='statistics__list'>
                    {stakingInfos.map((item) => {
                        return <StakingItem info={item} />;
                    })}
                </div>
            </div>
        </article>
    );
};
