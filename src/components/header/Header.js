import React, { useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../web3'
import { WAR_ADDRESS, ChainId } from '../../web3/address'
import globe from '../../assets/icon/globe.png'
import WeStarterGuidebookZH from '../../pdfFile/WeStarter -优质资产起跑线.pdf'
import WeStarterGuidebookEN from '../../pdfFile/WeStarter-Introduction in English.pdf'
import { formatAddress, formatAmount } from '../../utils/format'
import { mainContext } from '../../reducer'
import { HANDLE_WALLET_MODAL, HANDLE_CHANGE_NETWORKS, HANDLE_SHOW_MENUMASK_MODAL } from '../../const'
import { Link, NavLink, useLocation } from 'react-router-dom'
import doubleLine from '../../assets/icon/check-double-line.png'
import { ReactComponent as LogoText } from '../../assets/image/logo-text.svg'
import { ReactComponent as More } from '../../assets/icon/more.svg'
import dot from '../../assets/icon/dot.png'
import BSC from '../../assets/chain/binance.png'
import HECO from '../../assets/chain/heco.png'
import MATIC from '../../assets/chain/matic.png'
import AVALANCHE from '../../assets/chain/avalanche.png'
import { useBalance } from '../../pages/Hooks'
import { CHANGE_LOCALE } from '../../const'
import { FormattedMessage } from 'react-intl'
import WAR_ICON from '../../assets/icon/WAR@2x.png'
import RAW_ICON from '../../assets/icon/RAW@2x.png'

export const Header = () => {
  const { active, account, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const { balance } = useBalance(WAR_ADDRESS(chainId), chainId)
  console.log('balance', balance)
  const [language, setLanguage] = useState(
    (state.locale === 'en' && 'English') ||
    (state.locale === 'zh' && '中文简体') ||
    (state.locale === 'ru' && 'Русский язык')
  )

  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (state.locale === 'en') setLanguage('English')
    if (state.locale === 'zh') setLanguage('中文简体')
    if (state.locale === 'ru') setLanguage('Русский язык')
  }, [state.locale])

  const handleMenuItemClick = () => {
    setShowMenu(false)
  }

  const tabLanguage = (val) => {
    // val = val === 'English' ? 'en' : val === 'ru' ? 'Русский язык' : 'zh'
    if (val === 'en') setLanguage('English')
    if (val === 'zh') setLanguage('中文简体')
    if (val === 'ru') setLanguage('Русский язык')
    dispatch({
      type: CHANGE_LOCALE,
      locale: val,
    })
  }

  return (
    <header
      className={`header ${showMenu ? 'menu-show' : ''}`}
      style={{ borderBottom: 'transparent' }}
    >
      <div className='center'>
        <div className='header__box'>
          <Link to='/' className='header__logo'>
            <LogoText />
          </Link>

          <Link
            to='/'
            className={`header__logo--small ${active ? 'active' : ''}`}
          >
            <LogoText />
          </Link>

          <div className='header__menu'>
            <nav className='menu'>
              <ul className='menu__list'>
                <li className='menu__item'>
                  <NavLink
                    exact
                    to='/pools'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='fundraisingPool' />
                  </NavLink>
                </li>
                <li className='menu__item'>
                  <NavLink
                    to='/farm'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='farm' />
                    <span className='menu__hot'></span>
                  </NavLink>
                </li>
                {/*{active && (*/}
                {/*  <li className='menu__item'>*/}
                {/*    <NavLink*/}
                {/*      to='/migrate'*/}
                {/*      className='menu__link'*/}
                {/*      onClick={handleMenuItemClick}*/}
                {/*    >*/}
                {/*      <FormattedMessage id='bridge' />*/}
                {/*    </NavLink>*/}
                {/*  </li>*/}
                {/*)}*/}
                <li className='menu__item'>

                  <NavLink
                    to='/application'
                    className='menumask_item-guide menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='projectApplication' />
                  </NavLink>
                </li>
                <li className='menu__item'>
                  <a
                    href='https://docs.google.com/forms/d/e/1FAIpQLSe28QjmQyzrO98dsIKpmyGXq3J-_hHvNQx4l1LEvsnkv0fapQ/viewform?usp=sf_link'
                    target='_blank'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='projectApplicationLink' />
                  </a>
                </li>
                <li className='menu__item'>
                  <a
                    href={
                      language === '中文简体'
                        ? WeStarterGuidebookZH
                        : WeStarterGuidebookEN
                    }
                    target='_blank'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='productManual' />
                  </a>
                </li>
                <li className='menu__item'>
                  <a
                    href={
                      language === '中文简体'
                        ? 'https://westarter.medium.com/westarter-tutorial-how-to-set-up-the-heco-wallets-5d8bfc253c78'
                        : 'https://westarter.medium.com/westarter-tutorial-how-to-set-up-the-heco-wallets-5d8bfc253c78 '
                    }
                    target='_blank'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='guide' />
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className='header__menu-wrapper'>
            <div
              className='language'
              style={{ marginRight: '16px' }}
            // onClick={() => tabLanguage(language)}
            >
              <img src={globe} alt='' />
              {language}
              {/* {language === '中文简体' ? '中文简体' : 'English'} */}
              <div
                className='language-items'
                style={{ top: '40px', bottom: 'auto' }}
              >
                {/* <p
                  style={{ padding: '0', marginBottom: '0' }}
                  onClick={() => tabLanguage('zh')}
                >
                  中文简体
                </p> */}
                <p
                  style={{ padding: '0', marginBottom: '0' }}
                  onClick={() => tabLanguage('en')}
                >
                  English
                </p>
                <p
                  style={{ padding: '0', marginBottom: '0' }}
                  onClick={() => tabLanguage('ru')}
                >
                  Русский язык
                </p>
              </div>
            </div>
            {/* {active && <img className='exchange' src={Exchange} />} */}



            {active && (
              <div className='ht-balance'>
                {chainId == ChainId.BSC && (
                  <img
                    onClick={() => {
                      dispatch({
                        type: HANDLE_CHANGE_NETWORKS,
                        changeNetworkStatus: true,
                      })
                    }}
                    className='header-network'
                    src={BSC}
                  />
                )}
                {chainId == ChainId.HECO && (
                  <img
                    onClick={() => {
                      dispatch({
                        type: HANDLE_CHANGE_NETWORKS,
                        changeNetworkStatus: true,
                      })
                    }}
                    className='header-network'
                    src={HECO}
                  />
                )}
                {chainId == ChainId.MATIC && (
                  <img
                    onClick={() => {
                      dispatch({
                        type: HANDLE_CHANGE_NETWORKS,
                        changeNetworkStatus: true,
                      })
                    }}
                    className='header-network'
                    src={MATIC}
                  />
                )}
                {chainId == ChainId.AVALANCHE && (
                  <img
                    onClick={() => {
                      dispatch({
                        type: HANDLE_CHANGE_NETWORKS,
                        changeNetworkStatus: true,
                      })
                    }}
                    className='header-network'
                    src={AVALANCHE}
                  />
                )}
                {/* <span>
                  <img
                    src={chainId === ChainId.MATIC ? RAW_ICON : WAR_ICON}
                    alt=''
                  />
                </span> */}
                <p>{formatAmount(balance)} WAR</p>
              </div>
            )}
            {active && (
              <div className='header-account'>
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
                  {/* <img src={doubleLine} /> */}
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
                      })
                    }}
                  >
                    <FormattedMessage id='linkWallet' />
                  </span>
                  {/* <img src={dot} /> */}
                </button>
              </div>
            )}
          </div>
          <div className='more'>
            <More
              onClick={() => {
                dispatch({
                  type: HANDLE_SHOW_MENUMASK_MODAL,
                  showMenuMaskModal: true,
                })
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
