import React, { useContext, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export const Banner = () => {
    return (
        <div className='banner'>
            <div className='banner_img'></div>
            <h3 className='banner_text'>流动性价值发现平台</h3>
            <p className='banner_dec'>
                Westarter是一个连接加密货币创新者和投资者的对接平台，任何创新者都可以无需许可的使用标准化的界面来发起和管理流动性拍卖。
            </p>
            <div className='banner_link'>
                <span>Live on : </span> <a href=''></a>
            </div>
        </div>
    );
};
