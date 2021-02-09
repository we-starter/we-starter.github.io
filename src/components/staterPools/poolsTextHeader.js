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

const PoolsTextHeader = (props) => {
  const { active, account } = useActiveWeb3React()
  const { dispatch } = useContext(mainContext)
  const { styleVal } = props
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
                <li className='menu__item'>
                  <NavLink
                    exact
                    to='/staking-pool1'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    抵押挖矿
                  </NavLink>
                </li>
                <li className='menu__item'>
                  <NavLink
                    exact
                    to='/staking-pool2'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    流动性挖矿
                  </NavLink>
                </li>
                <li className='menu__item'>
                  <NavLink
                    exact
                    to=''
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    众筹池
                  </NavLink>
                </li>
                <li className='menu__item'>
                  <NavLink
                    exact
                    to='/pools'
                    className='menu__link'
                    onClick={handleMenuItemClick}
                  >
                    PoolS
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
                    项目申请
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          <div className='pools_text_header__menu-wrapper'>
            {/* <a>Guide</a> */}

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
                    链接钱包
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
