import React, { useEffect, useState } from 'react'
import cs from 'classnames'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

export default function BreadCrumbs({ name, toUrl }) {
  return (
    <NavLink to={toUrl} className='bread_crumbs'>
      <img src={require('../../assets/icon/application/back@2x.png')} />
      <span>{name}</span>
    </NavLink>
  )
}