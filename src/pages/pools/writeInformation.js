import React, { useState } from 'react'
import { Form, Input, Button, Slider, Upload, message } from 'antd'
import Container from '../../assets/icon/container2@2x.png'
import PoolsTextHeader from '../../components/staterPools/poolsTextHeader'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const validateMessages = {
  required: '请输入内容，该内容不能为空！',
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

const WriteInformation = () => {
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
          <p className='write-information_title'>募集申请资料</p>
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
                项目名<span>*</span>
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
                您在项目中的职位/角色<span>*</span>
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
                邮箱<span>*</span>
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
              <p>您的TelegramID</p>
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
                您想什么时间开启认购<span>*</span>
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
              <p>您希望筹集多少资金</p>
              <Form.Item name='slider'>
                <Slider onChange={(value) => setSliderVal(value)} />
              </Form.Item>
              <i>Selected Value: {sliderVal} </i>
            </Form.Item>
            <Form.Item>
              <p>您理想的募集币种</p>
              <Form.Item name='coin' noStyle>
                <Input placeholder='HT、USDT、WAR、ETH、BTC' />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <p>您设定的认购比例</p>
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
                项目说明<span>*</span>
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
                <Input.TextArea placeholder='简介、网址、官方账号URL' />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <p>项目的代币经济模型</p>
              <Form.Item name='model' noStyle>
                <Input.TextArea placeholder='投融资进度、代币分配与分发情况、代币使用场景概述' />
              </Form.Item>
            </Form.Item>
            <Form.Item style={{ marginBottom: '60px' }}>
              <p>您想与我们分享的其他文件</p>
              <Form.Item name='upload'>
                <Dragger {...props}>
                  <p className='ant-upload-drag-icon'>
                    <img src={Container} />
                  </p>
                  <p className='ant-upload-text'>点击或将文件拖拽到这里上传</p>
                  <p className='ant-upload-hint'>
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                  </p>
                </Dragger>
              </Form.Item>
              <i className='tip'>
                提示：参与募集的项目需提交相关的安全证明资料（如代码审计、合规性证明等，可在“其他资料”栏添加）
              </i>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type='primary' htmlType='submit'>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
export default WriteInformation
