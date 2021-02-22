import React, { useState } from 'react'
import { Grow } from '@material-ui/core'

import { GalleryModal, PurchasedDetailsModal } from '../Modals'
import { FormattedMessage } from 'react-intl'
import { formatAmount } from '../../utils/format'

export const PurchasedCard = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)

  return (
    <>
      <Grow in={true} timeout={1500}>
        <div className='auction-list__item'>
          <a onClick={() => setGalleryOpen(true)} className='item__img'>
            <picture>
              <img
                src={item.image}
                alt={item.image}
                loading='lazy'
                width='264'
                height='170'
              />
            </picture>
          </a>
          <h2 className='item__title h3'>{item.title}</h2>
          <button
            type='button'
            className='artwork-list__btn btn btn--gray'
            onClick={() => setIsOpen(true)}
          >
            <FormattedMessage id='auctionText1' />
            {new Date(item.closeAt * 1000).toLocaleDateString()}
          </button>
          <p className='artwork-list__token-id'>
            <FormattedMessage id='accountText5' />: {item.tokenId}
          </p>
          <hr className='item__line' />
          <div className='item-purchased__price'>
            {formatAmount(item.currentPrice)}{' '}
            <FormattedMessage id='auctionText2' />
          </div>
        </div>
      </Grow>

      {galleryOpen && (
        <div className='modal-show'>
          <div className='wrapper'>
            <GalleryModal imgBig={item.image} setIsOpen={setGalleryOpen} />
          </div>
        </div>
      )}

      {isOpen && (
        <div className='modal-show'>
          <div className='wrapper'>
            <PurchasedDetailsModal item={item} setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </>
  )
}
