import React, { useState } from 'react'
import { Form, Input, Button, Slider, Upload, message } from 'antd'
import Container from '../../assets/icon/container2@2x.png'
import { FormattedMessage, injectIntl } from 'react-intl'
import PoolsTextHeader from '../../components/staterPools/poolsTextHeader'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const { Dragger } = Upload

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

const WriteInformation = (props) => {
  const { intl } = props
  const validateMessages = {
    required: intl.formatMessage({ id: 'errorTip' }),
  }
  const onFinish = (values) => {
    console.log(values, 111)
  }
  const [sliderVal, setSliderVal] = useState(0)
  const changeSliderVal = (e) => {
    setSliderVal(e.target.value)
  }
  return (
    <div>
      <PoolsTextHeader styleVal='#F2F0EB' />
      <div className='write-information'>
        <div className='write-information_box'>
          <p className='write-information_title'>
            <FormattedMessage id='recruitMaterials' />
          </p>
          <Form
            {...layout}
            name='nest-messages'
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <p>
                <FormattedMessage id='projectTitle' />
                <span>*</span>
              </p>
              <Form.Item
                noStyle
                name='projectName'
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <p>
                <FormattedMessage id='role' />
                <span>*</span>
              </p>
              <Form.Item
                name='user'
                rules={[
                  {
                    required: true,
                  },
                ]}
                noStyle
              >
                <Input />
              </Form.Item>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <p>
                <FormattedMessage id='email' />
                <span>*</span>
              </p>
              <Form.Item
                name='email'
                noStyle
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <p>
                <FormattedMessage id='telegramID' />
              </p>
              <Form.Item name='telegramID' noStyle>
                <Input placeholder='@yourid' />
              </Form.Item>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <p>
                <FormattedMessage id='openSubscription' />
                <span>*</span>
              </p>
              <Form.Item
                name='buy'
                noStyle
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <p>
                <FormattedMessage id='raiseMoney' />
              </p>
              <Form.Item name='slider'>
                <Slider onChange={(value) => setSliderVal(value)} />
              </Form.Item>
              <i>Selected Value: {sliderVal} </i>
            </Form.Item>
            <Form.Item>
              <p>
                <FormattedMessage id='raiseCoin' />
              </p>
              <Form.Item name='coin' noStyle>
                <Input placeholder='HT、USDT、WAR、ETH、BTC' />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <p>
                <FormattedMessage id='subscriptionRatio' />
              </p>
              <Form.Item name='scale' noStyle>
                <Input />
              </Form.Item>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <p>
                <FormattedMessage id='projectInstruction' />
                <span>*</span>
              </p>
              <Form.Item
                name='project'
                noStyle
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea
                  placeholder={intl.formatMessage({ id: 'introduction' })}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <p>
                <FormattedMessage id='projectModel' />
              </p>
              <Form.Item name='model' noStyle>
                <Input.TextArea
                  placeholder={intl.formatMessage({ id: 'modelTip' })}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item style={{ marginBottom: '60px' }}>
              <p>
                <FormattedMessage id='shareFile' />
              </p>
              <Form.Item name='upload'>
                <Dragger {...props}>
                  <p className='ant-upload-drag-icon'>
                    <img src={Container} />
                  </p>
                  <p className='ant-upload-text'>
                    <FormattedMessage id='uploadFile' />
                  </p>
                  <p className='ant-upload-hint'>
                    <FormattedMessage id='support' />
                    .rar .zip .doc .docx .pdf .jpg...
                  </p>
                </Dragger>
              </Form.Item>
              <i className='tip'>
                <FormattedMessage id='tip' />
              </i>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type='primary' htmlType='submit'>
                <FormattedMessage id='submit' />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default injectIntl(WriteInformation)
