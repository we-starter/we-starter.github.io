import React from 'react';
import { CrossModalIcon } from '../../icons';
import { FormattedMessage } from 'react-intl';

export const ProposeFigureModal = ({
    setIsOpen,
    onNameChange,
    onDetailChange,
    onSubmit,
}) => {
    return (
        <div className='modal'>
            <div className='modal__box'>
                <div className='modal__item modal__item--vote-new'>
                    <form
                        className='form-vote-new form-app'
                        action='/'
                        noValidate='novalidate'>
                        <h3 className='modal__title h3'>
                            <FormattedMessage id='modalsText24' />
                        </h3>

                        <div className='form-vote-new__fieldset'>
                            <input
                                className='input'
                                placeholder='Name'
                                onChange={(e) => {
                                    onNameChange(e.target.value);
                                }}
                            />

                            <textarea
                                className='input'
                                placeholder='Details'
                                onChange={(e) => {
                                    onDetailChange(e.target.value);
                                }}
                            />

                            <small className='form-vote-new__max-length'>
                                <FormattedMessage id='modalsText25' />
                            </small>

                            <p className='form-vote-new__info'>
                                <svg width='21' height='21' viewBox='0 0 21 21'>
                                    <path d='M10.5 19.25a8.75 8.75 0 110-17.5 8.75 8.75 0 010 17.5zm-.88-6.13v1.76h1.76v-1.76H9.62zm0-7v5.25h1.76V6.13H9.62z' />
                                </svg>

                                <FormattedMessage id='modalsText26' />
                            </p>
                        </div>

                        <hr />

                        <p className='form-app__note'>
                            <FormattedMessage id='modalsText27' />
                            <br />
                            <FormattedMessage id='modalsText28' />
                        </p>

                        <div className='form-app__submit'>
                            <button
                                type='button'
                                className='btn btn--medium'
                                onClick={onSubmit}>
                                <FormattedMessage id='modalsText29' />
                            </button>
                        </div>
                    </form>
                </div>

                <button
                    type='button'
                    className='modal__close modal__close-btn button'
                    aria-label='Close modal'
                    onClick={() => setIsOpen(false)}>
                    <CrossModalIcon />
                </button>
            </div>
        </div>
    );
};
