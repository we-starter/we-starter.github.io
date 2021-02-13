import React, { useState } from 'react'
import { formatAmount } from '../../utils/format'
import cs from 'classnames'
import { GLFIcon } from '../../icons'
import { Select, Avatar } from 'antd'

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
  const [defaultVal, setDefaultVal] = useState('HT')
  const handleChange = (value) => {
    console.log(`selected ${value}`)
    setDefaultVal(value)
  }
  const items = ['HT', 'WAR']
  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner deposit'>
            <h1
              className='form-app__title h3'
              style={{ marginTop: 0, marginBottom: '10px' }}
            >
              Join XXX Pool
            </h1>
            <p className='form-app__tip'>1HT = 143.22 WAR</p>
            <Select
              suffixIcon={icon}
              defaultValue='HT'
              onChange={handleChange}
              style={{ width: '112px' }}
              aria-expanded='true'
            >
              {items.map((item) => (
                <Select.Option
                  key={item}
                  value={item}
                  className={cs(
                    'option_hover_style',
                    defaultVal === item && 'active'
                  )}
                  label={item}
                >
                  <div>
                    <Avatar size='small' icon={icon}>
                      <GLFIcon width={24} height={24} />
                      {icon}
                    </Avatar>{' '}
                    {item}
                  </div>
                </Select.Option>
              ))}
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
