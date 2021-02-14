import React, { useEffect, useState } from 'react'
import { Header } from '../../components/header/Header'
import { PoolTab } from '../../components/pooltab/PoolTab'
import { withRouter } from 'react-router'

const ExtractComponents = (props) => {
  const [showComponents, setShowComponents] = useState(true)
  useEffect(() => {
    if (
      props.history.location.pathname === '/pools' ||
      props.history.location.pathname.indexOf('/pools/detail') > -1 ||
      props.history.location.pathname === '/information'
    ) {
      setShowComponents(false)
    } else {
      setShowComponents(true)
    }
  })
  return (
    <div>
      {showComponents && <Header />}
      {showComponents && <PoolTab />}
    </div>
  )
}

export default withRouter(ExtractComponents)
