import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { GalleryModal, VoteModal } from '../Modals';

import bigImg from '../../assets/img/32311603723640_.pic_hd.jpg';

import { useGLFBalance } from '../../pages/Hooks';
import { formatAmount } from '../../utils/format';

export const VoteCard = ({ setIsOpen, figure }) => {
    const { glfBalance } = useGLFBalance();
    console.log('vate card', figure);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [voting, setVoting] = useState(false);

    return (
        <>
            <div className='artwork-list__item'>
                <a
                    onClick={() => setGalleryOpen(true)}
                    className='artwork-list__img modal-gallery'>
                    <picture>
                        <img
                            src={figure.info.image}
                            alt='Starry Night'
                            loading='lazy'
                            width='264'
                            height='170'
                        />
                    </picture>
                </a>

                <h2 className='artwork-list__title h3'>{figure.info.title}</h2>

                <p className='artwork-list__author'>
                    <FormattedMessage id='workShopText3' /> {figure.info.name}
                </p>

                <div className='artwork-list__hashtag'>
                    <a href='/'>
                        <FormattedMessage id='workShopText4' />
                    </a>
                </div>

                <button
                    type='button'
                    className='artwork-list__btn btn'
                    onClick={() => setVoting(true)}>
                    <FormattedMessage id='workShopText5' />
                </button>

                <p className='artwork-list__desc'>{figure.info.description}</p>

                <hr />

                <div className='artwork-list__votes'>
                    {formatAmount(figure.votes)}
                    <FormattedMessage id='workShopText6' />
                </div>
            </div>

            {voting && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <VoteModal
                            figure={figure}
                            setIsOpen={setVoting}
                            onImgClick={setGalleryOpen}
                        />
                    </div>
                </div>
            )}

            {galleryOpen && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <GalleryModal
                            imgBig={figure.info.image}
                            setIsOpen={setGalleryOpen}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
