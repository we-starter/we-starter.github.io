import React, { useMemo, useEffect, useState, useContext } from 'react'
import cs from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import { getIPFSFile } from '../../utils/ipfs'
import { getContract, useActiveWeb3React } from '../../web3'
import { formatAmount } from '../../utils/format'
import { useBlockHeight } from './Hooks'
import { message } from 'antd'
import { voteMain } from '../../web3/address'
import BreadCrumbs from '../../components/application/BreadCrumbs'
import ApplicationCountdown from '../../components/application/ApplicationCountdown'
import ApplicationClaimPopup from '../../components/application/claimPopup'
import VotePopup from '../../components/application/votePopup'
import CannotVotePopup from '../../components/application/cannotVotePopup'

const Vote = (props) => {
  const { account, active, library, chainId } = useActiveWeb3React()
  const { blockHeight } = useBlockHeight()
  const [voteDetail, setVoteDetail] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isVoteModalVisible, setIsVoteModalVisible] = useState(false)
  const [isCannotVoteModalVisible, setIsCannotVoteModalVisible] = useState(false)
  const [usersData, setUsersData] = useState({})

  useEffect(() => {
    props.location.state.detailData &&
      setVoteDetail(props.location.state.detailData)
  }, [props.location.state.detailData, active, blockHeight])

  const getUsers = () => {
    if (!active) {
      return false
    }
    const pool_contract = getContract(library, voteMain.abi, voteMain.address)
    pool_contract.methods
      .users(voteDetail.ProjectId, account)
      .call()
      .then((res) => {
        setUsersData(res)
      })
      .catch((err) => {
        console.log('error', err)
      })
  }

  useEffect(() => {
    if (voteDetail && voteDetail.ProjectId) {
      getUsers()
    }
  }, [voteDetail, blockHeight, active])

  const setDisableBtn = () => {
    if (voteDetail && voteDetail.status === 1) {
      setIsVoteModalVisible(true)
    }
  }

  const setDisableClaimBtn = () => {
    if (voteDetail && voteDetail.status === 2 && voteDetail.isClaim) {
      setIsModalVisible(true)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className='vote'>
        <div className='vote_box'>
          <BreadCrumbs toUrl='/application' name='applicationText15' />
          <h2 className='vote_title'>
            <FormattedMessage id='applicationText8' />
          </h2>
          <div className='vote_box_card'>
            <div className='vote_box_card_title'>
              <i>ID:{voteDetail && voteDetail.id}</i>
              <p className='vote_countdown_ongoing'>
                {voteDetail && voteDetail.status === 2
                  ? '已结束'
                  : voteDetail && voteDetail.status === 1
                  ? '进行中'
                  : '即将开始'}
                {/* <FormattedMessage id='applicationText10' /> */}
              </p>
            </div>
            <div className='vote_box_card_content'>
              <div className='vote_box_card_content_box'>
                <img src={getIPFSFile(voteDetail && voteDetail.logo)} />
                <p className='vote_box_card_content_title'>
                  {voteDetail && voteDetail.name}
                  <span>{voteDetail && voteDetail.website}</span>
                </p>
              </div>
              <ul className='link_url'>
                <li>
                  <a
                    title='title'
                    href={voteDetail && voteDetail.twitter}
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
                    href='https://github.com/we-starter'
                    target='_blank'
                    rel='noopener'
                  >
                    <svg width='24' height='24' viewBox='0 0 28 28'>
                      <path d='M11.23823,22 C10.2198086,22.0035115 9.39035095,21.1913055 9.38327418,20.1836134 L9.37592774,18.8836151 C5.73031802,19.6681552 4.9613148,17.3536168 4.9613148,17.3536168 C4.36503551,15.8554314 3.50599711,15.4572398 3.50599711,15.4572398 C2.31715301,14.6517906 3.59605293,14.6681462 3.59605293,14.6681462 C4.91077706,14.7590518 5.60352999,16.0045108 5.60352999,16.0045108 C6.77217138,17.9863415 8.66941055,17.413608 9.4163538,17.0826971 C9.53395878,16.2445161 9.87389679,15.6727015 10.248751,15.3481613 C7.33813628,15.0208851 4.27867355,13.9081498 4.27867355,8.94087246 C4.27867355,7.52542498 4.79042749,6.36905421 5.62924254,5.46087681 C5.49327146,5.13360052 5.04491153,3.81542932 5.75603057,2.02996851 C5.75603057,2.02996851 6.85669673,1.68178313 9.36030623,3.35904347 C10.4294195,3.07122821 11.5322908,2.92450592 12.6402654,2.9226887 C13.7528592,2.92724215 14.8746567,3.07086964 15.9220405,3.35904347 C18.4238134,1.68180355 19.522643,2.02996851 19.522643,2.02996851 C20.2355986,3.81632775 19.7872387,5.13451937 19.6512676,5.46087681 C20.4910113,6.36815577 21,7.52542498 21,8.94089288 C21,13.9208912 17.9340988,15.0172505 15.0170662,15.338156 C15.4865575,15.7408806 15.905511,16.5290554 15.905511,17.7390669 C15.905511,19.4745215 15.8990726,20.1826945 15.8990726,20.1826945 C15.8920104,21.1898283 15.0638146,22.0020132 14.0459533,22 L11.2382094,22 L11.23823,22 Z'></path>
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    title='title'
                    href={voteDetail && voteDetail.telegram}
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
                    href='https://medium.com/@westarter'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <svg width='24' height='24' viewBox='0 0 30 30'>
                      <path d='M5 3.75h20A1.25 1.25 0 0126.25 5v20A1.25 1.25 0 0125 26.25H5A1.25 1.25 0 013.75 25V5A1.25 1.25 0 015 3.75zm16.63 16.18c-.13-.07-.2-.25-.2-.38V10c0-.13.07-.31.2-.44l1.19-1.38v-.06h-4.27l-3.2 8.1-3.64-8.1H7.3v.06l1.13 1.57c.26.25.32.63.32.94v6.9c.06.38 0 .82-.19 1.2l-1.7 2.32v.06h4.52v-.06L9.7 18.86a1.93 1.93 0 01-.19-1.2V11.4c.06.12.13.12.19.37l4.27 9.54h.06l4.15-10.35c-.07.38-.07.82-.07 1.13v7.4c0 .2-.06.32-.18.45l-1.26 1.19v.06h6.15v-.06l-1.2-1.2z' />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='vote_box_progress'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <ApplicationCountdown
                left_time={voteDetail && voteDetail.left_time}
                status={voteDetail && voteDetail.status}
              />
              <p className='vote_box_progress_content_btn'>
                <a
                  onClick={() => setDisableBtn()}
                  className={cs(
                    voteDetail &&
                      (voteDetail.status === 2 || voteDetail.status === 0) &&
                      'disable_failed'
                  )}
                >
                  <FormattedMessage id='applicationText8' />
                </a>
              </p>
            </div>
            <div className='vote_box_progress_content'>
              <p className='vote_box_progress_content_title vote_box_progress_content_progress'>
                <FormattedMessage id='poolsIndexText2' />
                <a>
                  <span
                    style={{
                      width: `${
                        (voteDetail &&
                          voteDetail.progressData &&
                          (voteDetail.progressData > 1
                            ? 100
                            : voteDetail.progressData * 100)) ||
                        0
                      }%`,
                    }}
                  ></span>
                </a>
              </p>
              <p className='vote_box_progress_content_title'>
                <FormattedMessage id='applicationText16' />
                <span>
                  {(usersData &&
                    usersData.totalVote &&
                    formatAmount(usersData.totalVote)) ||
                    '0'}{' '}
                  WAR
                </span>
              </p>
              <p className='vote_box_progress_content_title'>
                <FormattedMessage id='applicationText17' />
                <span>
                  {voteDetail && voteDetail.isClaim
                    ? formatAmount(usersData.totalVote)
                    : '0'}{' '}
                  WAR
                </span>
              </p>
              <p className='vote_box_progress_content_btn'>
                <a
                  className={cs(
                    'vote_btn',
                    voteDetail &&
                      voteDetail.status !== 2 &&
                      !voteDetail.isClaim &&
                      'disable_failed'
                  )}
                  onClick={() => setDisableClaimBtn()}
                >
                  <FormattedMessage id='claim' />
                </a>
              </p>
            </div>
          </div>
          <div className='vote_box_progress_h5'>
            <ApplicationCountdown
              left_time={voteDetail && voteDetail.left_time}
              status={voteDetail && voteDetail.status}
            />
            <div className='vote_box_progress_content'>
              <p className='vote_box_progress_content_title vote_box_progress_content_progress'>
                <FormattedMessage id='poolsIndexText2' />
                <a>
                  <span
                    style={{
                      width: `${
                        (voteDetail &&
                          voteDetail.progressData &&
                          (voteDetail.progressData > 1
                            ? 100
                            : voteDetail.progressData * 100)) ||
                        0
                      }%`,
                    }}
                  ></span>
                </a>
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '42px',
                }}
              >
                <p className='vote_box_progress_content_title'>
                  <FormattedMessage id='applicationText16' />
                  <span>
                    {(usersData &&
                      usersData.totalVote &&
                      formatAmount(usersData.totalVote)) ||
                      '0'}{' '}
                    WAR
                  </span>
                </p>
                <p className='vote_box_progress_content_title'>
                  <FormattedMessage id='applicationText17' />
                  <span>
                    {voteDetail && voteDetail.isClaim
                      ? formatAmount(usersData.totalVote)
                      : '0'}{' '}
                    WAR
                  </span>
                </p>
              </div>

              <p className={cs('vote_box_progress_content_btn')}>
                <a
                  className={cs(
                    voteDetail &&
                      (voteDetail.status === 2 || voteDetail.status === 0) &&
                      'disable_failed'
                  )}
                  onClick={() => setDisableBtn()}
                >
                  <FormattedMessage id='applicationText8' />
                </a>
                <a
                  className={cs(
                    voteDetail &&
                      voteDetail.status !== 2 &&
                      !voteDetail.isClaim &&
                      'disable_failed'
                  )}
                  onClick={() => setDisableClaimBtn()}
                >
                  <FormattedMessage id='claim' />
                </a>
              </p>
            </div>
          </div>
          <div className='vote_box_information'>
            <h3 className='vote_box_information_title'>
              <FormattedMessage id='applicationText12' />
            </h3>
            <p className='vote_box_information_about'>
              <FormattedMessage id='applicationText13' />
            </p>
            <div className='vote_box_information_url'>
              <p>
                Website: <span>{voteDetail && voteDetail.website}</span>
              </p>
              <p>
                Whitepaper: <span>{voteDetail && voteDetail.whitePaper}</span>
              </p>
              <p>
                Telegram: <span>{voteDetail && voteDetail.telegram}</span>
              </p>
              {/* <p>
                Explorer: <span>https://Explorer</span>
              </p> */}
            </div>
            <p className='vote_box_information_about'>
              <FormattedMessage id='applicationText14' />
            </p>
            <div className='vote_box_information_info'>
              <p>
                <span>{voteDetail && voteDetail.descEN}</span>
              </p>
              <p>
                <span>{voteDetail && voteDetail.descZH}</span>
              </p>
            </div>
          </div>
        </div>
        <ApplicationClaimPopup
          visible={isModalVisible}
          voteDate={voteDetail}
          usersData={usersData}
          onClose={() => setIsModalVisible(false)}
          getUser={getUsers}
        />
        <VotePopup
          propID={voteDetail && voteDetail.ProjectId}
          visible={isVoteModalVisible}
          onClose={() => setIsVoteModalVisible(false)}
          getUser={getUsers}
        />
        <CannotVotePopup
          pool={null}
          visible={isCannotVoteModalVisible}
          onClose={() => setIsCannotVoteModalVisible(false)}
        />
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default injectIntl(Vote)
