import React from "react";
import Slider from "react-slick";

import { PrevArrowIcon, NextArrowIcon } from "../../icons";
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
                slidesToShow: 1
            }
        }
    ]
};

export const ExhibitionHallSlider = () => {
    return (
        <div className="exhibition-hall-slider">
            <Slider {...settings}>
                <div className="exhibition-hall-slider__item">
                    <h4 className="item__title gold-color h4">Become a sponsor</h4>
                    <p className="item__date">20/12/20</p>
                    <p className="item__subtitle">
                        You can sponsor an artist to publish his artwork here on
                        Exhibition hall ...
                    </p>
                </div>
                <div className="exhibition-hall-slider__item">
                    <h4 className="item__title gold-color h4">Join a Contest</h4>
                    <p className="item__date">19/12/20</p>
                    <p className="item__subtitle">
                        Independent digital art gallery 'Aadvark' statrs a new
                        digital artwork contest ...
                    </p>
                </div>
                <div className="exhibition-hall-slider__item">
                    <h4 className="item__title gold-color h4">NFT for free!</h4>
                    <p className="item__date">18/12/20</p>
                    <p className="item__subtitle">
                        Publish your artwork this weekend and get NFT token for it -
                        for free! ...
                    </p>
                </div>
                <div className="exhibition-hall-slider__item">
                    <h4 className="item__title gold-color h4">NFT for free!</h4>
                    <p className="item__date">18/12/20</p>
                    <p className="item__subtitle">
                        Publish your artwork this weekend and get NFT token for it -
                        for free! ...
                    </p>
                </div>
            </Slider>
        </div>
    );
};
