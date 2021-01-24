import React, {useContext, useState} from "react";
import {useActiveWeb3React} from "../../web3";
import {formatAddress, formatAmount} from "../../utils/format";
import {mainContext} from "../../reducer";
import {HANDLE_WALLET_MODAL} from "../../const";
import {Link, NavLink, useLocation} from "react-router-dom";
import doubleLine from '../../assets/icon/check-double-line.png'
import {Logoicon, LogoSmallIcon} from "../../icons";
import {ReactComponent as LogoText} from '../../assets/image/logo-text.svg'
import dot from '../../assets/icon/dot.png'

export const Header = () => {
    const {active, account} = useActiveWeb3React();
    const {dispatch} = useContext(mainContext);

    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();


    const handleMenuItemClick = () => {
        setShowMenu(false);
    };

    return (
        <header
            className={`header ${showMenu ? "menu-show" : ""}`}
            style={location.pathname === "/" ? {borderBottom: "transparent"} : {}}
        >
            <div className="center">
                <div className="header__box">
                    <Link to="/" className="header__logo">
                        <LogoText/>
                    </Link>

                    <Link
                        to="/"
                        className={`header__logo--small ${active ? "active" : ""}`}
                    >
                        <LogoSmallIcon/>
                    </Link>

                    <div className="header__menu">
                        <nav className="menu">
                            <ul className="menu__list">
                                <li className="menu__item">
                                    <NavLink
                                        to="/staking-pool1"
                                        className="menu__link"
                                        activeClassName="is-current"
                                        onClick={handleMenuItemClick}
                                    >
                                        一池
                                    </NavLink>
                                </li>
                                <li className="menu__item">
                                    <NavLink
                                        to="/staking-pool2"
                                        className="menu__link"
                                        activeClassName="is-current"
                                        onClick={handleMenuItemClick}
                                    >
                                        二池
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className="header__menu-wrapper">

                        <a>Guide</a>

                        {active && (
                            <div className="header-account">
                                <div className="address" onClick={() => {
                                    dispatch({type: HANDLE_WALLET_MODAL, walletModal: 'status'});
                                }}>
                                    {formatAddress(account)}
                                    <img src={doubleLine}/>
                                </div>
                            </div>
                        )}

                        {!active && (
                            <div className="header__btn">
                                <button className="connect-btn">
                                    <span onClick={() => {
                                        dispatch({type: HANDLE_WALLET_MODAL, walletModal: 'connect'});
                                    }}>链接钱包</span>
                                    <img src={dot}/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="visible-md">
                    <button
                        className="button btn-menu-toggle"
                        type="button"
                        onClick={() => setShowMenu(prev => !prev)}
                    >
                        Menu
                    </button>
                </div>
            </div>

        </header>
    );
};
