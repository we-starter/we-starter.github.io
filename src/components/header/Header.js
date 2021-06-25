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
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import MATIC from '../../assets/icon/MATIC@2x.png'
import { useBalance } from '../../pages/Hooks'
import { CHANGE_LOCALE } from '../../const'
import { FormattedMessage } from 'react-intl'

export const Header = () => {
  const { active, account, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const { balance } = useBalance(WAR_ADDRESS(chainId))
  const [language, setLanguage] = useState(
    (state.locale === 'en' && '中文简体') ||
      (state.locale === 'zh' && 'English')
  )

  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (state.locale === 'en') setLanguage('中文简体')
    if (state.locale === 'zh') setLanguage('English')
  }, [state.locale])

  const handleMenuItemClick = () => {
    setShowMenu(false)
  }

  const tabLanguage = (val) => {
    val = val === 'English' ? 'en' : 'zh'
    if (val === 'en') setLanguage('English')
    if (val === 'zh') setLanguage('中文简体')
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
                    to='/'
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
                <li className='menu__item'>
                  <a
                    href='https://forms.gle/n6M5tJ46KtEfEDQz9'
                    target='_blank'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='projectApplication' />
                  </a>
                </li>
                <li className='menu__item'>
                  <a
                    href={
                      language === 'English'
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
                      language === 'English'
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
              onClick={() => tabLanguage(language)}
            >
              <img src={globe} alt='' />
              {language === '中文简体' ? '中文简体' : 'English'}
              {/* <div
                className='language-items'
                style={{ top: '80%', bottom: 'auto' }}
              >
                {language === 'ZH-CH' && (
                  <p
                    style={{ padding: '0', marginBottom: '0' }}
                    onClick={() => tabLanguage('en')}
                  >
                    English
                  </p>
                )}
                {language === 'English' && (
                  <p
                    style={{ padding: '0', marginBottom: '0' }}
                    onClick={() => tabLanguage('zh')}
                  >
                    中文简体
                  </p>
                )}
              </div> */}
            </div>
            {/* {active && <img className='exchange' src={Exchange} />} */}

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

            {active && (
              <div className='ht-balance'>
                <span></span>
                <p>{formatAmount(balance)}</p>
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
                      })
                    }}
                  >
                    <FormattedMessage id='linkWallet' />
                  </span>
                  <img src={dot} />
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
