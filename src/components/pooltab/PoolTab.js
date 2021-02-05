import React, { useContext, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ant from '../../assets/icon/ant.png';

export const PoolTab = () => {
    return (
        <div className='pooltab'>
            <NavLink to='/staking-pool1'>
                抵押挖矿
                <img src={ant} alt='' />
            </NavLink>
            <NavLink to='/staking-pool2'>
                流动性挖矿
                <img src={ant} alt='' />
            </NavLink>
            <NavLink to='/staking-pool3'>
                累计币领
                <img src={ant} alt='' />
            </NavLink>
        </div>
    );
};
