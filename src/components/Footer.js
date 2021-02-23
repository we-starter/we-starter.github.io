import React, { useEffect, useState, useContext } from 'react'
import globe from '../assets/icon/globe.png'
import yuque from '../assets/icon/yuque@2x.png'
import { mainContext } from '../reducer'
import { withRouter } from 'react-router'
import { CHANGE_LOCALE } from '../const'

const Footer = (props) => {
  const { dispatch, state } = useContext(mainContext)
  const [flag, setFlag] = useState(false)
  const [language, setLanguage] = useState(
    (state.locale === 'en' && 'English') || (state.locale === 'zh' && 'ZH-CH')
  )

  useEffect(() => {
    if (state.locale === 'en') setLanguage('English')
    if (state.locale === 'zh') setLanguage('ZH-CH')
  }, [state.locale])

  useEffect(() => {
    if (props.history.location.pathname === '/information') {
      setFlag(true)
    } else {
      setFlag(false)
    }
  })

  const tabLanguage = (val) => {
    if (val === 'en') setLanguage('English')
    if (val === 'zh') setLanguage('ZH-CH')
    dispatch({
      type: CHANGE_LOCALE,
      locale: val,
    })
  }

  return (
    <footer
      className='footer'
      style={{ zIndex: 0, backgroundColor: flag ? '#f2f0ea' : '' }}
    >
      <div className='footer_wrap'>
        <ul className='footer__links'>
          <li>
            <a
              title='title'
              href='https://medium.com/@westarter'
              target='_blank'
              rel='noopener noreferrer'
            >
              <svg width='24' height='24' viewBox='0 0 30 30'>
                <path d='M5 3.75h20A1.25 1.25 0 0126.25 5v20A1.25 1.25 0 0125 26.25H5A1.25 1.25 0 013.75 25V5A1.25 1.25 0 015 3.75zm16.63 16.18c-.13-.07-.2-.25-.2-.38V10c0-.13.07-.31.2-.44l1.19-1.38v-.06h-4.27l-3.2 8.1-3.64-8.1H7.3v.06l1.13 1.57c.26.25.32.63.32.94v6.9c.06.38 0 .82-.19 1.2l-1.7 2.32v.06h4.52v-.06L9.7 18.86a1.93 1.93 0 01-.19-1.2V11.4c.06.12.13.12.19.37l4.27 9.54h.06l4.15-10.35c-.07.38-.07.82-.07 1.13v7.4c0 .2-.06.32-.18.45l-1.26 1.19v.06h6.15v-.06l-1.2-1.2z' />
              </svg>
            </a>
          </li>

          <li>
            <a
              title='title'
              href='https://www.twitter.com/starter_we'
              target='_blank'
              rel='noopener'
            >
              <svg width='24' height='24' viewBox='0 0 30 30'>
                <path d='M27.7 7.07c-.95.42-1.96.7-3 .82A5.25 5.25 0 0027 5a10.45 10.45 0 01-3.32 1.27 5.23 5.23 0 00-8.9 4.77A14.84 14.84 0 014 5.57a5.21 5.21 0 001.61 6.98 5.21 5.21 0 01-2.36-.65v.06a5.23 5.23 0 004.2 5.13c-.78.21-1.59.24-2.37.1a5.23 5.23 0 004.88 3.62 10.49 10.49 0 01-7.74 2.17 14.79 14.79 0 008.02 2.35c9.61 0 14.87-7.97 14.87-14.88 0-.22 0-.45-.02-.67 1.03-.74 1.91-1.66 2.61-2.7v-.01z' />
              </svg>
            </a>
          </li>
          <li>
            <a
              title='title'
              href='https://t.me/westarter_official'
              target='_blank'
              rel='noopener'
            >
              <svg width='24' height='24' viewBox='0 0 30 30'>
                <path d='M15 27.5a12.5 12.5 0 110-25 12.5 12.5 0 010 25zm-3.89-11.04h.02l1.09 3.58c.14.39.33.46.56.43.24-.03.36-.16.52-.3l1.48-1.44 3.19 2.36c.58.32 1 .15 1.14-.54l2.07-9.78c.23-.91-.17-1.28-.87-.98l-12.17 4.7c-.83.33-.82.8-.15 1l3.12.97z' />
              </svg>
            </a>
          </li>

          <li>
            <a
              title='title'
              href='https://github.com/we-starter'
              target='_blank'
              rel='noopener'
            >
              <svg width='24' height='24' viewBox='0 0 30 30'>
                <path d='M15 2.5a12.5 12.5 0 00-3.95 24.36c.62.1.86-.27.86-.6l-.02-2.32c-3.14.58-3.95-.77-4.2-1.47-.14-.36-.75-1.47-1.28-1.77-.44-.23-1.07-.81-.02-.82.99-.02 1.69.9 1.92 1.28 1.13 1.89 2.92 1.36 3.64 1.03.11-.82.44-1.36.8-1.67-2.78-.32-5.69-1.4-5.69-6.18 0-1.36.49-2.48 1.28-3.36a4.5 4.5 0 01.13-3.3s1.04-.34 3.44 1.27a11.6 11.6 0 016.25 0c2.39-1.62 3.43-1.28 3.43-1.28.7 1.72.25 3 .13 3.31.8.88 1.28 1.99 1.28 3.36 0 4.8-2.92 5.86-5.7 6.18.45.39.84 1.14.84 2.3l-.02 3.45c0 .32.24.71.86.59A12.52 12.52 0 0015 2.5z'></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              title='title'
              href='https://www.yuque.com'
              target='_blank'
              rel='noopener'
            >
              <svg width='24' height='30' viewBox='0 0 30 30'>
                <path d='M8.46424943,5.10249711 L8.47461061,5.109 L9.83620065,2.74070849 C9.93811703,1.90940768 9.58503922,1.02787459 8.77638646,0.0961091845 C8.76330143,0.081043992 8.75886764,0.0603157452 8.76464474,0.0412159218 C8.77042185,0.0221160985 8.78560064,0.0073200529 8.80484175,0.00203252033 L8.82023085,6.75015599e-14 L14.2087326,6.75015599e-14 L14.2093133,0.00464576982 C16.4357941,0.110046462 18.2093133,1.97125435 18.2093133,4.25203252 C18.2093133,5.4898374 17.6872459,6.6039489 16.8539126,7.38095239 C18.5287093,8.64982581 19.6088487,10.6489547 19.6088487,12.8980836 C19.6088487,16.6954123 16.5295804,19.7810685 12.7078615,19.8423345 L0.0136106136,19.8432056 L8.46424943,5.10249711 Z'></path>
              </svg>
            </a>
          </li>
        </ul>
        {/* <div className='language'>
          <img src={globe} alt='' />
          {language}
          <div className='language-items'>
            <p onClick={() => tabLanguage('en')}>English</p>
            <p onClick={() => tabLanguage('zh')}>中文简体</p>
          </div>
        </div> */}
      </div>
    </footer>
  )
}

export default withRouter(Footer)
