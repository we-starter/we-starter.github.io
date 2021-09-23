import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router'
import { useActiveWeb3React } from '../../web3'
import {ChainId, USDT_ADDRESS, WAR_ADDRESS, WHT_ADDRESS} from '../../web3/address'
import { useMDexPrice } from '../../pages/pools/Hooks'
import { splitFormat } from '../../utils/format'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { message } from 'antd'
import toolApi from '../../apis/toolApi'
import Icon1 from '../../assets/icon/icon1@2x.png'
import Icon2 from '../../assets/icon/icon2@2x.png'
import Icon3 from '../../assets/icon/icon3@2x.png'
import Icon4 from '../../assets/icon/icon4@2x.png'
import FileCopyLine from '../../assets/image/file-copy-line@2x.png'
import BigNumber from 'bignumber.js'
import { HANDLE_WALLET_MODAL } from '../../const'
import {
  usePoolsInfo,
  usePoolsLBPInfo,
  useFarmInfo,
} from '../../pages/pools/Hooks'
import { mainContext } from '../../reducer'
import WeStarterPDF from '../../pdfFile/Security Assessment for WeStarter - Starter.pdf'

const Banner = (props) => {
  const { chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const pools = usePoolsInfo()
  const poolsLBP = usePoolsLBPInfo()
  const [realTimePrice, setRealTimePrice] = useState('-')
  const [bscPrice, setBscPrice] = useState(0)
  let timer = useRef()
  const WarTokenAddress =
    WAR_ADDRESS[chainId] || '0x910651F81a605a6Ef35d05527d24A72fecef8bF0'
  // const [_tmp_price_war2ht, _tmp_price_war2ht_fee] = useMDexPrice(
  //   chainId && WAR_ADDRESS(chainId),
  //   chainId && WHT_ADDRESS(chainId)
  // )

  // const [_tmp_price_usdt2ht, _tmp_price_usdt2ht_fee] = useMDexPrice(
  //   chainId && USDT_ADDRESS(chainId),
  //   chainId && WHT_ADDRESS(chainId)
  // )

  // useEffect(() => {
  //   console.log('_tmp_price_war2ht', _tmp_price_war2ht)
  //   console.log('_tmp_price_usdt2ht', _tmp_price_usdt2ht)
  //   const price = _tmp_price_war2ht / _tmp_price_usdt2ht
  //   if (!isNaN(price) && price > 0) {
  //     setRealTimePrice(price.toFixed(3))
  //   }
  // }, [_tmp_price_war2ht, _tmp_price_usdt2ht])

  const [price, fee] = useMDexPrice(
    WAR_ADDRESS(ChainId.HECO),
    USDT_ADDRESS(ChainId.HECO),
    1,
    [WHT_ADDRESS(ChainId.HECO)],
    128
  )

  useEffect(() => {
    if (price * 1 > 0) {
      setRealTimePrice(splitFormat(price, 3))
    }
  }, [price])


  const addToken = async () => {
    try {
      let addTokenClick = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: WarTokenAddress,
            symbol: 'WAR',
            decimals: 18,
            image: '',
          },
        },
      })
      if (addTokenClick) {
        message.success('add success')
      }
    } catch (err) {
      console.log(err, 'addToken')
    }
  }

  return (
    <div className='banner-box'>
      <div className='banner'>
        <h3 className='banner_text'>
          <FormattedMessage id='bannerTitle1' />
        </h3>
        <div className='banner_text-title'>
          <div>
            {/* <span>
              <FormattedMessage id='bannerText1' /> :{' '}
            </span>{' '} */}
            <a href='' className='huobi_logo'></a>
            <a href='' className='huobi_logo binance_logo'></a>
            <a href='' className='huobi_logo polygon_logo'></a>
          </div>
          <div className='banner_small_pdf'>
            <a href={WeStarterPDF} target='_blank'>
              <span className='pdf-icon'></span>
              <span className='pdf-text'>
                <FormattedMessage id='certik' />
              </span>
            </a>
          </div>
        </div>
        {/* <div className='banner_small_img'>缺少banner图</div> */}
        <div className='banner_text_img'>
          <p className='banner_dec'>
            <FormattedMessage id='bannerContent1' />
            <br />
            {state.locale == 'zh' && <FormattedMessage id='bannerContent2' />}
          </p>
          {/* <div className='banner_big_img'>缺少banner图</div> */}
        </div>

        <div className='banner_link'>
          {/* <span>
            <FormattedMessage id='bannerText1' /> :{' '}
          </span>{' '} */}
          <a href='' className='huobi_logo'></a>
          <a href='' className='huobi_logo binance_logo'></a>
          <a href='' className='huobi_logo polygon_logo'></a>
        </div>
        <ul className='banner_svg__links'>
          <li>
            <a
              title='title'
              href='https://twitter.com/westarter_org'
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
              <svg width='24' height='26' viewBox='0 0 26 26'>
                <path d='M11.23823,22 C10.2198086,22.0035115 9.39035095,21.1913055 9.38327418,20.1836134 L9.37592774,18.8836151 C5.73031802,19.6681552 4.9613148,17.3536168 4.9613148,17.3536168 C4.36503551,15.8554314 3.50599711,15.4572398 3.50599711,15.4572398 C2.31715301,14.6517906 3.59605293,14.6681462 3.59605293,14.6681462 C4.91077706,14.7590518 5.60352999,16.0045108 5.60352999,16.0045108 C6.77217138,17.9863415 8.66941055,17.413608 9.4163538,17.0826971 C9.53395878,16.2445161 9.87389679,15.6727015 10.248751,15.3481613 C7.33813628,15.0208851 4.27867355,13.9081498 4.27867355,8.94087246 C4.27867355,7.52542498 4.79042749,6.36905421 5.62924254,5.46087681 C5.49327146,5.13360052 5.04491153,3.81542932 5.75603057,2.02996851 C5.75603057,2.02996851 6.85669673,1.68178313 9.36030623,3.35904347 C10.4294195,3.07122821 11.5322908,2.92450592 12.6402654,2.9226887 C13.7528592,2.92724215 14.8746567,3.07086964 15.9220405,3.35904347 C18.4238134,1.68180355 19.522643,2.02996851 19.522643,2.02996851 C20.2355986,3.81632775 19.7872387,5.13451937 19.6512676,5.46087681 C20.4910113,6.36815577 21,7.52542498 21,8.94089288 C21,13.9208912 17.9340988,15.0172505 15.0170662,15.338156 C15.4865575,15.7408806 15.905511,16.5290554 15.905511,17.7390669 C15.905511,19.4745215 15.8990726,20.1826945 15.8990726,20.1826945 C15.8920104,21.1898283 15.0638146,22.0020132 14.0459533,22 L11.2382094,22 L11.23823,22 Z'></path>
              </svg>
            </a>
          </li>
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
          {/* <li>
            <a
              title='title'
              href='https://www.yuque.com/westarter'
              target='_blank'
              rel='noopener'
            >
              <svg width='24' height='30' viewBox='0 0 30 30'>
                <path d='M8.46424943,5.10249711 L8.47461061,5.109 L9.83620065,2.74070849 C9.93811703,1.90940768 9.58503922,1.02787459 8.77638646,0.0961091845 C8.76330143,0.081043992 8.75886764,0.0603157452 8.76464474,0.0412159218 C8.77042185,0.0221160985 8.78560064,0.0073200529 8.80484175,0.00203252033 L8.82023085,6.75015599e-14 L14.2087326,6.75015599e-14 L14.2093133,0.00464576982 C16.4357941,0.110046462 18.2093133,1.97125435 18.2093133,4.25203252 C18.2093133,5.4898374 17.6872459,6.6039489 16.8539126,7.38095239 C18.5287093,8.64982581 19.6088487,10.6489547 19.6088487,12.8980836 C19.6088487,16.6954123 16.5295804,19.7810685 12.7078615,19.8423345 L0.0136106136,19.8432056 L8.46424943,5.10249711 Z'></path>
              </svg>
            </a>
          </li> */}
          <li>
            <a
              title='title'
              href='https://t.me/westarter_chinese'
              target='_blank'
              rel='noopener'
            >
              <svg
                t='1614403990515'
                className='icon'
                viewBox='0 0 1024 1024'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                p-id='529'
                width='18'
                height='24'
              >
                <path
                  d='M1020.416112 161.2512l-154.536 729.312c-10.7952 51.808-42.0432 64.3328-85.2224 40.4208L545.446512 756.7696l-113.0608 109.88c-13.0688 13.0944-23.8624 23.912-47.1568 23.912l15.9088-240.8256L837.472112 255.76c19.3152-17.648-3.9792-26.1888-29.5456-10.816L269.328112 585.9712 36.388912 511.9584c-49.9968-14.2336-50.5664-48.9616 11.3616-74.0128l907.328-350.7072c41.4736-18.7872 81.2448 10.248 65.336 74.0128zM148.048112 72c34.816 0 57.12 14.144 70.992 44.608l-35.632 18.496c-4.896-15.776-14.96-26.384-35.36-26.384-24.208 0-40.256 16.32-40.256 46.24v30.464c0 29.92 16.048 46.24 40.256 46.24 20.4 0 32.096-12.784 37.808-28.288l33.728 19.584c-14.144 28.832-36.72 45.424-71.536 45.424-51.136 0-84.048-32.64-84.048-96.832C64.000112 107.36 96.912112 72 148.048112 72z m148.72 3.264l51.952 89.76 18.224 38.08h0.816v-127.84h38.896V265.12h-45.152l-51.952-89.76-18.224-38.08h-0.816v127.84h-38.896V75.264h45.152z'
                  p-id='530'
                ></path>
              </svg>
            </a>
          </li>
        </ul>
        <div className='banner_pdf'>
          <a href={WeStarterPDF} target='_blank'>
            <span className='pdf-icon'></span>
            <span className='pdf-text'>
              <FormattedMessage id='certik' />
            </span>
          </a>
          {/* <a
          className='down-load'
          download='application/pptx'
          href={WeStarterPDF}
          target='_blank'
        ></a> */}
        </div>

        <div className='banner_related'>
          <div className='banner_related_data'>
            <img src={Icon4} />
            <p>
              <span className='banner_related_data_title'>
                <FormattedMessage id='farm18' />
              </span>
              <span className='banner_related_data_val'>
                ${/*{chainId == 128*/}
                {/*  ? realTimePrice*/}
                {/*  : bscPrice * 1 > 0 ? splitFormat(bscPrice, 3) : '-'}*/}
                {realTimePrice || '-'}
              </span>
            </p>
            {/* href='https://ht.mdex.com/#/swap?outputCurrency=0x910651f81a605a6ef35d05527d24a72fecef8bf0'
          target='_blank' */}

            {chainId == 128 && (
              <a
                className='banner_related_data_buy'
                onClick={() => {
                  dispatch({
                    type: HANDLE_WALLET_MODAL,
                    walletModal: 'buyCoin',
                  })
                }}
              >
                <FormattedMessage id='farm17' />
              </a>
            )}
          </div>
          <div className='banner_related_data'>
            <img src={Icon1} />
            <p>
              <span className='banner_related_data_title'>
                <FormattedMessage id='related_title1' />
              </span>
              <span className='banner_related_data_val'>
                $1,116,682,800
              </span>
            </p>
          </div>
          <div className='banner_related_data'>
            <img src={Icon2} />
            <p>
              <span className='banner_related_data_title'>
                <FormattedMessage id='related_title2' />
              </span>
              <span className='banner_related_data_val'>
                {state.toolData || '-'}
              </span>
            </p>
          </div>
          <div className='banner_related_data'>
            <img src={Icon3} />
            <p>
              <span className='banner_related_data_title'>
                <FormattedMessage id='related_title3' />
              </span>
              <span className='banner_related_data_val'>
                {pools.length + poolsLBP.length}
              </span>
            </p>
          </div>
        </div>
        <div className='banner_address_box'>
          <a className='banner_address'>
            <FormattedMessage id='farm19' /> {WarTokenAddress}
            <CopyToClipboard
              text={WarTokenAddress}
              onCopy={() => {
                message.success('copy success')
              }}
            >
              <svg
                t='1620653809614'
                className='icon'
                viewBox='0 0 1024 1024'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                p-id='1660'
                width='20'
                height='20'
              >
                <path
                  d='M394.666667 106.666667h448a74.666667 74.666667 0 0 1 74.666666 74.666666v448a74.666667 74.666667 0 0 1-74.666666 74.666667H394.666667a74.666667 74.666667 0 0 1-74.666667-74.666667V181.333333a74.666667 74.666667 0 0 1 74.666667-74.666666z m0 64a10.666667 10.666667 0 0 0-10.666667 10.666666v448a10.666667 10.666667 0 0 0 10.666667 10.666667h448a10.666667 10.666667 0 0 0 10.666666-10.666667V181.333333a10.666667 10.666667 0 0 0-10.666666-10.666666H394.666667z m245.333333 597.333333a32 32 0 0 1 64 0v74.666667a74.666667 74.666667 0 0 1-74.666667 74.666666H181.333333a74.666667 74.666667 0 0 1-74.666666-74.666666V394.666667a74.666667 74.666667 0 0 1 74.666666-74.666667h74.666667a32 32 0 0 1 0 64h-74.666667a10.666667 10.666667 0 0 0-10.666666 10.666667v448a10.666667 10.666667 0 0 0 10.666666 10.666666h448a10.666667 10.666667 0 0 0 10.666667-10.666666v-74.666667z'
                  p-id='1661'
                ></path>
              </svg>
            </CopyToClipboard>
          </a>
          <a className='banner_address_metaMask' onClick={addToken}>
            Add WAR to MetaMask<span className='metaMask_logo'></span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Banner)
