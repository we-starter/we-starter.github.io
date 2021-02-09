import React, { useContext, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HANDLE_SHOW_MENUMASK_MODAL } from '../../const';
import { mainContext } from '../../reducer';
export const MenuMask = () => {
    const [showMenu, setShowMenu] = useState(false);
    const { dispatch, state } = useContext(mainContext);
    const location = useLocation();
    const handleMenuItemClick = () => {
        setShowMenu(false);
    };
    return (
        <div className='menumask'>
            <div
                className='menumask_left'
                onClick={() =>
                    dispatch({
                        type: HANDLE_SHOW_MENUMASK_MODAL,
                        showMenuMaskModal: false,
                    })
                }></div>
            <div className='menumask_right'>
                <nav className='menumask_nav'>
                    <ul className='menumask_list'>
                        <li className='menumask_item'>
                            <NavLink
                                exact
                                to='/staking-pool1'
                                className='menumask_link'
                                onClick={() =>
                                    dispatch({
                                        type: HANDLE_SHOW_MENUMASK_MODAL,
                                        showMenuMaskModal: false,
                                    })
                                }>
                                抵押挖矿
                            </NavLink>
                        </li>
                        <li className='menumask_item'>
                            <NavLink
                                exact
                                to='/staking-pool2'
                                className='menumask_link'
                                onClick={() =>
                                    dispatch({
                                        type: HANDLE_SHOW_MENUMASK_MODAL,
                                        showMenuMaskModal: false,
                                    })
                                }>
                                动性挖矿
                            </NavLink>
                        </li>
                        <li className='menumask_item'>
                            <NavLink
                                exact
                                to=''
                                className='menumask_link'
                                onClick={() =>
                                    dispatch({
                                        type: HANDLE_SHOW_MENUMASK_MODAL,
                                        showMenuMaskModal: false,
                                    })
                                }>
                                众筹池
                            </NavLink>
                        </li>
                        {/* <li className='menumask_item'>
                            <NavLink
                                to='/'
                                className='menumask_link'
                                onClick={() =>
                                    dispatch({
                                        type: HANDLE_SHOW_MENUMASK_MODAL,
                                        showMenuMaskModal: false,
                                    })
                                }>
                                使用指南
                            </NavLink>
                        </li>
                        <li className='menumask_item'>
                            <NavLink
                                to='/'
                                className='menumask_link'
                                onClick={() =>
                                    dispatch({
                                        type: HANDLE_SHOW_MENUMASK_MODAL,
                                        showMenuMaskModal: false,
                                    })
                                }>
                                新鲜事
                            </NavLink>
                        </li> */}
                    </ul>
                </nav>
            </div>
        </div>
    );
};
