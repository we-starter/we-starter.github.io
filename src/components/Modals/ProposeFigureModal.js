import React from "react";
import {CrossModalIcon} from "../../icons";

export const ProposeFigureModal = ({ setIsOpen, onNameChange, onDetailChange, onSubmit }) => {
    return (
        <div className="modal">
            <div className="modal__box">
                <div className="modal__item modal__item--vote-new">
                    <form
                        className="form-vote-new form-app"
                        action="/"
                        noValidate="novalidate"
                    >
                        <h3 className="modal__title h3">Propose a New Figure</h3>

                        <div className="form-vote-new__fieldset">
                            <input className="input" placeholder="Name" onChange={(e)=>{
                                onNameChange(e.target.value)
                            }}/>

                            <textarea
                                className="input"
                                placeholder="Details"
                                onChange={(e)=>{
                                    onDetailChange(e.target.value)
                                }}
                            />

                            <small className="form-vote-new__max-length">
                                Note: no more than 200 caharcters
                            </small>

                            <p className="form-vote-new__info">
                                <svg width="21" height="21" viewBox="0 0 21 21">
                                    <path d="M10.5 19.25a8.75 8.75 0 110-17.5 8.75 8.75 0 010 17.5zm-.88-6.13v1.76h1.76v-1.76H9.62zm0-7v5.25h1.76V6.13H9.62z" />
                                </svg>
                                Please describe the person and attach his linkedin
                                or&nbsp;social media links where artists can find
                                photos.
                            </p>
                        </div>

                        <hr />

                        <p className="form-app__note">
                            You need to stake <b>50 GLF tokens</b> to propose
                            a&nbsp;figure and tokens will be staked for 4 days.{" "}
                            <br />
                            You can propose more than one figure
                        </p>

                        <div className="form-app__submit">
                            <button type="button" className="btn btn--medium" onClick={onSubmit}>Submit</button>
                        </div>
                    </form>
                </div>

                <button
                    type="button"
                    className="modal__close modal__close-btn button"
                    aria-label="Close modal"
                    onClick={()=> setIsOpen(false)}
                >
                    <CrossModalIcon />
                </button>
            </div>
        </div>
    );
};
