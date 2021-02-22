import React from 'react'
import Slider from 'react-slick'
import { FormattedMessage } from 'react-intl'

import { PrevArrowIcon, NextArrowIcon } from '../../icons'
//import "slick-carousel/slick/slick.css";
const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  prevArrow: (
    <div>
      <PrevArrowIcon />
    </div>
  ),
  nextArrow: (
    <div>
      <NextArrowIcon />
    </div>
  ),
  responsive: [
    {
      breakpoint: 747,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
}

export const ExhibitionHallSlider = () => {
  return (
    <div className='exhibition-hall-slider'>
      <Slider {...settings}>
        <div className='exhibition-hall-slider__item'>
          <h4 className='item__title gold-color h4'>
            <FormattedMessage id='exhibitionHallText1' />
          </h4>
          <p className='item__date'>20/12/20</p>
          <p className='item__subtitle'>
            <FormattedMessage id='exhibitionHallText2' />
            ...
          </p>
        </div>
        <div className='exhibition-hall-slider__item'>
          <h4 className='item__title gold-color h4'>
            <FormattedMessage id='exhibitionHallText3' />
          </h4>
          <p className='item__date'>19/12/20</p>
          <p className='item__subtitle'>
            <FormattedMessage id='exhibitionHallText4' />
            ...
          </p>
        </div>
        <div className='exhibition-hall-slider__item'>
          <h4 className='item__title gold-color h4'>
            <FormattedMessage id='exhibitionHallText5' />
          </h4>
          <p className='item__date'>18/12/20</p>
          <p className='item__subtitle'>
            <FormattedMessage id='exhibitionHallText6' />
            ...
          </p>
        </div>
        <div className='exhibition-hall-slider__item'>
          <h4 className='item__title gold-color h4'>
            <FormattedMessage id='exhibitionHallText5' />
          </h4>
          <p className='item__date'>18/12/20</p>
          <p className='item__subtitle'>
            <FormattedMessage id='exhibitionHallText6' />
            ...
          </p>
        </div>
      </Slider>
    </div>
  )
}
