import React from 'react'
import {BackButton} from "../../components/BackButton";

export const StakingSuccess = ()=>{
    return (
        <article className="center">

            <BackButton toPools />

            <form className="form-app" action="/">

                <div className="form-app__inner transction-submitted">

                    <div className="transction-submitted__logo">

                        <svg width="60" height="60" viewBox="0 0 60 60">
                            <path
                                d="M32.92 19.15l-1.02-1.03V49.4h-3.8V18.12l-1.02 1.03-12.99 12.98-2.69-2.69L30 10.84l18.6 18.6-2.69 2.7-12.99-13z"
                                stroke="#FCE7B4" stroke-width="1.2"/>
                        </svg>

                    </div>

                    <div className="form-app__title h3">

                        <p className="color-gray">
                            You have successfully staked
                        </p>

                        100.222345 GLF

                    </div>

                    <button className="transction-submitted__btn btn">
                        Ok
                    </button>

                    <button type="button" className="form-app__close-btn button" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path
                                d="M14.5 10l7.39-7L24 5l-7.39 7L24 19l-2.11 2-7.39-7-7.39 7L5 19l7.39-7L5 5l2.11-2 7.39 7z"/>
                        </svg>
                    </button>

                </div>

            </form>

        </article>
    )
}