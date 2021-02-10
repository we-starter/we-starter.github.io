import React, { useState } from 'react'
import { usage } from 'browserslist'
import { formatAmount } from '../../utils/format'
import { GLFIcon } from '../../icons'
import { Select } from 'antd'

const { Option } = Select

export const PoolsJoin = ({
  amount,
  onChange,
  onMax,
  icon,
  balance,
  onClose,
  onConfirm,
  symbol,
}) => {
  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner deposit'>
            <h1
              className='form-app__title h3'
              style={{ marginTop: 0, marginBottom: '20px' }}
            >
              Join XXX Pool
            </h1>
            <p className='form-app__tip'>1HT = 143.22 WAR</p>
            <Select
              defaultValue='lucy'
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value='jack'>
                {/* <GLFIcon width={24} height={24} />
                {icon} */}
                Jack
              </Option>
              <Option value='lucy'>Lucy</Option>
              <Option value='Yiminghe'>yiminghe</Option>
            </Select>
            <p
              className='form-app__inputbox-after-text'
              style={{
                marginBottom: 0,
                color: '#22292F',
                textAlign: 'left',
                opacity: 1,
              }}
            >
              Balance:{' '}
              {balance && symbol && `${formatAmount(balance)} ${symbol}`} <br />
            </p>
            <div className='deposit__inputbox form-app__inputbox'>
              <div className='form-app__inputbox-control'>
                <div className='form-app__inputbox-input'>
                  <input
                    value={amount}
                    onChange={onChange}
                    className='input'
                    placeholder='输入投资金额'
                  />
                </div>

                <div className='form-app__inputbox-up' onClick={onMax}>
                  <div className='form-app__inputbox-up-pref'>Max</div>
                </div>
              </div>
            </div>

            <div className='form-app__submit form-app__submit--row'>
              <button
                className='btn btn--outline btn--medium'
                type='button'
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type='button'
                className='btn btn--medium'
                onClick={onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
