import React, { useContext } from 'react'
import { IntlProvider } from 'react-intl'
import { mainContext } from '../reducer'
import zh_CN from './cn'
import en_US from './en'

const Inter = (props) => {
  const { state } = useContext(mainContext)

  const chooseLocale = (val) => {
    let _val = val || navigator.language.split('_')[0]
    switch (_val) {
      case 'en':
        return en_US
      case 'zh':
        return zh_CN
      default:
        return en_US
    }
  }
  let { children } = props
  let locale = state.locale

  return (
    <IntlProvider
      key={locale}
      locale={locale}
      defaultLocale='zh'
      messages={chooseLocale(locale)}
    >
      {children}
    </IntlProvider>
  )
}

export default Inter
