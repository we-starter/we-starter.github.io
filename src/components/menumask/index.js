import React, { useEffect, useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { formatAddress, formatAmount } from '../../utils/format'
import { useActiveWeb3React } from '../../web3'
import { ChainId, WAR_ADDRESS } from '../../web3/address'
import WeStarterGuidebookZH from '../../pdfFile/WeStarter -优质资产起跑线.pdf'
import WeStarterGuidebookEN from '../../pdfFile/WeStarter-Introduction in English.pdf'
import globe from '../../assets/icon/globe.png'
import Exchange from '../../assets/icon/exchange@2x.png'
import { ReactComponent as LogoText } from '../../assets/image/logo-text.svg'
import {
  HANDLE_SHOW_MENUMASK_MODAL,
  HANDLE_WALLET_MODAL,
  CHANGE_LOCALE,
} from '../../const'
import dot from '../../assets/icon/dot.png'
import doubleLine from '../../assets/icon/check-double-line.png'

import { mainContext } from '../../reducer'
import { FormattedMessage } from 'react-intl'
import { useHTBalance, useBalance } from '../../pages/Hooks'
import RAW_ICON from "../../assets/icon/RAW@2x.png";
import WAR_ICON from "../../assets/icon/WAR@2x.png";
import Close from '../../assets/icon/close-line 3@2x.png'
export const MenuMask = () => {
  const { active, account, chainId } = useActiveWeb3React()
  const [showMenu, setShowMenu] = useState(false)
  const { dispatch, state } = useContext(mainContext)
  const location = useLocation()
  const { balance } = useBalance(WAR_ADDRESS(chainId), chainId)
  const [language, setLanguage] = useState(
    (state.locale === 'en' && 'English') ||
    (state.locale === 'zh' && '中文简体') ||
    (state.locale === 'ru' && 'Русский язык')
  )

  useEffect(() => {
    if (state.locale === 'en') setLanguage('English')
    if (state.locale === 'zh') setLanguage('中文简体')
    if (state.locale === 'ru') setLanguage('Русский язык')
  }, [state.locale])

  const handleMenuItemClick = () => {
    setShowMenu(false)
  }

  const tabLanguage = (val) => {
    // val = val === 'English' ? 'en' : 'zh'
    if (val === 'en') setLanguage('English')
    if (val === 'zh') setLanguage('中文简体')
    if (val === 'ru') setLanguage('Русский язык')
    dispatch({
      type: CHANGE_LOCALE,
      locale: val,
    })
  }

  return (
    <div className='menumask'>
      {/* <div
        className='menumask_left'
        onClick={() =>
          dispatch({
            type: HANDLE_SHOW_MENUMASK_MODAL,
            showMenuMaskModal: false,
          })
        }
      ></div> */}
      <div className='menumask_right'>
        <nav className='menumask_nav'>
          <div className='menumask_title'>
            <LogoText />
            <img src={Close} onClick={() =>
              dispatch({
                type: HANDLE_SHOW_MENUMASK_MODAL,
                showMenuMaskModal: false,
              })
            } />
          </div>
          <ul className='menumask_list'>
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
              </NavLink>
            </li>
            <li className='menumask_item'>
              <NavLink
                to='/farm'
                className='menumask_link'
                onClick={() =>
                  dispatch({
                    type: HANDLE_SHOW_MENUMASK_MODAL,
                    showMenuMaskModal: false,
                  })
                }
              >
                <FormattedMessage id='farm' />
                <span className='menumask__hot'></span>
              </NavLink>
            </li>

            <li className='menumask_item'>
              <NavLink
                to='/application'
                className='menumask_item-guide menumask_link'
                onClick={handleMenuItemClick}
              >
                <FormattedMessage id='projectApplication' />
              </NavLink>
            </li>
            <li className='menumask_item'>
              <a
                href='https://docs.google.com/forms/d/e/1FAIpQLSe28QjmQyzrO98dsIKpmyGXq3J-_hHvNQx4l1LEvsnkv0fapQ/viewform?usp=sf_link'
                target='_blank'
                className='menumask_item-guide menumask_link'
                onClick={handleMenuItemClick}
              >
                <FormattedMessage id='projectApplicationLink' />
              </a>
            </li>
          </ul>

          <ul className='menumask_list' style={{ borderBottom: 'none' }}>
            <li className='menumask_item' style={{ margin: '10px 0' }}>
              <a
                href={
                  language === 'English'
                    ? WeStarterGuidebookZH
                    : WeStarterGuidebookEN
                }
                target='_blank'
                className='menumask_item-guide menumask_link'
                style={{ color: '#7A7F82' }}
              >
                <FormattedMessage id='productManual' />
              </a>
            </li>
            <li className='menumask_item' style={{ margin: '10px 0' }}>
              <a
                href={
                  language === 'English'
                    ? 'https://www.yuque.com/docs/share/f89e3a8a-a918-48da-bf61-700ddcfaac95?#'
                    : 'https://www.yuque.com/docs/share/cc71c6e4-4d0d-4ef4-bcb8-0bee03bd02f3?# '
                }
                target='_blank'
                className='menumask_item-guide menumask_link'
                style={{ color: '#7A7F82' }}
              >
                <FormattedMessage id='guide' />
              </a>
            </li>
          </ul>
          <div className='menumask_language'>
            <div className='language'>
              <img src={globe} alt='' />
              {language}
              {/* {language === '中文简体' ? '中文简体' : 'English'} */}
              <div
                className='language-items'
                style={{
                  position: 'absolute',
                  left: '0',
                  transform: 'translate(0)',
                }}
              >
                <p
                  style={{
                    color: '#22292F',
                    padding: '0',
                    marginBottom: '0',
                  }}
                  onClick={() => tabLanguage('en')}
                >
                  English
                </p>
                {/* <p
                  style={{
                    color: '#22292F',
                    padding: '0',
                    marginBottom: '0',
                  }}
                  onClick={() => tabLanguage('zh')}
                >
                  中文简体
                </p> */}
                <p
                  style={{
                    color: '#22292F',
                    padding: '0',
                    marginBottom: '0',
                  }}
                  onClick={() => tabLanguage('ru')}
                >
                  Русский язык
                </p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
