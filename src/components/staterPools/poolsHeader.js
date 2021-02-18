import React, { useEffect, useContext, useState } from 'react'
import { useActiveWeb3React } from '../../web3'
import { formatAddress, formatAmount } from '../../utils/format'
import { withRouter } from 'react-router'
import { mainContext } from '../../reducer'
import { HANDLE_WALLET_MODAL, HANDLE_SHOW_MENUMASK_MODAL } from '../../const'
import { Link, NavLink, useLocation } from 'react-router-dom'
import doubleLine from '../../assets/icon/check-double-line.png'
import { Logoicon, LogoSmallIcon } from '../../icons'
import { ReactComponent as LogoText } from '../../assets/image/logo-text.svg'
import { ReactComponent as More } from '../../assets/icon/more.svg'
import dot from '../../assets/icon/dot.png'
import PoolsBanner from '../banner/PoolsBanner'
import { FormattedMessage } from 'react-intl'
import Form from 'antd/lib/form/Form'

const PoolsHeader = (props) => {
  const { active, account } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)

  const [showMenu, setShowMenu] = useState(false)
  const [showPoolsStarter, setShowPoolsStarter] = useState(false)
  const location = useLocation()

  const handleMenuItemClick = () => {
    setShowMenu(false)
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
      className={`pools_header ${showMenu ? 'menu-show' : ''}`}
      style={location.pathname === '/' ? { borderBottom: 'transparent' } : {}}
    >
      <div className='center'>
        <div className='pools_header__box'>
          <Link to='/pools' className='pools_header__logo'>
            <LogoText />
          </Link>

          <Link
            to='/pools'
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
                    to='/pools'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='fundraisingPool' />
                    <span className='menu__hot'></span>
                  </NavLink>
                </li>
                <li className='menu__item'>
                  <NavLink
                    exact
                    to='/information'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    <FormattedMessage id='projectApplication' />
                  </NavLink>
                </li>
                <li className='menu__item'>
                  <a
                    href='https://www.baidu.com'
                    target='_blank'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    Medium
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className='pools_header__menu-wrapper'>
            <a className='download-pdf'></a>
            {active && (
              <div className='ht-balance'>
                <span></span>
                <p>2.22222</p>
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
