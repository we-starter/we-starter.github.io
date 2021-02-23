import React, { useEffect, useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { formatAddress, formatAmount } from '../../utils/format'
import { useActiveWeb3React } from '../../web3'
import globe from '../../assets/icon/globe.png'
import {
  HANDLE_SHOW_MENUMASK_MODAL,
  HANDLE_WALLET_MODAL,
  CHANGE_LOCALE,
} from '../../const'
import dot from '../../assets/icon/dot.png'
import doubleLine from '../../assets/icon/check-double-line.png'

import { mainContext } from '../../reducer'
import { FormattedMessage } from 'react-intl'
import { useHTBalance } from '../../pages/Hooks'

export const MenuMask = () => {
  const { active, account } = useActiveWeb3React()
  const [showMenu, setShowMenu] = useState(false)
  const { dispatch, state } = useContext(mainContext)
  const location = useLocation()
  const { balance } = useHTBalance()
  const [language, setLanguage] = useState(
    (state.locale === 'en' && 'English') || (state.locale === 'zh' && 'ZH-CH')
  )

  useEffect(() => {
    if (state.locale === 'en') setLanguage('English')
    if (state.locale === 'zh') setLanguage('ZH-CH')
  }, [state.locale])

  const handleMenuItemClick = () => {
    setShowMenu(false)
  }

  const tabLanguage = (val) => {
    if (val === 'en') setLanguage('English')
    if (val === 'zh') setLanguage('ZH-CH')
    dispatch({
      type: CHANGE_LOCALE,
      locale: val,
    })
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
            <div className='menumask__menu-wrapper'>
              {active && (
                <div className='menumask_ht-balance'>
                  <span></span>
                  <p>{formatAmount(balance)}</p>
                </div>
              )}
            </div>
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
            <li className='menumask_item' style={{ margin: '40px 0 15px' }}>
              <NavLink
                exact
                to='/'
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
              <a
                href='https://forms.gle/n6M5tJ46KtEfEDQz9'
                target='_blank'
                className='menumask_item-guide menumask_link'
                onClick={handleMenuItemClick}
              >
                <FormattedMessage id='projectApplication' />
              </a>
            </li>
            {/* <li className='menumask_item'>
              <a
                href='https://www.baidu.com'
                target='_blank'
                className='menumask_link'
                onClick={handleMenuItemClick}
              >
                Medium
              </a>
            </li> */}
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
          <div className='menumask_language'>
            <div className='language'>
              <img src={globe} alt='' />
              {language}
              <div
                className='language-items'
                style={{
                  position: 'absolute',
                  left: '0',
                  transform: 'translate(0)',
                }}
              >
                <p
                  onClick={() => tabLanguage('en')}
                  style={{
                    color: '#22292F',
                  }}
                >
                  English
                </p>
                <p
                  onClick={() => tabLanguage('zh')}
                  style={{
                    color: '#22292F',
                  }}
                >
                  中文简体
                </p>
              </div>
            </div>
            <ul className='footer__links'>
              <li>
                <a
                  title='title'
                  href=''
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <svg width='24' height='24' viewBox='0 0 30 30'>
                    <path d='M5 3.75h20A1.25 1.25 0 0126.25 5v20A1.25 1.25 0 0125 26.25H5A1.25 1.25 0 013.75 25V5A1.25 1.25 0 015 3.75zm16.63 16.18c-.13-.07-.2-.25-.2-.38V10c0-.13.07-.31.2-.44l1.19-1.38v-.06h-4.27l-3.2 8.1-3.64-8.1H7.3v.06l1.13 1.57c.26.25.32.63.32.94v6.9c.06.38 0 .82-.19 1.2l-1.7 2.32v.06h4.52v-.06L9.7 18.86a1.93 1.93 0 01-.19-1.2V11.4c.06.12.13.12.19.37l4.27 9.54h.06l4.15-10.35c-.07.38-.07.82-.07 1.13v7.4c0 .2-.06.32-.18.45l-1.26 1.19v.06h6.15v-.06l-1.2-1.2z' />
                  </svg>
                </a>
              </li>

              <li>
                <a title='title' href='' target='_blank' rel='noopener'>
                  <svg width='24' height='24' viewBox='0 0 30 30'>
                    <path d='M27.7 7.07c-.95.42-1.96.7-3 .82A5.25 5.25 0 0027 5a10.45 10.45 0 01-3.32 1.27 5.23 5.23 0 00-8.9 4.77A14.84 14.84 0 014 5.57a5.21 5.21 0 001.61 6.98 5.21 5.21 0 01-2.36-.65v.06a5.23 5.23 0 004.2 5.13c-.78.21-1.59.24-2.37.1a5.23 5.23 0 004.88 3.62 10.49 10.49 0 01-7.74 2.17 14.79 14.79 0 008.02 2.35c9.61 0 14.87-7.97 14.87-14.88 0-.22 0-.45-.02-.67 1.03-.74 1.91-1.66 2.61-2.7v-.01z' />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  title='title'
                  href='https://t.me/galleryfinance'
                  target='_blank'
                  rel='noopener'
                >
                  <svg width='24' height='24' viewBox='0 0 30 30'>
                    <path d='M15 27.5a12.5 12.5 0 110-25 12.5 12.5 0 010 25zm-3.89-11.04h.02l1.09 3.58c.14.39.33.46.56.43.24-.03.36-.16.52-.3l1.48-1.44 3.19 2.36c.58.32 1 .15 1.14-.54l2.07-9.78c.23-.91-.17-1.28-.87-.98l-12.17 4.7c-.83.33-.82.8-.15 1l3.12.97z' />
                  </svg>
                </a>
              </li>

              <li>
                <a title='title' href='/' target='_blank' rel='noopener'>
                  <svg width='24' height='24' viewBox='0 0 30 30'>
                    <path d='M15 2.5a12.5 12.5 0 00-3.95 24.36c.62.1.86-.27.86-.6l-.02-2.32c-3.14.58-3.95-.77-4.2-1.47-.14-.36-.75-1.47-1.28-1.77-.44-.23-1.07-.81-.02-.82.99-.02 1.69.9 1.92 1.28 1.13 1.89 2.92 1.36 3.64 1.03.11-.82.44-1.36.8-1.67-2.78-.32-5.69-1.4-5.69-6.18 0-1.36.49-2.48 1.28-3.36a4.5 4.5 0 01.13-3.3s1.04-.34 3.44 1.27a11.6 11.6 0 016.25 0c2.39-1.62 3.43-1.28 3.43-1.28.7 1.72.25 3 .13 3.31.8.88 1.28 1.99 1.28 3.36 0 4.8-2.92 5.86-5.7 6.18.45.39.84 1.14.84 2.3l-.02 3.45c0 .32.24.71.86.59A12.52 12.52 0 0015 2.5z'></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          <ul className='menumask_list' style={{ borderBottom: 'none' }}>
            <li className='menumask_item' style={{ margin: '10px 0' }}>
              <a
                href='https://medium.com/@westarter'
                target='_blank'
                className='menumask_item-guide menumask_link'
                style={{ color: '#7A7F82' }}
              >
                <FormattedMessage id='productManual' />
              </a>
            </li>
            <li className='menumask_item' style={{ margin: '10px 0' }}>
              <a
                href='https://www.baidu.com'
                target='_blank'
                className='menumask_item-guide menumask_link'
                style={{ color: '#7A7F82' }}
              >
                <FormattedMessage id='guide' />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
