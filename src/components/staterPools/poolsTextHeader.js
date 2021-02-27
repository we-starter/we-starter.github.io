import React, { useEffect, useContext, useState } from 'react'
import { useActiveWeb3React } from '../../web3'
import globe from '../../assets/icon/globe.png'
import WeStarterGuidebookZH from '../../pdfFile/WeStarter -优质资产起跑线.pdf'
import WeStarterGuidebookEN from '../../pdfFile/WeStarter-Introduction in English.pdf'
import { formatAddress, formatAmount } from '../../utils/format'
import { withRouter } from 'react-router'
import { mainContext } from '../../reducer'
import { HANDLE_WALLET_MODAL, HANDLE_SHOW_MENUMASK_MODAL } from '../../const'
import { Link, NavLink, useLocation } from 'react-router-dom'
import doubleLine from '../../assets/icon/check-double-line.png'
import { Logoicon, LogoSmallIcon } from '../../icons'
import { ReactComponent as LogoText } from '../../assets/image/logo-text.svg'
import { ReactComponent as More } from '../../assets/icon/more.svg'
import { FormattedMessage } from 'react-intl'
import dot from '../../assets/icon/dot.png'
import { CHANGE_LOCALE } from '../../const'
import WeStarterPDF from '../../pdfFile/Security Assessment for WeStarter - Starter.pdf'
import { useHTBalance } from '../../pages/Hooks'

const PoolsTextHeader = (props) => {
  const { active, account } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const { styleVal } = props
  const [showMenu, setShowMenu] = useState(false)
  const [showPoolsStarter, setShowPoolsStarter] = useState(false)
  const location = useLocation()
  const { balance } = useHTBalance()
  const [language, setLanguage] = useState(
    (state.locale === 'en' && '中文简体') ||
      (state.locale === 'zh' && 'English')
  )

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

  useEffect(() => {
    // if (props.history.location.pathname === '/pools') {
    //   setShowPoolsStarter(true)
    // } else {
    //   setShowPoolsStarter(false)
    // }
  })

  return (
    <header
      className={`pools_text_header ${showMenu ? 'menu-show' : ''}`}
      style={location.pathname === '/' ? { borderBottom: 'transparent' } : {}}
      style={styleVal && { background: styleVal }}
    >
      <div className='center'>
        <div className='pools_text_header__box'>
          <Link to='/' className='pools_text_header__logo'>
            <LogoText />
          </Link>

          <Link
            to='/'
            className={`pools_text_header__logo--small ${
              active ? 'active' : ''
            }`}
          >
            <LogoText />
          </Link>

          <div className='pools_text_header__menu'>
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
                    exact
                    to='/'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='fundraisingPool' />
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

          <div className='pools_text_header__menu-wrapper'>
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
            {/* <a className='download-pdf' href={WeStarterPDF} target='_blank'></a> */}
            {active && (
              <div className='ht-balance'>
                <span></span>
                <p>{formatAmount(balance)}</p>
              </div>
            )}
            {active && (
              <div className='pools_text_header-account'>
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
    </header>
  )
}

export default withRouter(PoolsTextHeader)
