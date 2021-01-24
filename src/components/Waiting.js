import React from 'react'

export const Waiting = ()=>{
    return (
        <article className="center">

            <div className="form-app">

                <div className="form-app__inner transction-submitted">

                    <div className="transction-submitted__loading">

                        <svg width="80" height="80" viewBox="0 0 80 80">
                            <path
                                d="M40 77a2.83 2.83 0 01-3 2.89 40 40 0 1133.5-65.76 2.83 2.83 0 01-.57 4.12c-1.34.98-3.2.67-4.3-.58A34 34 0 1037 73.87c1.65.14 3 1.47 3 3.13z"/>
                        </svg>

                    </div>

                    <h3 className="form-app__title h3">
                        Waiting For Confirmation
                    </h3>

                    <p className="transction-submitted__text">
                        Confirm this transaction in your wallet
                    </p>

                </div>

            </div>

        </article>
    )
}