import React, { useContext } from 'react';
import Lottie from 'react-lottie';
import loading from '../../assets/loading.json';
import { FormattedMessage } from 'react-intl';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

export const ConnectWalletModal = () => {
    return (
        <div className='modal'>
            <div className='modal__box'>
                <div className='form-app'>
                    <div className='form-app__inner transction-submitted'>
                        <div className='transction-submitted__loading'>
                            <Lottie
                                width={200}
                                height={200}
                                options={defaultOptions}
                            />
                        </div>
                        <h3 className='form-app__title h3'>
                            <FormattedMessage id='modalsText16' />
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};
