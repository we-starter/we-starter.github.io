import React, {useEffect, useState} from 'react'
import cs from "classnames";
import {FormattedMessage} from "react-intl";
import Timer from "react-compound-timer";

export default function Countdown({farmPools, aprPercentage, setHoverFlag, hoverFlag, now, isFinish}) {


    let left_time = 0
    if (farmPools && farmPools.openDate > now) {
        left_time = (farmPools && farmPools.openDate - now) * 1000
    } else if (farmPools && farmPools.dueDate > now) {
        left_time = (farmPools.dueDate - now) * 1000
    }
    return (
        <div className='farm_index_card_content'>
            <p className='apr'>
                {farmPools &&
                farmPools.name === 'WAR POOL (DAO)' &&
                farmPools.openDate > now &&
                '--'}
                {farmPools &&
                farmPools.name === 'WAR POOL (DAO)' &&
                farmPools.openDate < now &&
                (aprPercentage * 1 > 999999.99
                    ? '999999.99%'
                    : aprPercentage + '%')}
                {farmPools &&
                farmPools.name !== 'WAR POOL (DAO)' &&
                aprPercentage + '%'}
                <span className='content_name'>
            {farmPools && farmPools.earnName}
                    {farmPools && farmPools.name === 'WAR POOL (DAO)' && (
                        <span
                            className={cs(
                                `tips ${farmPools && 'tips_' + farmPools.networkId}`
                            )}
                            onMouseOver={() => setHoverFlag(true)}
                            onMouseOut={() => setHoverFlag(false)}
                        >
                <svg
                    t='1622718431544'
                    className='icon'
                    viewBox='0 0 1024 1024'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    p-id='1141'
                    width='16'
                    height='16'
                >
                  <path
                      d='M512 43.885714c258.121143 0 468.114286 209.993143 468.114286 468.114286 0 258.121143-209.993143 468.114286-468.114286 468.114286A468.626286 468.626286 0 0 1 43.885714 512C43.885714 253.878857 253.878857 43.885714 512 43.885714z m0 643.657143a58.514286 58.514286 0 1 0-0.073143 116.955429A58.514286 58.514286 0 0 0 512 687.542857zM512 219.428571c-96.768 0-175.542857 71.460571-175.542857 159.305143 0 25.161143 22.454857 45.494857 50.176 45.494857 27.721143 0 50.102857-20.333714 50.102857-45.494857 0-37.668571 33.792-68.315429 75.264-68.315428s75.264 30.72 75.264 68.315428c0 34.962286-29.110857 63.853714-66.56 67.803429L512 446.902857c-27.794286 0-50.176 20.333714-50.176 45.494857v91.062857c0 25.161143 22.454857 45.494857 50.176 45.494858 27.794286 0 50.176-20.333714 50.176-45.494858v-52.955428C634.368 510.829714 687.542857 450.633143 687.542857 378.733714 687.542857 290.889143 608.768 219.428571 512 219.428571z'
                      p-id='1142'
                  ></path>
                </svg>
                            {hoverFlag && (
                                <i
                                    className={cs(
                                        `tips_content ${
                                            farmPools && 'tips_content_' + farmPools.networkId
                                        }`
                                    )}
                                >
                                    <FormattedMessage id='farm23' />
                                </i>
                            )}
              </span>
                    )}
          </span>
            </p>
            {farmPools && farmPools.openDate && (
                <p className='countdown'>
                    {farmPools && farmPools.openDate > now && !farmPools.dueDate && (
                        <Timer
                            initialTime={left_time}
                            key={left_time}
                            direction='backward'
                            formatValue={(number) => {
                                if (number === 0) return '00'
                                if (number < 10) {
                                    return `0${number}`
                                }
                                return number
                            }}
                        >
                <span>
                  <span
                      className={cs(
                          `countdown_time ${
                              farmPools && 'countdown_time_' + farmPools.networkId
                          }`
                      )}
                  >
                    <Timer.Hours />
                    <b>
                      <FormattedMessage id='HourM' />
                    </b>
                  </span>{' '}
                    <i>/</i>{' '}
                    <span
                        className={cs(
                            `countdown_time ${
                                farmPools && 'countdown_time_' + farmPools.networkId
                            }`
                        )}
                    >
                    {' '}
                        <Timer.Minutes />
                    <b>
                      <FormattedMessage id='MinM' />
                    </b>
                  </span>
                  <i>/</i>{' '}
                    <span
                        className={cs(
                            `countdown_time ${
                                farmPools && 'countdown_time_' + farmPools.networkId
                            }`
                        )}
                    >
                    {' '}
                        <Timer.Seconds />
                    <b>
                      <FormattedMessage id='SecondM' />
                    </b>
                  </span>
                </span>
                        </Timer>
                    )}
                    {farmPools && farmPools.openDate > now && farmPools.dueDate && (
                        <Timer
                            initialTime={left_time}
                            key={left_time}
                            direction='backward'
                            formatValue={(number) => {
                                if (number === 0) return '00'
                                if (number < 10) {
                                    return `0${number}`
                                }
                                return number
                            }}
                        >
                <span>
                  <span
                      className={cs(
                          `countdown_time ${
                              farmPools && 'countdown_time_' + farmPools.networkId
                          }`
                      )}
                  >
                    <Timer.Hours />
                    <b>
                      <FormattedMessage id='HourM' />
                    </b>
                  </span>{' '}
                    <i>/</i>{' '}
                    <span
                        className={cs(
                            `countdown_time ${
                                farmPools && 'countdown_time_' + farmPools.networkId
                            }`
                        )}
                    >
                    {' '}
                        <Timer.Minutes />
                    <b>
                      <FormattedMessage id='MinM' />
                    </b>
                  </span>
                </span>
                        </Timer>
                    )}
                    {farmPools && farmPools.dueDate > now && farmPools.openDate < now && (
                        <Timer
                            initialTime={left_time}
                            key={left_time}
                            direction='backward'
                            formatValue={(number) => {
                                if (number === 0) return '00'
                                if (number < 10) {
                                    return `0${number}`
                                }
                                return number
                            }}
                        >
                <span>
                  <span
                      className={cs(
                          `countdown_time ${
                              farmPools && 'countdown_time_' + farmPools.networkId
                          }`
                      )}
                  >
                    <Timer.Days />
                    <b>
                      <FormattedMessage id='DayM' />
                    </b>
                  </span>{' '}
                    <i>/</i>{' '}
                    <span
                        className={cs(
                            `countdown_time ${
                                farmPools && 'countdown_time_' + farmPools.networkId
                            }`
                        )}
                    >
                    <Timer.Hours />
                    <b>
                      <FormattedMessage id='HourM' />
                    </b>
                  </span>
                </span>
                        </Timer>
                    )}
                    {isFinish && (
                        <span>
                  <FormattedMessage id='completed' />
                </span>
                    )}
                    {farmPools && !farmPools.dueDate && farmPools.openDate <= now && (
                        <span>
                <FormattedMessage id='farm14' />
              </span>
                    )}

                    {/* {farmPools && typeof farmPools.openDate == 'object' ? (
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0 6px',
                    background: '#C5E5C9',
                    borderRadius: '3px',
                  }}
                >
                  {farmPools.openDate.hour}
                  <b>
                    <FormattedMessage id='HourM' />
                  </b>
                </span>{' '}
                <i>/</i>{' '}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0 6px',
                    background: '#C5E5C9',
                    borderRadius: '3px',
                  }}
                >
                  {' '}
                  {farmPools.openDate.minute}
                  <b>
                    <FormattedMessage id='MinM' />
                  </b>
                </span>
              </span>
            ) : typeof farmPools.dueDate == 'object' ? (
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0 6px',
                    background: '#C5E5C9',
                    borderRadius: '3px',
                  }}
                >
                  {farmPools.dueDate.day}
                  <b>
                    <FormattedMessage id='DayM' />
                  </b>
                </span>{' '}
                <i style={{ color: '#7a7f82' }}>/</i>{' '}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0 6px',
                    background: '#C5E5C9',
                    borderRadius: '3px',
                  }}
                >
                  {farmPools.dueDate.hour}
                  <b>
                    <FormattedMessage id='HourM' />
                  </b>
                </span>
              </span>
            ) : (
              <span>{farmPools.dueDate}</span>
            )} */}
                    <span className='content_name'>
              <FormattedMessage id='farm8' />
            </span>
                </p>
            )}
            {farmPools && !farmPools.openDate && left_time <= 0 && (
                <p className='countdown'>
            <span>
              {' '}
                <FormattedMessage id='farm14' />
            </span>
                    <span className='content_name'>
              <FormattedMessage id='farm8' />
            </span>
                </p>
            )}
        </div>
    )
}