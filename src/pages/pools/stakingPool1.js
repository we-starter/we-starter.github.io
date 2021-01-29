import React, { useState } from 'react';
import { ReactComponent as HUSD } from '../../assets/logo/HUSD.svg';
import { ReactComponent as ONE } from '../../assets/icon/1X.svg';
import { StakingItem } from './StakingItem';

export const StakingPool1 = () => {
    const [showMenu, setShowMenu] = useState(false);

    const handleMenuItemClick = () => {
        setShowMenu(false);
    };
    const stakingInfos = [
        {
            id: 0,
            title: 'EHT POOL',
            symbol: 'EHT',
            address: null,
            stakingAddress: '0xB65853Ddc2366564e2238c70a0676B886c79dD9b',
            logo: <HUSD />,
            multiple: <ONE />,
        },
        {
            id: 1,
            title: 'DAI POOL',
            symbol: 'DAI',
            address: '0xad6d458402f60fd3bd25163575031acdce07538d',
            stakingAddress: '0xE9bA85Ef193c02a5583599676d93b408E106b60B',
            logo: <HUSD />,
            multiple: <ONE />,
        },
        // {
        //     id: 0,
        //     title: 'WAR POOL',
        //     symbol: 'WAR',
        //     address: '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C',
        //     stakingAddress: '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
        //     logo: <HUSD />,
        //     multiple: <ONE />,
        // },
    ];

    return (
        <article className='center'>
            <div className='statistics'>
                <div className='statistics__list'>
                    {stakingInfos.map((item) => {
                        return <StakingItem info={item} key={item.id} />;
                    })}
                </div>
            </div>
        </article>
    );
};
