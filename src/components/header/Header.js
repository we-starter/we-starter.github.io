import React, { useContext, useState } from 'react';
import { useActiveWeb3React } from '../../web3';
import { formatAddress, formatAmount } from '../../utils/format';
import { mainContext } from '../../reducer';
import { HANDLE_WALLET_MODAL } from '../../const';
import { Link, NavLink, useLocation } from 'react-router-dom';
import doubleLine from '../../assets/icon/check-double-line.png';
import { Logoicon, LogoSmallIcon } from '../../icons';
import { ReactComponent as LogoText } from '../../assets/image/logo-text.svg';
import { ReactComponent as More } from '../../assets/icon/more.svg';
import dot from '../../assets/icon/dot.png';
import heco from '../../assets/image/heco.png';


export const Header = () => {
    const { active, account } = useActiveWeb3React();
    const { dispatch } = useContext(mainContext);

    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();

    const handleMenuItemClick = () => {
        setShowMenu(false);
    };

    return (
        <header
            className={`header ${showMenu ? 'menu-show' : ''}`}
            style={
                location.pathname === '/' ? { borderBottom: 'transparent' } : {}
            }>
            <div className='center'>
                <div className='header__box'>
                    <Link to='/' className='header__logo'>
                        <LogoText />
                    </Link>

                    <Link
                        to='/'
                        className={`header__logo--small ${
                            active ? 'active' : ''
                        }`}>
                        <LogoText />
                    </Link>

                    <div className='header__menu'>
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
                    </div>

                    <div className='header__menu-wrapper'>
                        {/* <a>Guide</a> */}

                        {active && (
                            <div className='header-account'>
                                <div
                                    className='address'
                                    onClick={() => {
                                        dispatch({
                                            type: HANDLE_WALLET_MODAL,
                                            walletModal: 'status',
                                        });
                                    }}>
                                    {formatAddress(account)}
                                    <img src={doubleLine} />
                                </div>
                            </div>
                        )}

                        {!active && (
                            <div className='header__btn'>
                                <button className='connect-btn'>
                                    <span
                                        onClick={() => {
                                            dispatch({
                                                type: HANDLE_WALLET_MODAL,
                                                walletModal: 'connect',
                                            });
                                        }}>
                                        链接钱包
                                    </span>
                                    <img src={dot} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='more'>
                        <More />
                    </div>
                </div>

                {/* <div className='visible-md'>
                    <button
                        className='button btn-menu-toggle'
                        type='button'
                        onClick={() => setShowMenu((prev) => !prev)}>
                        Menu
                    </button>
                </div> */}
            </div>
            <div className='center'>
               <div className='header__adv'>
                   <h2>流动性价值发现平台</h2>
                   <p>
                   Westarter是一个连接加密货币创新者和投资者的对接平台，任何创新者都可以无需许可的使用标准化的界面来发起和管理流动性拍卖。
                   </p>
                   <div className='header__adv__img'>
                      <p>Live on:</p>
                      <img src={heco}></img>
                   </div>
               </div>
            </div>
        </header>
    );
};
