import React, { useContext, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import noConnect from '../../assets/image/noConnect.png';
export const NoConnect = () => {
    return (
        <div className='noConnect'>
            <img src={noConnect} alt='' />
            <p>暂无网络</p>
        </div>
    );
};
