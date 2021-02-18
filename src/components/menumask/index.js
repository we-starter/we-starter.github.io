import React, { useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { formatAddress, formatAmount } from '../../utils/format'
import { useActiveWeb3React } from '../../web3'
import { HANDLE_SHOW_MENUMASK_MODAL, HANDLE_WALLET_MODAL } from '../../const'
import dot from '../../assets/icon/dot.png'
import doubleLine from '../../assets/icon/check-double-line.png'

import { mainContext } from '../../reducer'
import { FormattedMessage } from 'react-intl'
import {useHTBalance} from "../../pages/Hooks";

export const MenuMask = () => {
  const { active, account } = useActiveWeb3React()
  const [showMenu, setShowMenu] = useState(false)
  const { dispatch, state } = useContext(mainContext)
  const location = useLocation()
  const {balance} = useHTBalance()
  const handleMenuItemClick = () => {
    setShowMenu(false)
  }
  return (
    <div className='menumask'>
      <div
        className='menumask_left'
        onClick={() =>
          dispatch({
            type: HANDLE_SHOW_MENUMASK_MODAL,
            showMenuMaskModal: false,
          })
        }
      ></div>
      <div className='menumask_right'>
        <nav className='menumask_nav'>
          <ul className='menumask_list'>
            {/* <li className='menumask_item'>
              <NavLink
                exact
                to='/staking-pool1'
                className='menumask_link'
                onClick={() =>
                  dispatch({
                    type: HANDLE_SHOW_MENUMASK_MODAL,
                    showMenuMaskModal: false,
                  })
                }
              >
                <FormattedMessage id='mortgage' />
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
                }
              >
                <FormattedMessage id='liquidityPool' />
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
                }
              >
                <FormattedMessage id='crowdfund' />
              </NavLink>
            </li> */}
            <li className='menumask_item'>
              <NavLink
                exact
                to='/pools'
                className='menumask_link'
                onClick={() =>
                  dispatch({
                    type: HANDLE_SHOW_MENUMASK_MODAL,
                    showMenuMaskModal: false,
                  })
                }
              >
                <FormattedMessage id='fundraisingPool' />
                <span className='menumask__hot'></span>
              </NavLink>
            </li>
            <li className='menumask_item'>
              <NavLink
                exact
                to='/information'
                className='menumask_link'
                onClick={() =>
                  dispatch({
                    type: HANDLE_SHOW_MENUMASK_MODAL,
                    showMenuMaskModal: false,
                  })
                }
              >
                <FormattedMessage id='projectApplication' />
              </NavLink>
            </li>
            <li className='menumask_item'>
              <a
                href='https://www.baidu.com'
                target='_blank'
                className='menumask_link'
                onClick={handleMenuItemClick}
              >
                Medium
              </a>
            </li>
            <li className='menumask_item'>
              {/* <a>Guide</a> */}
              {/* <Document file={WeStarterPDF} className='download-pdf'>
              <Page pageNumber={1} />
            </Document> */}
              <a className='menumask_download-pdf'></a>
            </li>
            <div className='menumask__menu-wrapper'>
              {active && (
                <div className='menumask_header-account'>
                  <div
                    className='address'
                    onClick={() => {
                      dispatch({
                        type: HANDLE_WALLET_MODAL,
                        walletModal: 'status',
                      })
                    }}
                  >
                    {formatAddress(account)}
                    <img src={doubleLine} />
                  </div>
                </div>
              )}

              {!active && (
                <div className='pools_text_header__btn'>
                  <button className='connect-btn'>
                    <span
                      onClick={() => {
                        dispatch({
                          type: HANDLE_WALLET_MODAL,
                          walletModal: 'connect',
                        })
                      }}
                    >
                      <FormattedMessage id='linkWallet' />
                    </span>
                    <img src={dot} />
                  </button>
                </div>
              )}
              {active && (
                <div className='menumask_ht-balance'>
                  <span></span>
                  <p>{formatAmount(balance)}</p>
                </div>
              )}
            </div>
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
  )
}
