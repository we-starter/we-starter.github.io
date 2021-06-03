import React, { useEffect, useContext, useState } from 'react'
import { useActiveWeb3React } from '../../web3'
import { WAR_ADDRESS } from '../../web3/address'
import globe from '../../assets/icon/globe.png'
import { formatAddress, formatAmount } from '../../utils/format'
import { withRouter } from 'react-router'
import { mainContext } from '../../reducer'
import WeStarterGuidebookZH from '../../pdfFile/WeStarter -优质资产起跑线.pdf'
import WeStarterGuidebookEN from '../../pdfFile/WeStarter-Introduction in English.pdf'
import { HANDLE_WALLET_MODAL, HANDLE_SHOW_MENUMASK_MODAL } from '../../const'
import { Link, NavLink, useLocation } from 'react-router-dom'
import doubleLine from '../../assets/icon/check-double-line.png'
import { Logoicon, LogoSmallIcon } from '../../icons'
import { ReactComponent as LogoText } from '../../assets/image/logo-text.svg'
import { ReactComponent as More } from '../../assets/icon/more.svg'
import dot from '../../assets/icon/dot.png'
import PoolsBanner from '../banner/PoolsBanner'
import Exchange from '../../assets/icon/exchange@2x.png'
import { FormattedMessage } from 'react-intl'
import Form from 'antd/lib/form/Form'
import { CHANGE_LOCALE } from '../../const'
import { useHTBalance, useBalance } from '../../pages/Hooks'

const PoolsHeader = (props) => {
  const { active, account, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)

  const [showMenu, setShowMenu] = useState(false)
  const [showPoolsStarter, setShowPoolsStarter] = useState(false)
  const location = useLocation()
  const [language, setLanguage] = useState(
    (state.locale === 'en' && '中文简体') ||
      (state.locale === 'zh' && 'English')
  )
  const { balance } = useBalance(WAR_ADDRESS(chainId))
  console.log(balance, 'balance')
  const handleMenuItemClick = () => {
    setShowMenu(false)
  }
  useEffect(() => {
    if (state.locale === 'en') setLanguage('中文简体')
    if (state.locale === 'zh') setLanguage('English')
  }, [state.locale])
  useEffect(() => {
    // if (props.history.location.pathname === '/pools') {
    //   setShowPoolsStarter(true)
    // } else {
    //   setShowPoolsStarter(false)
    // }
  })
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
      className={`pools_header ${showMenu ? 'menu-show' : ''}`}
      style={location.pathname === '/' ? { borderBottom: 'transparent' } : {}}
    >
      <div className='center'>
        <div className='pools_header__box'>
          <Link to='/' className='pools_header__logo'>
            <LogoText />
          </Link>

          <Link
            to='/'
            className={`pools_header__logo--small ${active ? 'active' : ''}`}
          >
            <LogoText />
          </Link>

          <div className='pools_header__menu'>
            <nav className='menu'>
              <ul className='menu__list'>
                {/* <li className='menu__item'>
                  <NavLink
                    exact
                    to='/staking-pool1'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='mortgage' />
                  </NavLink>
                </li>
                <li className='menu__item'>
                  <NavLink
                    exact
                    to='/staking-pool2'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='liquidityPool' />
                  </NavLink>
                </li>
                <li className='menu__item'>
                  <NavLink
                    exact
                    to=''
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='crowdfund' />
                  </NavLink>
                </li> */}
                <li className='menu__item'>
                  <NavLink
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
                        ? 'https://www.yuque.com/docs/share/f89e3a8a-a918-48da-bf61-700ddcfaac95?#'
                        : 'https://www.yuque.com/docs/share/cc71c6e4-4d0d-4ef4-bcb8-0bee03bd02f3?# '
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

          <div className='pools_header__menu-wrapper'>
            {/* <a className='download-pdf'></a> */}
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
            {active && (
              <div className='ht-balance'>
                <span></span>
                <p>{formatAmount(balance)} WAR</p>
              </div>
            )}
            {/* <a>Guide</a> */}
            {active && (
              <div className='pools_header-account'>
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
              <div className='pools_header__btn'>
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
      {/* banner图 */}
      <PoolsBanner {...props} />
    </header>
  )
}

export default withRouter(PoolsHeader)
