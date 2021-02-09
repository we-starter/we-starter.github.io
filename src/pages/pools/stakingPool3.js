import React, { useState } from 'react';
import { ReactComponent as HUSD } from '../../assets/logo/HUSD.svg';
import { ReactComponent as ONE } from '../../assets/icon/1X.svg';
import { StakingItem } from './StakingItem';
import ant from '../../assets/icon/ant.png';
import { NavLink } from 'react-router-dom';
import { useStakingPoolInfo } from './Hooks';
import { NoConnect } from '../../components/noConnet/index.js';

export const StakingPool3 = () => {
    const [showMenu, setShowMenu] = useState(false);

    const handleMenuItemClick = () => {
        setShowMenu(false);
    };
    const stakingInfos = useStakingPoolInfo();

    const stakingInfouos = [
        {
            id: 0,
            title: 'WAR POOL',
            symbol: 'WAR',
            address: '0x880bd31775d97Ce7006D1Cc72EbCC36E412E663C',
            stakingAddress: '0xDdB7B0a03A98e7814430E8C010D221D010F2cD6F',
            logo: <HUSD />,
            multiple: <ONE />,
        },
    ];

    return (
        <article className='center'>
            {/* <header className='head-page'>
                <nav className='menu'>
                        <ul className='menu__list'>
                            <li className='menu__item'>
                                <NavLink
                                    to='/staking-pool1'
                                    className='menu__link'
                                    activeClassName='is-current'
                                    onClick={handleMenuItemClick}>
                                    抵押挖矿
                                </NavLink>
                            </li>
                            <li className='menu__item'>
                                <NavLink
                                    to='/staking-pool2'
                                    className='menu__link'
                                    activeClassName='is-current'
                                    onClick={handleMenuItemClick}>
                                    流动性挖矿
                                </NavLink>
                            </li>
                            <li className='menu__item'>
                                <NavLink
                                    to='/staking-pool3'
                                    className='menu__link'
                                    activeClassName='is-current'
                                    onClick={handleMenuItemClick}>
                                    累计币领
                                </NavLink>
                            </li>
                        </ul>
                </nav>
            </header> */}

            <div className='statistics'>
                <div className='statistics__list'>
                    {stakingInfos.staking3.length ? (
                        stakingInfos.staking3.map((item) => {
                            return <StakingItem info={item} key={item.id} />;
                        })
                    ) : (
                        <NoConnect />
                    )}
                </div>
            </div>
        </article>
    );
};
